function toDhlTrackingDto(raw) {
    const shipment = raw && Array.isArray(raw.shipments) ? raw.shipments[0] : null;
    if (!shipment) {
        return null;
    }
    const place = (location) => location ? (location.address?.addressLocality || location.address?.countryCode || null) : null;
    const statusText = (status) => status ? (status.description || status.status || null) : null;
    return {
        trackingNumber: shipment.id || null,
        carrier: 'DHL',
        service: shipment.service || null,
        status: {
            code: shipment.status?.statusCode || null,
            description: statusText(shipment.status),
            timestamp: shipment.status?.timestamp || null
        },
        estimatedDelivery: shipment.estimatedTimeOfDelivery || null,
        origin: place(shipment.origin),
        destination: place(shipment.destination),
        checkpoints: Array.isArray(shipment.events) ? shipment.events.map((event) => ({
            timestamp: event.timestamp || null,
            location: place(event.location),
            status: statusText(event),
            statusCode: event.statusCode || null
        })) : []
    };
}

module.exports = { toDhlTrackingDto };
