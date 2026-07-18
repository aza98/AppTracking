const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/dhl/track/:trackingNumber', apiController.infoDhlShipment);
router.get('/99minutos/track/:trackingNumber', apiController.info99minutosShipment);

module.exports = router;
