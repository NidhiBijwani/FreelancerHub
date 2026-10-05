const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const freelancerRoutes = require("./routes/freelancerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const projectRoutes = require("./routes/projectRoutes");
const contractRoutes = require("./routes/contractRoutes");
const communicationRoutes = require("./routes/communicationRoutes");

const authenticateToken = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());


// HOME ROUTE
app.get("/", (req, res) => {
    res.json({
        message: "FreelancerHub 2.0 API is running"
    });
});


// DATABASE TEST
app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT COUNT(*) AS total FROM users"
        );

        res.json({
            message: "Database connection successful",
            total_users: rows[0].total
        });

    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });
    }
});


// AUTH ROUTES
app.use("/api/auth", authRoutes);


// CUSTOMER ROUTES
app.use("/api/customer", customerRoutes);


// FREELANCER ROUTES
app.use("/api/freelancer", freelancerRoutes);


// ADMIN ROUTES
app.use("/api/admin", adminRoutes);


// PROJECT & PROPOSAL ROUTES
app.use("/api/projects", projectRoutes);


// CONTRACT & REVIEW ROUTES
app.use("/api/contracts", contractRoutes);


// COMMUNICATION ROUTES
app.use("/api/communication", communicationRoutes);


// PROTECTED TEST ROUTE
app.get(
    "/api/protected",
    authenticateToken,
    (req, res) => {
        res.json({
            message: "You have accessed a protected route.",
            user: req.user
        });
    }
);


// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});