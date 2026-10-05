const express = require("express");

const {
    getProjectProposals,
    acceptProposal
} = require("../controllers/projectController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// GET PROPOSALS FOR A PROJECT
router.get(
    "/:projectId/proposals",
    authenticateToken,
    authorizeRoles("CUSTOMER"),
    getProjectProposals
);


// ACCEPT A PROPOSAL
router.put(
    "/proposals/:proposalId/accept",
    authenticateToken,
    authorizeRoles("CUSTOMER"),
    acceptProposal
);


module.exports = router;