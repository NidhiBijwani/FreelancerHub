const db = require("../config/db");

// GET FREELANCER PROFILE
const getFreelancerProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [rows] = await db.query(
            `SELECT
                u.user_id,
                u.name,
                u.email,
                u.phone,
                f.freelancer_id,
                f.professional_title,
                f.bio,
                f.hourly_rate,
                f.experience_years,
                f.location,
                f.availability
             FROM users u
             JOIN freelancers f
                ON u.user_id = f.user_id
             WHERE u.user_id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Freelancer profile not found"
            });
        }

        res.json({
            message: "Freelancer profile retrieved successfully",
            freelancer: rows[0]
        });

    } catch (error) {
        console.error("Get freelancer profile error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve freelancer profile",
            error: error.message
        });
    }
};


// GET AVAILABLE PROJECTS
const getAvailableProjects = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
                p.project_id,
                p.title,
                p.description,
                p.category,
                p.budget,
                p.deadline,
                p.status,
                p.created_at,
                u.name AS customer_name,
                c.company_name
             FROM projects p
             JOIN customers c
                ON p.customer_id = c.customer_id
             JOIN users u
                ON c.user_id = u.user_id
             WHERE p.status = 'OPEN'
             ORDER BY p.created_at DESC`
        );

        res.json({
            message: "Available projects retrieved successfully",
            total_projects: rows.length,
            projects: rows
        });

    } catch (error) {
        console.error("Get available projects error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve available projects",
            error: error.message
        });
    }
};


// SUBMIT PROPOSAL
const submitProposal = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const {
            project_id,
            proposal_text,
            proposed_amount,
            estimated_days
        } = req.body;

        if (
            !project_id ||
            !proposal_text ||
            proposed_amount === undefined ||
            !estimated_days
        ) {
            return res.status(400).json({
                message: "Project ID, proposal text, proposed amount and estimated days are required"
            });
        }

        // Find freelancer profile
        const [freelancers] = await db.query(
            `SELECT freelancer_id
             FROM freelancers
             WHERE user_id = ?`,
            [userId]
        );

        if (freelancers.length === 0) {
            return res.status(404).json({
                message: "Freelancer profile not found"
            });
        }

        const freelancerId = freelancers[0].freelancer_id;

        // Check whether project exists and is open
        const [projects] = await db.query(
            `SELECT project_id
             FROM projects
             WHERE project_id = ?
             AND status = 'OPEN'`,
            [project_id]
        );

        if (projects.length === 0) {
            return res.status(404).json({
                message: "Open project not found"
            });
        }

        // Check duplicate proposal
        const [existingProposals] = await db.query(
            `SELECT proposal_id
             FROM proposals
             WHERE project_id = ?
             AND freelancer_id = ?`,
            [project_id, freelancerId]
        );

        if (existingProposals.length > 0) {
            return res.status(409).json({
                message: "You have already submitted a proposal for this project"
            });
        }

        const [result] = await db.query(
            `INSERT INTO proposals
            (
                project_id,
                freelancer_id,
                proposal_text,
                proposed_amount,
                estimated_days
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                project_id,
                freelancerId,
                proposal_text,
                proposed_amount,
                estimated_days
            ]
        );

        res.status(201).json({
            message: "Proposal submitted successfully",
            proposal_id: result.insertId
        });

    } catch (error) {
        console.error("Submit proposal error:", error.message);

        res.status(500).json({
            message: "Failed to submit proposal",
            error: error.message
        });
    }
};


module.exports = {
    getFreelancerProfile,
    getAvailableProjects,
    submitProposal
};