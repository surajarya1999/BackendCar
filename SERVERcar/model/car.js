const mongoose = require('mongoose');

const carScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    fuelType: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
const CarModel = mongoose.models.Car || mongoose.model('Car', carScheme);

module.exports = CarModel;
