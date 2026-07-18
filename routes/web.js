const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

router.get('/', shippingController.getAllShipments);
router.get('/new', shippingController.getNewShipment);
router.post('/add', shippingController.addShipment);
router.get('/edit/:id', shippingController.getEditShipment);
router.post('/update/:id', shippingController.updateShipment);
router.get('/delete/:id', shippingController.deleteShipment);
router.get('/track/:id', shippingController.getShipmentTracking);
router.get('/contact', shippingController.getContact);
router.get('/lang/:lng', shippingController.setLanguage);
router.get('/health', shippingController.getHealth);

module.exports = router;
