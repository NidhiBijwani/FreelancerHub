const express = require("express");

const {
    getCustomerProfile,
    getCustomerProjects,
    createProject
} = require("../controllers/customerController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Get customer profile
router.get(
    "/profile",
    authenticateToken,
    authorizeRoles("CUSTOMER"),
    getCustomerProfile
);

// Get customer's projects
router.get(
    "/projects",
    authenticateToken,
    authorizeRoles("CUSTOMER"),
    getCustomerProjects
);

// Create new project
router.post(
    "/projects",
    authenticateToken,
    authorizeRoles("CUSTOMER"),
    createProject
);

module.exports = router;