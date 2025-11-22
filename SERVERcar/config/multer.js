const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "carRental_AddCar",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => Date.now(),
  },
});

module.exports = multer({ storage });
