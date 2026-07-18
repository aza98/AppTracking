const axios = require('axios');
const { mapDhlError } = require('../utils/dhlErrorMapper');
const { toDhlTrackingDto } = require('../utils/dhlTrackingDto');
const { map99minutosError } = require('../utils/m99ErrorMapper');
const { toM99TrackingDto } = require('../utils/m99TrackingDto');
const { getAccessToken } = require('../utils/m99Auth');
const trackingCache = require('../utils/trackingCache');

const DHL_TRACKING_URL = 'https://api-eu.dhl.com/track/shipments';
const M99_TRACKING_URL = 'https://delivery.99minutos.com/api/v3/shipments/tracking';
const REQUEST_TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 15 * 60 * 1000;

async function fetchDhlTracking(trackingNumber) {
    const cacheKey = `dhl:${trackingNumber}`;
    const cached = trackingCache.get(cacheKey);
    if (cached) {
        return { ok: true, dto: cached };
    }
    try {
        const response = await axios.get(DHL_TRACKING_URL, {
            params: { trackingNumber },
            headers: { 'DHL-API-Key': process.env.DHL_API_KEY },
            timeout: REQUEST_TIMEOUT_MS
        });
        const dto = toDhlTrackingDto(response.data);
        if (!dto) {
            return { ok: false, error: { status: 404, code: 'DHL_NOT_FOUND', message: 'No shipment was found for that tracking number.' } };
        }
        trackingCache.set(cacheKey, dto, CACHE_TTL_MS);
        return { ok: true, dto };
    } catch (error) {
        const mapped = mapDhlError(error);
        console.error('DHL tracking request failed:', {
            trackingNumber,
            status: mapped.status,
            code: mapped.code,
            detail: mapped.detail
        });
        return { ok: false, error: mapped };
    }
}

async function fetchM99Tracking(trackingNumber) {
    const cacheKey = `m99:${trackingNumber}`;
    const cached = trackingCache.get(cacheKey);
    if (cached) {
        return { ok: true, dto: cached };
    }
    let accessToken;
    try {
        accessToken = await getAccessToken();
    } catch (error) {
        console.error('99minutos OAuth token request failed:', {
            status: error.response && error.response.status,
            detail: error.response && error.response.data
        });
        return { ok: false, error: { status: 502, code: 'M99_UNAUTHORIZED', message: '99minutos rejected the configured API credentials.' } };
    }
    try {
        const response = await axios.get(M99_TRACKING_URL, {
            params: { identifier: trackingNumber },
            headers: { 'Authorization': `Bearer ${accessToken}` },
            timeout: REQUEST_TIMEOUT_MS
        });
        const dto = toM99TrackingDto(response.data, trackingNumber);
        if (!dto) {
            return { ok: false, error: { status: 404, code: 'M99_NOT_FOUND', message: 'No shipment was found for that tracking number.' } };
        }
        trackingCache.set(cacheKey, dto, CACHE_TTL_MS);
        return { ok: true, dto };
    } catch (error) {
        const mapped = map99minutosError(error);
        console.error('99minutos tracking request failed:', {
            trackingNumber,
            status: mapped.status,
            code: mapped.code,
            detail: mapped.detail,
            traceId: mapped.traceId
        });
        return { ok: false, error: mapped };
    }
}

exports.fetchDhlTracking = fetchDhlTracking;
exports.fetchM99Tracking = fetchM99Tracking;

exports.infoDhlShipment = async (req, res) => {
    const result = await fetchDhlTracking(req.params.trackingNumber);
    if (!result.ok) {
        return res.status(result.error.status).json({ code: result.error.code, message: req.t(`errors:${result.error.code}`, result.error.message) });
    }
    res.json(result.dto);
};

exports.info99minutosShipment = async (req, res) => {
    const result = await fetchM99Tracking(req.params.trackingNumber);
    if (!result.ok) {
        return res.status(result.error.status).json({ code: result.error.code, message: req.t(`errors:${result.error.code}`, result.error.message) });
    }
    res.json(result.dto);
};
