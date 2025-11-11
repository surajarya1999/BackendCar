const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        staffId: { type: String, required: true },
        department: { type: String },
        designation: { type: String },

        // 👇 New Role Field
        role: {
            type: String,
            enum: ["staff"], // Allowed roles
            default: "staff",         // By default staff
        },

        isApproved: {
            type: Boolean,
            default: false,   // by default staff register hone ke baad approve nahi hoga
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);

