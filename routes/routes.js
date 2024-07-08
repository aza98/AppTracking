const express = require("express");
const router = express.Router();
const Shipping = require("../models/shipping");

// Todos los envíos
router.get("/", async (req, res, next) => {
  try {
    const shipments = await Shipping.find();
    res.render("index", { shipments });
  } catch (err) {
    next(err);
  }
});

// Creación de envío
router.get("/new", (req, res) => {
  res.render("new");
});

// Creación de envío
router.get("/contact", (req, res) => {
  res.render("contact");
});

// Guardar un nuevo envío
router.post("/add", async (req, res, next) => {
  try {
    const { trackingNumber, parcelService, shippingDate } = req.body;
    const newShipping = new Shipping({ trackingNumber, parcelService, shippingDate });
    await newShipping.save();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

// Formulario de edición de envío
router.get("/edit/:id", async (req, res, next) => {
  try {
    const shipment = await Shipping.findById(req.params.id);
    res.render("edit", { shipping: shipment });
  } catch (err) {
    next(err);
  }
});

// Ruta para actualizar un envío
router.post("/update/:id", async (req, res, next) => {
  try {
    const { trackingNumber, parcelService, shippingDate } = req.body;
    await Shipping.findByIdAndUpdate(req.params.id, { trackingNumber, parcelService, shippingDate });
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

// Ruta para eliminar un envío
router.get("/delete/:id", async (req, res, next) => {
  try {
    await Shipping.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

// API de DHL
router.get("/api/v3/shipments/tracking/:trackingNumber", async (req, res, next) => {
  const trackingNumber = req.params.trackingNumber;
  const url = `https://api-eu.dhl.com/track/shipments/${trackingNumber}`;
  try {
    const response = await fetch(url, {
      headers: {
        // Agrega la API key de DHL
        "DHL-API-Key": "Add-API-Key"
      }
    });
    if (response.status === 401) {
      res.set('WWW-Authenticate', 'Bearer realm="Add-API-Key');
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// API de 99minutos
router.get("/api/v3/shipments/tracking/:trackingNumber/99minutos", async (req, res, next) => {
  const trackingNumber = req.params.trackingNumber;
  const url = `https://delivery.99minutos.com/api/v3/shipments/tracking/${trackingNumber}`;
  try {
    const response = await fetch(url, {
      headers: {
        // Agrega la API key de 99minutos
        "Authorization": "Bearer Add-API-Key"
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
