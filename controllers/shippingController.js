const Shipping = require("../models/shipping");

// Todos los envíos
exports.getAllShipments = async (req, res, next) => {
    try {
        const shipments = await Shipping.find().exec();
        res.render("index", {
            shipments
        });
    } catch (err) {
        next(err);
    }
};

// Creación de envío
exports.getNewShipment = (req, res) => {
    res.render("new");
};

// Guardar un nuevo envío
exports.addShipment = async (req, res, next) => {
    try {
        const {
            trackingNumber,
            parcelService,
            shippingDate
        } = req.body;
        const newShipping = new Shipping({
            trackingNumber,
            parcelService,
            shippingDate
        });
        await newShipping.save();
        res.redirect("/");
    } catch (err) {
        next(err);
    }
};

// Formulario de edición de envío
exports.getEditShipment = async (req, res, next) => {
    try {
        const shipment = await Shipping.findById(req.params.id).exec();
        res.render("edit", {
            shipping: shipment
        });
    } catch (err) {
        next(err);
    }
};

// Actualizar un envío
exports.updateShipment = async (req, res, next) => {
    try {
        const {
            trackingNumber,
            parcelService,
            shippingDate
        } = req.body;
        await Shipping.findByIdAndUpdate(req.params.id, {
            trackingNumber,
            parcelService,
            shippingDate
        }).exec();
        res.redirect("/");
    } catch (err) {
        next(err);
    }
};

// Eliminar un envío
exports.deleteShipment = async (req, res, next) => {
    try {
        await Shipping.findByIdAndDelete(req.params.id).exec();
        res.redirect("/");
    } catch (err) {
        next(err);
    }
};

// Información del contacto
exports.getContact = (req, res) => {
    res.render("contact");
};
