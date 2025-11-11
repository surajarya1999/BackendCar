const Customer = require("../../model/user"); // ya "../model/User" agar file capital me hai
const Booking = require("../../model/Booking");
const Staff = require("../../model/staff");

class StatsController {
  static async getStats(req, res) {
    try {
      const customerCount = await Customer.countDocuments({ role: "customer" });
      const staffCount = await Staff.countDocuments({ role: "staff" }); // staff tab chalega agar schema me ho
      const bookingCount = await Booking.countDocuments();

      res.status(200).json({
        success: true,
        data: {
          customers: customerCount,
          staff: staffCount,
          bookings: bookingCount,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  }
}

module.exports = StatsController;
