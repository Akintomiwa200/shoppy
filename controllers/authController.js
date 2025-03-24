import User from "../models/userModel.js";
import sendMail from "../utils/emailService.js"; // ✅ Ensure correct path
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";



dotenv.config();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Signup Controller
export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });

        await newUser.save();

        // Send Welcome Email
        await sendMail(
            email,
            "Welcome to PlantStack 🎉",
            `<h1>Hi ${name},</h1>
             <p>Welcome to PlantStack! Your account has been successfully created.</p>
             <p>Login anytime: <a href="https://yourapp.com/login">Login Here</a></p>`
        );

        res.status(201).json({ message: "User registered successfully", user: { id: newUser._id, name, email, role } });
    } catch (error) {
        res.status(500).json({ message: "Error during signup", error: error.message });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id, user.role);

        res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Error during login", error: error.message });
    }
};

// Get User Profile (Protected)
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving profile", error: error.message });
    }
};

// Logout (Client-side token removal)
export const logout = (req, res) => {
    res.json({ message: "Logout successful. Please remove the token from your client storage." });
};

// Request Password Reset (Generate Reset Token)
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry

        await user.save();

        // Send Password Reset Email
        const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;
        await sendMail(
            email,
            "Reset Your Password",
            `<h1>Password Reset Request</h1>
             <p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>If you did not request this, please ignore this email.</p>`
        );

        res.json({ message: "Password reset email sent. Check your inbox.", resetToken });
    } catch (error) {
        res.status(500).json({ message: "Error processing password reset", error: error.message });
    }
};


// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Password reset successful. You can now log in with your new password." });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};

// Middleware: Verify JWT Token
export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Middleware: Check Admin Role
export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Authorization error", error: error.message });
    }
};
