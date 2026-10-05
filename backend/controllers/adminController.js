const db = require("../config/db");


// GET ADMIN DASHBOARD STATISTICS
const getDashboardStats = async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT COUNT(*) AS total_users FROM users"
        );

        const [customers] = await db.query(
            "SELECT COUNT(*) AS total_customers FROM customers"
        );

        const [freelancers] = await db.query(
            "SELECT COUNT(*) AS total_freelancers FROM freelancers"
        );

        const [projects] = await db.query(
            "SELECT COUNT(*) AS total_projects FROM projects"
        );

        const [openProjects] = await db.query(
            `SELECT COUNT(*) AS open_projects
             FROM projects
             WHERE status = 'OPEN'`
        );

        const [proposals] = await db.query(
            "SELECT COUNT(*) AS total_proposals FROM proposals"
        );

        const [contracts] = await db.query(
            "SELECT COUNT(*) AS total_contracts FROM contracts"
        );

        const [reviews] = await db.query(
            "SELECT COUNT(*) AS total_reviews FROM reviews"
        );

        res.json({
            message: "Admin dashboard statistics retrieved successfully",
            statistics: {
                total_users: users[0].total_users,
                total_customers: customers[0].total_customers,
                total_freelancers: freelancers[0].total_freelancers,
                total_projects: projects[0].total_projects,
                open_projects: openProjects[0].open_projects,
                total_proposals: proposals[0].total_proposals,
                total_contracts: contracts[0].total_contracts,
                total_reviews: reviews[0].total_reviews
            }
        });

    } catch (error) {
        console.error("Dashboard statistics error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve dashboard statistics",
            error: error.message
        });
    }
};


// GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
                user_id,
                name,
                email,
                role,
                phone,
                created_at
             FROM users
             ORDER BY created_at DESC`
        );

        res.json({
            message: "Users retrieved successfully",
            total_users: rows.length,
            users: rows
        });

    } catch (error) {
        console.error("Get all users error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve users",
            error: error.message
        });
    }
};


// GET ALL PROJECTS
const getAllProjects = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
                p.project_id,
                p.title,
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
             ORDER BY p.created_at DESC`
        );

        res.json({
            message: "Projects retrieved successfully",
            total_projects: rows.length,
            projects: rows
        });

    } catch (error) {
        console.error("Get all projects error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve projects",
            error: error.message
        });
    }
};


// GET ALL PROPOSALS
const getAllProposals = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
                p.proposal_id,
                p.project_id,
                pr.title AS project_title,
                u.name AS freelancer_name,
                p.proposed_amount,
                p.estimated_days,
                p.status,
                p.submitted_at
             FROM proposals p
             JOIN projects pr
                ON p.project_id = pr.project_id
             JOIN freelancers f
                ON p.freelancer_id = f.freelancer_id
             JOIN users u
                ON f.user_id = u.user_id
             ORDER BY p.submitted_at DESC`
        );

        res.json({
            message: "Proposals retrieved successfully",
            total_proposals: rows.length,
            proposals: rows
        });

    } catch (error) {
        console.error("Get all proposals error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve proposals",
            error: error.message
        });
    }
};


module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllProjects,
    getAllProposals
};