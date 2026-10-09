const express = require("express");

const router = express.Router();

const {
    register,
    login,
    googleLogin
} = require("../controllers/authController");


// Normal registration
router.post("/register", register);


// Normal email/password login
router.post("/login", login);


// Google login
router.post("/google", googleLogin);


module.exports = router;