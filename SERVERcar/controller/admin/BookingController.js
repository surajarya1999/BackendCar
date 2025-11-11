const bookingModel = require("../../model/Booking");

const cloudinary = require('cloudinary');

// Setup
cloudinary.config({
    cloud_name: 'djprilnpn',
    api_key: '621695583687777',
    api_secret: 'd4IoBJf2UUrdq9Ilc5aK41DiIr0'
});

class bookingController {

    static createBooking = async (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({ success: false, message: 'Request body is missing' });
            }

            const { name, email, fromdate, todate, location, carId, status, document, testDrive, testDriveDate, testDriveTime  } = req.body;

            const from = new Date(fromdate);
            const to = new Date(todate);

            if (from > to) {
                return res.status(400).json({
                    success: false,
                    message: "From-date cannot be after To-date"
                });
            }

            // check for date overlap
            const existingBooking = await bookingModel.findOne({
                carId: carId,
                status: 'Confirmed',
                $or: [
                    { fromdate: { $lte: todate }, todate: { $gte: fromdate } }
                ]
            });

            if (existingBooking) {
                return res.status(400).json({
                    success: false,
                    message: 'This car is already booked during the selected dates.'
                });
            }

            // 👇 no upload here, we directly store Cloudinary URL
            const book = await bookingModel.create({
                name,
                email,
                fromdate,
                todate,
                location,
                carId,
                status: status || 'Pending',
                document // already URL
                , testDrive, testDriveDate, testDriveTime
            });

            return res.status(201).json({
                success: true,
                message: 'Booking successfully created!',
                data: book,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Server Error' });
        }
    };




    static userBookedDisplay = async (req, res) => {
        try {
            const { email } = req.query; // 👈 take email from query string

            if (!email) {
                return res.status(400).json({ success: false, message: "Email is required" });
            }

            const bookings = await bookingModel.find({ email }).populate('carId');
            return res.status(200).json({
                success: true,
                message: "User's bookings fetched successfully",
                data: bookings
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Server Error" });
        }
    };

    static bookingDisplay = async (req, res) => {
        try {
            const bookings = await bookingModel.find()
            return res.status(201).json({
                success: true,
                message: 'All car displayed',
                data: bookings
            })
        } catch (error) {

        }
    }

    static deleteBooking = async (req, res) => {
        try {
            const { id } = req.params;
            const booking = await bookingModel.findByIdAndDelete(id);

            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            res.status(200).json({ message: "Booking Deleted 🗑️" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    };


    static approveBooking = async (req, res) => {
        try {
            const { id } = req.params;
            const booking = await bookingModel.findByIdAndUpdate(
                id,
                { status: "Approved" },
                { new: true }
            );

            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            res.status(200).json({ message: "Booking Approved ✅", booking });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    };

    static rejectBooking = async (req, res) => {
        try {
            const { id } = req.params;
            const booking = await bookingModel.findByIdAndUpdate(
                id,
                { status: "Rejected" },
                { new: true }
            );

            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            res.status(200).json({ message: "Booking Rejected ❌", booking });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    };



}
module.exports = bookingController