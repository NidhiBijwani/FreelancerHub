const db = require("../config/db");

// GET CUSTOMER PROFILE
const getCustomerProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [rows] = await db.query(
            `SELECT
                u.user_id,
                u.name,
                u.email,
                u.phone,
                c.customer_id,
                c.company_name,
                c.bio
             FROM users u
             JOIN customers c
                ON u.user_id = c.user_id
             WHERE u.user_id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Customer profile not found"
            });
        }

        res.json({
            message: "Customer profile retrieved successfully",
            customer: rows[0]
        });

    } catch (error) {
        console.error("Get customer profile error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve customer profile",
            error: error.message
        });
    }
};


// GET CUSTOMER PROJECTS
const getCustomerProjects = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [rows] = await db.query(
            `SELECT
                p.project_id,
                p.title,
                p.description,
                p.category,
                p.budget,
                p.deadline,
                p.status,
                p.created_at
             FROM projects p
             JOIN customers c
                ON p.customer_id = c.customer_id
             WHERE c.user_id = ?
             ORDER BY p.created_at DESC`,
            [userId]
        );

        res.json({
            message: "Customer projects retrieved successfully",
            total_projects: rows.length,
            projects: rows
        });

    } catch (error) {
        console.error("Get customer projects error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve projects",
            error: error.message
        });
    }
};


// CREATE PROJECT
const createProject = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const {
            title,
            description,
            category,
            budget,
            deadline
        } = req.body;

        // Validate required fields
        if (!title || !description || budget === undefined) {
            return res.status(400).json({
                message: "Title, description and budget are required"
            });
        }

        // Get customer ID
        const [customers] = await db.query(
            `SELECT customer_id
             FROM customers
             WHERE user_id = ?`,
            [userId]
        );

        if (customers.length === 0) {
            return res.status(404).json({
                message: "Customer profile not found"
            });
        }

        const customerId = customers[0].customer_id;

        // Insert project
        const [result] = await db.query(
            `INSERT INTO projects
            (
                customer_id,
                title,
                description,
                category,
                budget,
                deadline
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                customerId,
                title,
                description,
                category || null,
                budget,
                deadline || null
            ]
        );

        res.status(201).json({
            message: "Project created successfully",
            project_id: result.insertId
        });

    } catch (error) {
        console.error("Create project error:", error.message);

        res.status(500).json({
            message: "Failed to create project",
            error: error.message
        });
    }
};


module.exports = {
    getCustomerProfile,
    getCustomerProjects,
    createProject
};