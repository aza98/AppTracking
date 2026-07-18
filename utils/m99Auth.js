const axios = require('axios');

const M99_OAUTH_URL = 'https://delivery.99minutos.com/api/v3/oauth/token';
const REQUEST_TIMEOUT_MS = 8000;
const EXPIRY_SAFETY_MARGIN_MS = 60 * 1000;

let cachedToken = null;

async function getAccessToken() {
    if (cachedToken && Date.now() < cachedToken.expiresAt) {
        return cachedToken.accessToken;
    }
    const response = await axios.post(M99_OAUTH_URL, {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: REQUEST_TIMEOUT_MS
    });
    const { access_token, expires_in } = response.data;
    cachedToken = {
        accessToken: access_token,
        expiresAt: Date.now() + expires_in * 1000 - EXPIRY_SAFETY_MARGIN_MS
    };
    return cachedToken.accessToken;
}

module.exports = { getAccessToken };
