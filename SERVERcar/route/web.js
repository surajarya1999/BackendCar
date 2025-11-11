const express = require('express')
const CarController = require('../controller/admin/CarController');
const bookingController = require('../controller/admin/BookingController');
const { isAuthenticated , isAdmin} = require('../middleware/security');
const userController = require('../controller/userController');
const StaffController = require('../controller/StaffController');
const AdminController = require('../controller/AdminController');
const FeedbackController = require('../controller/FeedbackController');
const ContactController = require('../controller/ContactController');
const StatsController = require('../controller/admin/StatsController');
const PaymentController = require('../controller/PaymentController');
const route = express.Router()


//user
route.post("/register/customer", userController.register);;
route.post("/login", userController.login);
route.post("/logout", userController.logout);
route.get("/profile", isAuthenticated, userController.getProfile);

// staff
route.post("/register/staff", StaffController.register);
route.post("/staff/login", StaffController.login);
route.post("/logout", StaffController.logout);
route.get("/profile", isAuthenticated, StaffController.getProfile);
route.put("/approve/:id", StaffController.approveStaff);
route.delete("/reject/:id", StaffController.rejectStaff);
route.get("/display", StaffController.getAllStaff);



// admin
route.post("/register/admin", AdminController.register);
route.post("/admin/login", AdminController.login);
route.post("/logout", AdminController.logout);
route.get("/profile", isAuthenticated, AdminController.getProfile);
route.put("/approve/:id", isAuthenticated, isAdmin, StaffController.approveStaff);
route.delete("/reject/:id", isAuthenticated, isAdmin, StaffController.rejectStaff);

//// car Add /////
route.post('/carinsert', CarController.carCreate)
route.get('/cardisplay', CarController.carDisplay)
route.get('/carview/:id', CarController.carView)
route.put('/carupdate/:id', CarController.carUpdate)
route.delete('/cardelete/:id', CarController.carDelete)
//// car Add /////

// Booking Routes
route.post('/bookinginsert',bookingController.createBooking)
route.get('/userdisplay',isAuthenticated,bookingController.userBookedDisplay)
route.get('/bookingdisplay', bookingController.bookingDisplay)
route.put("/bookings/:id/approve", bookingController.approveBooking);
route.put("/bookings/:id/reject", bookingController.rejectBooking);
route.delete("/bookings/:id/delete", bookingController.deleteBooking);

// Feedback Routes
route.post('/feedback', FeedbackController.createFeedback);
route.get("/feedback", FeedbackController.getAllFeedbacks);

// Contact Routes
route.post("/contacts", ContactController.createContact);
route.get("/contacts", ContactController.getContacts);
route.put("/contacts/:id/reply", ContactController.replyToContact);
route.delete("/contacts/:id", ContactController.deleteContact);
// 👇 ye add karna hoga routes me
route.post("/contacts/:id/message", ContactController.addMessage);
route.get("/contacts/email/:email", ContactController.getContactByEmail);




// Export the router
route.get("/stats", StatsController.getStats);

// Razorpay Payment Routes
// backend
route.post("/createOrder", PaymentController.createOrder);
route.post("/verifyPayment", PaymentController.verifyPayment);







module.exports = route