const express = require("express");

const {
    sendMessage,
    getMyMessages,
    markMessageAsRead,
    getMyNotifications,
    markNotificationAsRead
} = require("../controllers/communicationController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// SEND MESSAGE
router.post(
    "/messages",
    authenticateToken,
    sendMessage
);


// GET MY MESSAGES
router.get(
    "/messages",
    authenticateToken,
    getMyMessages
);


// MARK MESSAGE AS READ
router.put(
    "/messages/:messageId/read",
    authenticateToken,
    markMessageAsRead
);


// GET MY NOTIFICATIONS
router.get(
    "/notifications",
    authenticateToken,
    getMyNotifications
);


// MARK NOTIFICATION AS READ
router.put(
    "/notifications/:notificationId/read",
    authenticateToken,
    markNotificationAsRead
);


module.exports = router;