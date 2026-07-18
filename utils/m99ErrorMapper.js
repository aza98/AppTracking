function map99minutosError(error) {
    if (error.response) {
        const { status, data } = error.response;
        const detail = data && data.message ? data.message : undefined;
        const traceId = data && data.traceId ? data.traceId : undefined;
        if (status === 401 || status === 403) {
            return { status: 502, code: 'M99_UNAUTHORIZED', message: '99minutos rejected the configured API credentials.', detail, traceId };
        }
        if (status === 404) {
            return { status: 404, code: 'M99_NOT_FOUND', message: 'No shipment was found for that tracking number.', detail, traceId };
        }
        if (status === 429) {
            return { status: 429, code: 'M99_RATE_LIMITED', message: '99minutos tracking quota exceeded. Please try again shortly.', detail, traceId };
        }
        if (status >= 500) {
            return { status: 502, code: 'M99_UPSTREAM_ERROR', message: "99minutos' tracking service is currently unavailable.", detail, traceId };
        }
        return { status: 502, code: 'M99_REQUEST_FAILED', message: '99minutos rejected the tracking request.', detail, traceId };
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return { status: 504, code: 'M99_TIMEOUT', message: 'The request to 99minutos timed out.' };
    }
    return { status: 502, code: 'M99_NETWORK_ERROR', message: 'Could not reach the 99minutos tracking service.' };
}

module.exports = { map99minutosError };
