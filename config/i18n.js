const path = require('path');
const i18next = require('i18next');
const middleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');

const NAMESPACES = ['common', 'nav', 'index', 'form', 'new', 'edit', 'contact', 'error', 'datatable', 'errors', 'tracking'];

i18next.use(Backend).use(middleware.LanguageDetector).init({
    preload: ['en', 'es'],
    supportedLngs: ['en', 'es'],
    fallbackLng: 'en',
    ns: NAMESPACES,
    defaultNS: 'common',
    backend: {
        loadPath: path.join(__dirname, '..', 'locales', '{{lng}}', '{{ns}}.json')
    },
    detection: {
        order: ['cookie', 'header'],
        lookupCookie: 'i18next',
        caches: ['cookie'],
        cookieExpirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        cookieSameSite: 'lax'
    }
});

module.exports = { i18next, middleware };
