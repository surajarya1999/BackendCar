const Admin = require("../model/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AdminController {
    // 👤 Register Admin
    static async register(req, res) {
        try {
            // ✅ Check if any admin already exists
            const existingAdmin = await Admin.findOne({});
            if (existingAdmin) {
                return res.status(400).json({ message: "Admin already registered" });
            }

            const { name, email, password } = req.body;

            // ✅ Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // ✅ Create new admin
            const newAdmin = new Admin({
                name,
                email,
                password: hashedPassword,
                role: "admin"
            });

            await newAdmin.save();
            res.status(201).json({ message: "Admin registered successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error", error });
        }
    }


    // 🔐 Login Admin
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { userId: admin._id, role: admin.role },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            // Send token in cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({
                message: "Login successful",
                role: admin.role,
                name: admin.name,
                email: admin.email
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }

    // 🚪 Logout
    static async logout(req, res) {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    }

    // 📄 Get Admin Profile
    static async getProfile(req, res) {
        try {
            const admin = await Admin.findById(req.user.userId).select("-password");
            res.status(200).json({
                success: true,
                message: "Admin data displayed",
                data: admin
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching profile", error });
        }
    }
}

module.exports = AdminController;
