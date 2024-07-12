const axios = require('axios');

// API DHL
exports.infoDhlShipment = async (req, res) => {
    const trackingNumber = req.params.trackingNumber;
    try {
        const response = await axios.get('https://api-eu.dhl.com/track/shipments', {
            params: {
                trackingNumber: trackingNumber
            },
            headers: {
                'DHL-API-Key': process.env.DHL_API_KEY,
                'DHL-API-Secret': process.env.DHL_API_SECRET
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to fetch shipment details'
        });
    }
};

// API 99minutos
exports.info99minutosShipment = async (req, res) => {
    const trackingNumber = req.params.trackingNumber;
    try {
        const response = await axios.post(
            `https://delivery.99minutos.com/api/v3/shipments/tracking/${trackingNumber}`, {}, {
                headers: {
                    'Authorization': `Bearer ${process.env.minutos_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to fetch shipment details'
        });
    }
};
