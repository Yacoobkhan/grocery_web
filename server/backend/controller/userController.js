import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// REGISTER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password too short" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = createToken(user._id);

        res.json({ success: true, token });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ADMIN LOGIN (better token structure)
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        //  console.log("BODY:", req.body);   // 🔥 debug
        // console.log("ENV:", process.env.ADMIN_EMAIL)

        // console.log("JWT:", process.env.JWT_SECRET);

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign(
                { role: "admin" },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.json({ success: true, token });
        }

        res.status(401).json({ success: false, message: "Invalid credentials" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { adminLogin, loginUser, registerUser };
