const CarModel = require('../../model/car');
const cloudinary = require("../../config/cloudinary");



class CarController {

    static carCreate = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Image is required" });
            }

            // Cloudinary upload result
            const imageResult = req.file; // multer-storage-cloudinary returns file info

            const car = new CarModel({
                name: req.body.name,
                model: req.body.model,
                color: req.body.color,
                fuelType: req.body.fuelType,
                price: req.body.price,
                image: {
                    public_id: imageResult.filename,
                    url: imageResult.path
                }
            });

            await car.save();

            res.status(201).json({
                message: "Car added successfully",
                data: car
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    static carDisplay = async (req, res) => {
        try {
            const car = await CarModel.find()
            return res.status(201).json({
                success: true,
                message: 'car display Success!',
                data: car
            })
        } catch (error) {
            console.log(error)
        }
    }
    static carView = async (req, res) => {
        try {
            const id = req.params.id
            const car = await CarModel.findById(id)
            return res.status(201).json({
                success: true,
                message: 'car View Success!',
                data: car
            })
        } catch (error) {
            console.log(error)
        }
    }
    static carDelete = async (req, res) => {
        try {
            const id = req.params.id
            const carDlt = await CarModel.findByIdAndDelete(id)
            return res.status(201).json({
                success: true,
                message: 'car Delete done!',
                data: carDlt
            })
        } catch (error) {
            console.log(error)
        }
    }

    static carUpdate = async (req, res) => {
        try {
            const existingCar = await CarModel.findById(req.params.id);

            if (!existingCar) {
                return res.status(404).json({ message: "Car not found" });
            }

            let updatedImage = existingCar.image;

            if (req.file) {
                updatedImage = {
                    public_id: req.file.filename,
                    url: req.file.path
                };
            }

            const updatedCar = await CarModel.findByIdAndUpdate(
                req.params.id,
                {
                    name: req.body.name,
                    model: req.body.model,
                    color: req.body.color,
                    fuelType: req.body.fuelType,
                    price: req.body.price,
                    image: updatedImage,
                },
                { new: true }
            );

            res.status(200).json({
                message: "Car updated successfully",
                data: updatedCar
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };




}
module.exports = CarController