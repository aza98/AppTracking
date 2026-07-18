function toM99TrackingDto(raw, trackingNumber) {
    const events = raw && raw.data && Array.isArray(raw.data.events) ? raw.data.events : null;
    if (!events || events.length === 0) {
        return null
    }
    const lastEvent = events[events.length - 1];
    return {
        trackingNumber,
        carrier: '99minutos',
        status: {
            code: lastEvent.statusCode,
            description: lastEvent.statusName,
            timestamp: lastEvent.createdAt
        },
        lastCheckpoint: (lastEvent.data && lastEvent.data.comment) || null,
        checkpoints: events.map((event) => ({
            timestamp: event.createdAt,
            statusCode: event.statusCode,
            status: event.statusName,
            comment: (event.data && event.data.comment) || null
        }))
    }
}
module.exports = {
    toM99TrackingDto
}
