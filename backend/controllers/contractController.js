const db = require("../config/db");


// GET CUSTOMER CONTRACTS
const getCustomerContracts = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [rows] = await db.query(
            `SELECT
                c.contract_id,
                c.project_id,
                p.title AS project_title,
                c.proposal_id,
                u.name AS freelancer_name,
                f.freelancer_id,
                c.agreed_amount,
                c.start_date,
                c.end_date,
                c.status,
                c.created_at
             FROM contracts c
             JOIN projects p
                ON c.project_id = p.project_id
             JOIN freelancers f
                ON c.freelancer_id = f.freelancer_id
             JOIN users u
                ON f.user_id = u.user_id
             JOIN customers cu
                ON c.customer_id = cu.customer_id
             WHERE cu.user_id = ?
             ORDER BY c.created_at DESC`,
            [userId]
        );

        res.json({
            message: "Customer contracts retrieved successfully",
            total_contracts: rows.length,
            contracts: rows
        });

    } catch (error) {
        console.error("Get customer contracts error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve customer contracts",
            error: error.message
        });
    }
};


// GET FREELANCER CONTRACTS
const getFreelancerContracts = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [rows] = await db.query(
            `SELECT
                c.contract_id,
                c.project_id,
                p.title AS project_title,
                c.proposal_id,
                u.name AS customer_name,
                cu.customer_id,
                c.agreed_amount,
                c.start_date,
                c.end_date,
                c.status,
                c.created_at
             FROM contracts c
             JOIN projects p
                ON c.project_id = p.project_id
             JOIN customers cu
                ON c.customer_id = cu.customer_id
             JOIN users u
                ON cu.user_id = u.user_id
             JOIN freelancers f
                ON c.freelancer_id = f.freelancer_id
             WHERE f.user_id = ?
             ORDER BY c.created_at DESC`,
            [userId]
        );

        res.json({
            message: "Freelancer contracts retrieved successfully",
            total_contracts: rows.length,
            contracts: rows
        });

    } catch (error) {
        console.error("Get freelancer contracts error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve freelancer contracts",
            error: error.message
        });
    }
};


// SUBMIT REVIEW
const submitReview = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const {
            project_id,
            freelancer_id,
            rating,
            comment
        } = req.body;

        if (
            !project_id ||
            !freelancer_id ||
            rating === undefined
        ) {
            return res.status(400).json({
                message: "Project ID, freelancer ID and rating are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        // Find customer
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

        // Check that the project is completed
        const [projects] = await db.query(
            `SELECT project_id, status
             FROM projects
             WHERE project_id = ?
             AND customer_id = ?`,
            [
                project_id,
                customerId
            ]
        );

        if (projects.length === 0) {
            return res.status(404).json({
                message: "Project not found or you do not own this project"
            });
        }

        if (projects[0].status !== "COMPLETED") {
            return res.status(400).json({
                message: "Review can only be submitted after the project is completed"
            });
        }

        // Check valid contract
        const [contracts] = await db.query(
            `SELECT contract_id
             FROM contracts
             WHERE project_id = ?
             AND customer_id = ?
             AND freelancer_id = ?
             AND status = 'COMPLETED'`,
            [
                project_id,
                customerId,
                freelancer_id
            ]
        );

        if (contracts.length === 0) {
            return res.status(404).json({
                message: "No completed contract found for this project and freelancer"
            });
        }

        // Check duplicate review
        const [existingReviews] = await db.query(
            `SELECT review_id
             FROM reviews
             WHERE customer_id = ?
             AND freelancer_id = ?
             AND project_id = ?`,
            [
                customerId,
                freelancer_id,
                project_id
            ]
        );

        if (existingReviews.length > 0) {
            return res.status(409).json({
                message: "Review already submitted for this project"
            });
        }

        const [result] = await db.query(
            `INSERT INTO reviews
            (
                customer_id,
                freelancer_id,
                project_id,
                rating,
                comment
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                customerId,
                freelancer_id,
                project_id,
                rating,
                comment || null
            ]
        );

        res.status(201).json({
            message: "Review submitted successfully",
            review_id: result.insertId
        });

    } catch (error) {
        console.error("Submit review error:", error.message);

        res.status(500).json({
            message: "Failed to submit review",
            error: error.message
        });
    }
};


// GET FREELANCER REVIEWS
const getFreelancerReviews = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [rows] = await db.query(
            `SELECT
                r.review_id,
                r.project_id,
                p.title AS project_title,
                u.name AS customer_name,
                r.rating,
                r.comment,
                r.created_at
             FROM reviews r
             JOIN projects p
                ON r.project_id = p.project_id
             JOIN customers c
                ON r.customer_id = c.customer_id
             JOIN users u
                ON c.user_id = u.user_id
             JOIN freelancers f
                ON r.freelancer_id = f.freelancer_id
             WHERE f.user_id = ?
             ORDER BY r.created_at DESC`,
            [userId]
        );

        res.json({
            message: "Freelancer reviews retrieved successfully",
            total_reviews: rows.length,
            reviews: rows
        });

    } catch (error) {
        console.error("Get freelancer reviews error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve freelancer reviews",
            error: error.message
        });
    }
};


module.exports = {
    getCustomerContracts,
    getFreelancerContracts,
    submitReview,
    getFreelancerReviews
};