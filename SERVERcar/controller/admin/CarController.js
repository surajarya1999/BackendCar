const CarModel = require('../../model/car');
const cloudinary = require('cloudinary');

// Setup
cloudinary.config({
    cloud_name: 'djprilnpn',
    api_key: '621695583687777',
    api_secret: 'd4IoBJf2UUrdq9Ilc5aK41DiIr0'
});


class CarController {

    static carCreate = async (req, res) => {
        try {
            // console.log(req.body)
            const { name, model, color, fuelType, price } = req.body
            if (!name || !model || !color || !fuelType || !price) {
                return res.status(400).json({
                    success: false,
                    message: 'All Fields are Require!'
                })
            }
            const file = req.files.image
            const imageUpload = await cloudinary.uploader.upload(
                file.tempFilePath,
                {
                    folder: 'carRental_AddCar'
                }
            )
            // console.log(imageUpload)
            const car = await CarModel.create({
                name,
                model,
                color,
                fuelType,
                price,
                image: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url
                }
            })
            return res.status(201).json({
                success: true,
                message: 'Car Added done!',
                data: car
            })

        } catch (error) {
            console.log(error)
        }
    }

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
            const id = req.params.id;
            const { name, model, color, fuelType, price } = req.body;

            // update object
            const updateData = { name, model, color, fuelType, price };

            if (req.files && req.files.image) {
                const Admin = await CarModel.findById(id);

                if (Admin?.image?.public_id) {
                    await cloudinary.uploader.destroy(Admin.image.public_id);
                }

                // नई image upload
                const imagefile = req.files.image;
                const imageupdate = await cloudinary.uploader.upload(
                    imagefile.tempFilePath,
                    { folder: "carRental_AddCar" } // same folder as in create
                );

                updateData.image = {
                    public_id: imageupdate.public_id,
                    url: imageupdate.secure_url,
                };
            }

            await CarModel.findByIdAndUpdate(id, updateData);

            return res.status(201).json({
                success: true,
                message: "Car Updated successfully",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong!",
            });
        }
    };



}
module.exports = CarController