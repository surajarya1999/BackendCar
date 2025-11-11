const FeedbackModel = require("../model/feedback");
const bookingModel = require("../model/Booking"); // path apne project ke hisaab se


class FeedbackController {
    // Insert Feedback
    static createFeedback = async (req, res) => {
        try {
            const { bookingId, carId, email, rating, comment } = req.body;

            if (!bookingId || !carId || !email || !rating) {
                return res.status(400).json({ success: false, message: "BookingId, CarId, Email and Rating are required" });
            }

            const feedback = await FeedbackModel.create({
                bookingId,
                carId,
                email,
                rating,
                comment,
            });


            res.status(201).json({ success: true, data: feedback });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    };

    // Get All Feedbacks

    static getAllFeedbacks = async (req, res) => {
        try {
            const feedbacks = await FeedbackModel.find()
                .populate("bookingId") 
                .populate("carId", "name image"); 

            res.status(200).json({ success: true, data: feedbacks });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    };

}

module.exports = FeedbackController;
