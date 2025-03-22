const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token from request headers
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user payload to request
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden - Invalid Token" });
    }
};

/**
 * Middleware to check if the user is an Admin
 */
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden - Admin Access Required" });
    }
    next();
};

module.exports = { verifyToken, isAdmin };
