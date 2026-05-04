import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Check token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing"
            });
        }

        // 2. Extract token
        const token = authHeader.split(" ")[1];

        console.log("TOKEN:", token);

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("DECODED USER:", decoded); 
        
        // 4. Attach user info (BEST PRACTICE)
        req.user = decoded;  // { id: ... }

        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authUser;