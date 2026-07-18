const Shipping = require('../models/shipping');
const { fetchDhlTracking, fetchM99Tracking } = require('./apiController');
const { isConnected } = require('../config/database');

exports.getAllShipments = async (req, res, next) => {
    try {
        const shipments = await Shipping.find().exec();
        res.render('index', { shipments });
    } catch (err) {
        next(err);
    }
};

exports.getNewShipment = (req, res) => {
    res.render('new');
};

exports.addShipment = async (req, res, next) => {
    try {
        const { trackingNumber, parcelService, shippingDate } = req.body;
        await new Shipping({ trackingNumber, parcelService, shippingDate }).save();
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

exports.getEditShipment = async (req, res, next) => {
    try {
        const shipment = await Shipping.findById(req.params.id).exec();
        if (!shipment) {
            const err = new Error('Shipment not found');
            err.status = 404;
            return next(err);
        }
        res.render('edit', { shipping: shipment });
    } catch (err) {
        next(err);
    }
};

exports.updateShipment = async (req, res, next) => {
    try {
        const { trackingNumber, parcelService, shippingDate } = req.body;
        await Shipping.findByIdAndUpdate(req.params.id, { trackingNumber, parcelService, shippingDate }).exec();
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

exports.deleteShipment = async (req, res, next) => {
    try {
        await Shipping.findByIdAndDelete(req.params.id).exec();
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

exports.getShipmentTracking = async (req, res, next) => {
    try {
        const shipment = await Shipping.findById(req.params.id).exec();
        if (!shipment) {
            const err = new Error('Shipment not found');
            err.status = 404;
            return next(err);
        }

        const carrierKey = (shipment.parcelService || '').trim().toUpperCase();
        let result;
        if (carrierKey === 'DHL') {
            result = await fetchDhlTracking(shipment.trackingNumber);
        } else if (carrierKey.includes('99')) {
            result = await fetchM99Tracking(shipment.trackingNumber);
        } else {
            result = null;
        }

        res.render('tracking', {
            shipment,
            dto: result && result.ok ? result.dto : null,
            error: result && !result.ok
                ? { ...result.error, message: req.t(`errors:${result.error.code}`, result.error.message) }
                : null,
            unsupported: result === null
        });
    } catch (err) {
        next(err);
    }
};

exports.getContact = (req, res) => {
    res.render('contact');
};

exports.getHealth = (req, res) => {
    const dbUp = isConnected();
    res.status(dbUp ? 200 : 503).json({ status: dbUp ? 'ok' : 'error', db: dbUp ? 'connected' : 'disconnected' });
};

const SUPPORTED_LANGUAGES = ['en', 'es'];

exports.setLanguage = (req, res) => {
    const { lng } = req.params;
    if (SUPPORTED_LANGUAGES.includes(lng)) {
        res.cookie('i18next', lng, { maxAge: 1000 * 60 * 60 * 24 * 365, sameSite: 'lax' });
    }
    const redirect = req.query.redirect;
    const isSafeRedirect = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//');
    res.redirect(isSafeRedirect ? redirect : '/');
};
