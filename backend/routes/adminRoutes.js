const express = require("express");

const {
    getDashboardStats,
    getAllUsers,
    getAllProjects,
    getAllProposals
} = require("../controllers/adminController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getDashboardStats
);

router.get(
    "/users",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getAllUsers
);

router.get(
    "/projects",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getAllProjects
);

router.get(
    "/proposals",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getAllProposals
);

module.exports = router;
