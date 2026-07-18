function mapDhlError(error) {
    if (error.response) {
        const { status, data } = error.response;
        const detail = data && (data.detail || data.title) ? (data.detail || data.title) : undefined;
        if (status === 401 || status === 403) {
            return { status: 502, code: 'DHL_UNAUTHORIZED', message: 'DHL rejected the configured API credentials.', detail };
        }
        if (status === 404) {
            return { status: 404, code: 'DHL_NOT_FOUND', message: 'No shipment was found for that tracking number.', detail };
        }
        if (status === 429) {
            return { status: 429, code: 'DHL_RATE_LIMITED', message: 'DHL tracking quota exceeded. Please try again shortly.', detail };
        }
        if (status >= 500) {
            return { status: 502, code: 'DHL_UPSTREAM_ERROR', message: "DHL's tracking service is currently unavailable.", detail };
        }
        return { status: 502, code: 'DHL_REQUEST_FAILED', message: 'DHL rejected the tracking request.', detail };
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return { status: 504, code: 'DHL_TIMEOUT', message: 'The request to DHL timed out.' };
    }
    return { status: 502, code: 'DHL_NETWORK_ERROR', message: 'Could not reach the DHL tracking service.' };
}

module.exports = { mapDhlError };
