const express = require("express");

const {
    getCustomerContracts,
    getFreelancerContracts,
    submitReview,
    getFreelancerReviews
} = require("../controllers/contractController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// CUSTOMER CONTRACTS
router.get(
    "/customer",
    authenticateToken,
    authorizeRoles("CUSTOMER"),
    getCustomerContracts
);


// FREELANCER CONTRACTS
router.get(
    "/freelancer",
    authenticateToken,
    authorizeRoles("FREELANCER"),
    getFreelancerContracts
);


// CUSTOMER SUBMITS REVIEW
router.post(
    "/reviews",
    authenticateToken,
    authorizeRoles("CUSTOMER"),
    submitReview
);


// FREELANCER VIEWS REVIEWS
router.get(
    "/reviews/freelancer",
    authenticateToken,
    authorizeRoles("FREELANCER"),
    getFreelancerReviews
);


module.exports = router;