const db = require("../config/db");


// GET PROPOSALS FOR CUSTOMER'S PROJECT
const getProjectProposals = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const projectId = req.params.projectId;

        const [projects] = await db.query(
            `SELECT
                p.project_id,
                p.title
             FROM projects p
             JOIN customers c
                ON p.customer_id = c.customer_id
             WHERE p.project_id = ?
             AND c.user_id = ?`,
            [projectId, userId]
        );

        if (projects.length === 0) {
            return res.status(404).json({
                message: "Project not found or you do not have access"
            });
        }

        const [proposals] = await db.query(
            `SELECT
                p.proposal_id,
                p.project_id,
                p.proposal_text,
                p.proposed_amount,
                p.estimated_days,
                p.status,
                p.submitted_at,
                f.freelancer_id,
                u.name AS freelancer_name,
                f.professional_title,
                f.hourly_rate,
                f.experience_years,
                f.location
             FROM proposals p
             JOIN freelancers f
                ON p.freelancer_id = f.freelancer_id
             JOIN users u
                ON f.user_id = u.user_id
             WHERE p.project_id = ?
             ORDER BY p.submitted_at DESC`,
            [projectId]
        );

        res.json({
            message: "Project proposals retrieved successfully",
            project: projects[0],
            total_proposals: proposals.length,
            proposals
        });

    } catch (error) {
        console.error("Get project proposals error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve project proposals",
            error: error.message
        });
    }
};


// ACCEPT PROPOSAL AND CREATE CONTRACT
const acceptProposal = async (req, res) => {
    let connection;

    try {
        const userId = req.user.user_id;
        const proposalId = req.params.proposalId;

        connection = await db.getConnection();

        await connection.beginTransaction();

        // Verify proposal belongs to customer's project
        const [proposalRows] = await connection.query(
            `SELECT
                p.proposal_id,
                p.project_id,
                p.freelancer_id,
                p.proposed_amount,
                p.status,
                pr.title,
                pr.status AS project_status,
                c.customer_id
             FROM proposals p
             JOIN projects pr
                ON p.project_id = pr.project_id
             JOIN customers c
                ON pr.customer_id = c.customer_id
             WHERE p.proposal_id = ?
             AND c.user_id = ?
             FOR UPDATE`,
            [proposalId, userId]
        );

        if (proposalRows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Proposal not found or you do not have access"
            });
        }

        const proposal = proposalRows[0];

        if (proposal.status !== "PENDING") {
            await connection.rollback();

            return res.status(400).json({
                message: "Only pending proposals can be accepted"
            });
        }

        if (proposal.project_status !== "OPEN") {
            await connection.rollback();

            return res.status(400).json({
                message: "Only open projects can have proposals accepted"
            });
        }

        // Reject all other pending proposals
        await connection.query(
            `UPDATE proposals
             SET status = 'REJECTED'
             WHERE project_id = ?
             AND proposal_id != ?
             AND status = 'PENDING'`,
            [
                proposal.project_id,
                proposalId
            ]
        );

        // Accept selected proposal
        await connection.query(
            `UPDATE proposals
             SET status = 'ACCEPTED'
             WHERE proposal_id = ?`,
            [proposalId]
        );

        // Create contract
        const [contractResult] = await connection.query(
            `INSERT INTO contracts
            (
                project_id,
                proposal_id,
                customer_id,
                freelancer_id,
                agreed_amount,
                start_date,
                status
            )
            VALUES (?, ?, ?, ?, ?, CURDATE(), 'ACTIVE')`,
            [
                proposal.project_id,
                proposalId,
                proposal.customer_id,
                proposal.freelancer_id,
                proposal.proposed_amount
            ]
        );

        // Update project status
        await connection.query(
            `UPDATE projects
             SET status = 'IN_PROGRESS'
             WHERE project_id = ?`,
            [proposal.project_id]
        );

        await connection.commit();

        res.json({
            message: "Proposal accepted and contract created successfully",
            contract_id: contractResult.insertId,
            project_id: proposal.project_id,
            proposal_id: proposalId
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error("Accept proposal error:", error.message);

        res.status(500).json({
            message: "Failed to accept proposal",
            error: error.message
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};


module.exports = {
    getProjectProposals,
    acceptProposal
};