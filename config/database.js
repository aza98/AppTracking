const mongoose = require('mongoose');

const connectDB = () => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
    db.once('open', () => {
        console.log('Conexión a MongoDB');
    });
    mongoose.connect(process.env.DB_URI).catch(() => {});
};

const isConnected = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, isConnected };
