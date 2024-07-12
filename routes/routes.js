const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shippingController");
const apiController = require("../controllers/apiController");

// Todos los envíos
router.get("/", shippingController.getAllShipments);

// Creación de envío
router.get("/new", shippingController.getNewShipment);

// Guardar un nuevo envío
router.post("/add", shippingController.addShipment);

// Editar un envío
router.get("/edit/:id", shippingController.getEditShipment);

// Actualizar un envío
router.post("/update/:id", shippingController.updateShipment);

// Eliminar un envío
router.get("/delete/:id", shippingController.deleteShipment);

// Info del contacto
router.get("/contact", shippingController.getContact);

// Ruta para obtener información de envío de DHL
router.get('/dhl/track/:trackingNumber', apiController.infoDhlShipment);

// Ruta para obtener información de envío de DHL
router.get('/99minutos/track/:trackingNumber', apiController.info99minutosShipment);

module.exports = router;
