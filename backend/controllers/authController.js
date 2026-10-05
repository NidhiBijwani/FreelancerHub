const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// REGISTER
const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            phone
        } = req.body;

        // Check required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required"
            });
        }

        // Validate public registration roles
        // ADMIN accounts cannot be created through public registration
        const allowedRoles = ["CUSTOMER", "FREELANCER"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role. Only CUSTOMER or FREELANCER registration is allowed."
            });
        }

        // Check if email already exists
        const [existingUsers] = await db.query(
            "SELECT user_id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.query(
            `INSERT INTO users
            (name, email, password, role, phone)
            VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                role,
                phone || null
            ]
        );

        const userId = result.insertId;

        // Create role-specific record
        if (role === "CUSTOMER") {
            await db.query(
                `INSERT INTO customers
                (user_id)
                VALUES (?)`,
                [userId]
            );
        }

        if (role === "FREELANCER") {
            await db.query(
                `INSERT INTO freelancers
                (user_id)
                VALUES (?)`,
                [userId]
            );
        }

        res.status(201).json({
            message: "Registration successful",
            user: {
                user_id: userId,
                name,
                email,
                role
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


// LOGIN
const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const [users] = await db.query(
            `SELECT
                user_id,
                name,
                email,
                password,
                role,
                phone
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

module.exports = {
    register,
    login
};