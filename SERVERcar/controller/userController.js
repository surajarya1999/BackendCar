const Customer = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class userController {
    // Register Customer
    static async register(req, res) {
        try {
            const { name, email, password, number, address, dob } = req.body;
            

            const existingCustomer = await Customer.findOne({ email });
            if (existingCustomer) {
                return res.status(400).json({ message: "Email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newCustomer = new Customer({
                name,
                email,
                password: hashedPassword,
                number,
                address,
                dob,
                
            });

            await newCustomer.save();
            res.status(201).json({ message: "Customer registered successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }

    // Login Customer
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const customer = await Customer.findOne({ email });
            if (!customer) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, customer.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { userId: customer._id, role: "customer" },
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
                message: "Customer login successful",
                role: "customer",
                name: customer.name,
                email: customer.email
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }

    // 🚪 Logout Customer
    static async logout(req, res) {
        try {
            res.clearCookie("token");
            res.status(200).json({ message: "Customer logged out successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error during logout", error });
        }
    }


    // Get Customer Profile
    static async getProfile(req, res) {
        try {
            const customer = await Customer.findById(req.user.userId).select("-password");
            res.status(200).json({
                success: true,
                message: 'Customer data displayed',
                data: customer
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching profile", error });
        }
    }
}

module.exports = userController;
