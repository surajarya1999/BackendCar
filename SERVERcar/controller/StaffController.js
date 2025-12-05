const Staff = require("../model/staff");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class StaffController {
    // 👤 Register Staff
    static async register(req, res) {
        try {
            const { name, email, password, staffId, department, designation } = req.body;

            // Email already exists check
            const existingStaff = await Staff.findOne({ email });
            if (existingStaff) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // Staff ID already exists check
            const existingStaffId = await Staff.findOne({ staffId });
            if (existingStaffId) {
                return res.status(400).json({ message: "Staff ID already exists" });
            }

            // Password hash
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new staff (approval by default false)
            const newStaff = new Staff({
                name,
                email,
                password: hashedPassword,
                staffId,
                department,
                designation,
                role: "staff",
                isApproved: false   // ✅ by default false
            });

            await newStaff.save();
            res.status(201).json({ message: "Staff registered successfully, pending admin approval" });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }

    // 🔐 Login Staff
    static async login(req, res) {
        try {
            const { staffId, email, password } = req.body;

            // Staff ko find karo dono me se kisi ek field se
            const staff = await Staff.findOne({
                $or: [{ staffId }, { email }]
            });

            if (!staff) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // ✅ Approval check
            if (!staff.isApproved) {
                return res.status(403).json({ message: "Your account is not approved by admin yet" });
            }

            const isMatch = await bcrypt.compare(password, staff.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { userId: staff._id, role: staff.role },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({
                message: "Login successful",
                role: staff.role,
                name: staff.name,
                email: staff.email,
                staffId: staff.staffId,
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

    // 📄 Get Staff Profile
    static async getProfile(req, res) {
        try {
            const staff = await Staff.findById(req.user.userId).select("-password");
            res.status(200).json({
                success: true,
                message: "Staff data displayed",
                data: staff
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching profile", error });
        }
    }

    static async getAllStaff(req, res) {
        try {
            const staffList = await Staff.find().select("-password");
            res.status(200).json({ success: true, data: staffList });
        } catch (error) {
            res.status(500).json({ message: "Error fetching staff list", error });
        }
    }

    // ✅ Admin Approve Staff
    static async approveStaff(req, res) {
        try {
            const { id } = req.params;
            const staff = await Staff.findByIdAndUpdate(
                id,
                { isApproved: true },
                { new: true }
            );
            if (!staff) {
                return res.status(404).json({ message: "Staff not found" });
            }
            res.status(200).json({ message: "Staff approved successfully", staff });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }

    // ✅ Admin Reject Staff (delete)
    static async rejectStaff(req, res) {
        try {
            const { id } = req.params;
            const staff = await Staff.findByIdAndDelete(id);
            if (!staff) {
                return res.status(404).json({ message: "Staff not found" });
            }
            res.status(200).json({ message: "Staff rejected and deleted" });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }
}

module.exports = StaffController;
