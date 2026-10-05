const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Check authentication first
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }

        // Check user role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. You do not have permission."
            });
        }

        next();
    };
};

module.exports = authorizeRoles;