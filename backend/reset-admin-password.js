
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const bcrypt = require("bcrypt");
const db = require("./config/db");

async function resetAdminPassword() {
    try {
        const email = "admin@freelancerhub.com";
        const newPassword = "Admin@12345";

        const [users] = await db.query(
            "SELECT user_id, email FROM users WHERE email = ? AND role = 'ADMIN'",
            [email]
        );

        if (users.length === 0) {
            console.log("Admin account not found:", email);
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query(
            "UPDATE users SET password = ? WHERE user_id = ?",
            [hashedPassword, users[0].user_id]
        );

        console.log("Admin password reset successfully!");
        console.log("Email:", email);
        console.log("Password:", newPassword);
    } catch (error) {
        console.error("Password reset failed:", error.message);
    } finally {
        // Close the pool only if it was successfully created and used.
        // This script is intended to be run once.
        if (db && typeof db.end === "function") {
            await db.end();
        }
    }
}

resetAdminPassword();