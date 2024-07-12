const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    parcelService: {
        type: String,
        required: true,
    },
    trackingNumber: {
        type: String,
        required: true,
    },
    shippingDate: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('Shipping', shippingSchema);
