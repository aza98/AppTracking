require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

const app = express();
const port = process.env.PORT || 3000;

// Conexión a la base de datos
mongoose.connect("mongodb://localhost:27017/Parcel");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
    console.log("Conexión a MongoDB");
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Configuración de EJS como motor de plantillas
app.set("view engine", "ejs");

// Rutas
app.use('/', routes);
app.use('/api', routes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`El servidor se ejecuta en el puerto: http://localhost:${port}`);
});
