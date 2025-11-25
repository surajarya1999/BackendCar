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
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            // Check user exist
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Match password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Create token
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            // Send Cookie (THIS IS THE FIX)
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,               // Netlify + Vercel required
                sameSite: "none",           // Cross-site cookie → FIX
                path: "/",                  // Cookie available to all routes
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                message: "Login successful",
                user,
                token,
            });

        } catch (error) {
            console.log("Login Error:", error);
            res.status(500).json({ message: "Server error", error });
        }
    };

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
