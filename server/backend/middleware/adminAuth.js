import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        // 1. Get Authorization header
        const authHeader = req.headers.authorization;

        // 2. Check if header exists and starts with Bearer
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing"
            });
        }

        // 3. Extract token
        const token = authHeader.split(" ")[1];

        // 4. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Check admin role
        if (!decoded || decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied (Admin only)"
            });
        }

        // 6. Attach admin info (optional but useful)
        req.admin = decoded;

        // 7. Proceed
        next();

    } catch (error) {
        console.error(error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default adminAuth;