const express = require("express");

const {
    getFreelancerProfile,
    getAvailableProjects,
    submitProposal
} = require("../controllers/freelancerController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/profile",
    authenticateToken,
    authorizeRoles("FREELANCER"),
    getFreelancerProfile
);

router.get(
    "/projects",
    authenticateToken,
    authorizeRoles("FREELANCER"),
    getAvailableProjects
);

router.post(
    "/proposals",
    authenticateToken,
    authorizeRoles("FREELANCER"),
    submitProposal
);

module.exports = router;
