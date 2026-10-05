const db = require("../config/db");


// SEND MESSAGE
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.user_id;

        const {
            receiver_id,
            message_text
        } = req.body;

        if (!receiver_id || !message_text) {
            return res.status(400).json({
                message: "Receiver ID and message are required"
            });
        }

        // Check receiver exists
        const [users] = await db.query(
            `SELECT user_id
             FROM users
             WHERE user_id = ?`,
            [receiver_id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "Receiver not found"
            });
        }

        if (Number(receiver_id) === Number(senderId)) {
            return res.status(400).json({
                message: "You cannot send a message to yourself"
            });
        }

        const [result] = await db.query(
            `INSERT INTO messages
            (
                sender_id,
                receiver_id,
                message_text
            )
            VALUES (?, ?, ?)`,
            [
                senderId,
                receiver_id,
                message_text
            ]
        );

        res.status(201).json({
            message: "Message sent successfully",
            message_id: result.insertId
        });

    } catch (error) {
        console.error("Send message error:", error.message);

        res.status(500).json({
            message: "Failed to send message",
            error: error.message
        });
    }
};


// GET MY MESSAGES
const getMyMessages = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [rows] = await db.query(
            `SELECT
                m.message_id,
                m.sender_id,
                sender.name AS sender_name,
                m.receiver_id,
                receiver.name AS receiver_name,
                m.message_text,
                m.is_read,
                m.sent_at
             FROM messages m
             JOIN users sender
                ON m.sender_id = sender.user_id
             JOIN users receiver
                ON m.receiver_id = receiver.user_id
             WHERE m.sender_id = ?
                OR m.receiver_id = ?
             ORDER BY m.sent_at DESC`,
            [
                userId,
                userId
            ]
        );

        res.json({
            message: "Messages retrieved successfully",
            total_messages: rows.length,
            messages: rows
        });

    } catch (error) {
        console.error("Get messages error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve messages",
            error: error.message
        });
    }
};


// MARK MESSAGE AS READ
const markMessageAsRead = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const messageId = req.params.messageId;

        const [result] = await db.query(
            `UPDATE messages
             SET is_read = TRUE
             WHERE message_id = ?
             AND receiver_id = ?`,
            [
                messageId,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        res.json({
            message: "Message marked as read"
        });

    } catch (error) {
        console.error("Mark message read error:", error.message);

        res.status(500).json({
            message: "Failed to update message",
            error: error.message
        });
    }
};


// GET MY NOTIFICATIONS
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [rows] = await db.query(
            `SELECT
                notification_id,
                title,
                message,
                is_read,
                created_at
             FROM notifications
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json({
            message: "Notifications retrieved successfully",
            total_notifications: rows.length,
            notifications: rows
        });

    } catch (error) {
        console.error("Get notifications error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve notifications",
            error: error.message
        });
    }
};


// MARK NOTIFICATION AS READ
const markNotificationAsRead = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const notificationId = req.params.notificationId;

        const [result] = await db.query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE notification_id = ?
             AND user_id = ?`,
            [
                notificationId,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.json({
            message: "Notification marked as read"
        });

    } catch (error) {
        console.error(
            "Mark notification read error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to update notification",
            error: error.message
        });
    }
};


module.exports = {
    sendMessage,
    getMyMessages,
    markMessageAsRead,
    getMyNotifications,
    markNotificationAsRead
};