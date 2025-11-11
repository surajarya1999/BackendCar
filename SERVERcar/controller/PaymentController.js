require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const BookingModel = require("../model/Booking");


var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,   // ✅ env ka naam use karo
    key_secret: process.env.RAZORPAY_KEY_SECRET, // ✅
});

class PaymentController {
    // 🔹 Order Create
    static createOrder = async (req, res) => {
        try {
            const { amount, bookingId } = req.body;

            if (!amount || !bookingId) {
                return res.status(400).json({ success: false, message: "Amount or bookingId missing" });
            }
            console.log("Received payload:", req.body);


            const options = {
                amount: amount, // amount in paise
                currency: "INR",
                receipt: `receipt_${bookingId}`,
            };

            const order = await instance.orders.create(options);

            res.json({ success: true, order });
        } catch (error) {
            console.error("Create Order Error:", error);
            res.status(500).json({ success: false, message: "Failed to create order" });
        }
    };

    // 🔹 Verify Payment
    static verifyPayment = async (req, res) => {
        try {
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                bookingId,
                amount,
                paymentMethod,
            } = req.body;

            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
                return res.status(400).json({ success: false, message: "All fields required" });
            }

            // signature check
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(sign.toString())
                .digest("hex");

            if (razorpay_signature === expectedSign) {
                // Update booking after payment success
                await BookingModel.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    transactionId: razorpay_payment_id,
                    amountPaid: amount / 100, // convert paisa → rupee
                    paymentDate: new Date(),
                    paymentMethod: paymentMethod || "Razorpay",
                });

                return res.status(200).json({
                    success: true,
                    message: "Payment verified successfully",
                });
            } else {
                return res.status(400).json({ success: false, message: "Invalid signature" });
            }
        } catch (error) {
            console.error("Verify error:", error);
            res.status(500).json({ success: false, message: "Payment verification failed" });
        }
    };

}

module.exports = PaymentController;
