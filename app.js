require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');
const { i18next, middleware: i18nextMiddleware } = require('./config/i18n');
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(i18nextMiddleware.handle(i18next));
app.use((req, res, next) => {
    res.locals.t = req.t;
    res.locals.language = req.language;
    res.locals.currentUrl = req.originalUrl;
    next();
});
app.set('view engine', 'ejs');

app.use('/', webRoutes);
app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500);
    res.render('error', { message: req.t('error:genericMessage') });
});

app.listen(port, () => {
    console.log(`El servidor se ejecuta en el puerto: http://localhost:${port}`);
});
