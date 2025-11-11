const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        fromdate: { type: String, required: true },
        todate: { type: String, required: true },
        location: { type: String, required: true },
        carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        document: {
            public_id: { type: String },
            url: { type: String },          // 👈 sirf url store karna
            resource_type: { type: String },// 👈 alag se rakho
            format: { type: String },       // 👈 optional but helpful (pdf, jpg, png)
        },

        // 🔥 Test Drive Fields
        testDrive: {
            type: Boolean,
            default: false,
        },
        testDriveDate: { type: String }, // yyyy-mm-dd
        testDriveTime: { type: String }, // hh:mm AM/PM

        // 💳 Payment Fields
        isPaid: {
            type: Boolean,
            default: false,
        },
        transactionId: {
            type: String, // Razorpay payment_id
        },
        paymentDate: {
            type: Date, // payment ka time
        },
        paymentMethod: {
            type: String, // Razorpay, UPI, Card etc.
        },
        amountPaid: {
            type: Number, // kitna amount pay hua
        },
    },
    { timestamps: true }
);

const bookingModel = mongoose.model('Bookings', bookingSchema);
module.exports = bookingModel;
