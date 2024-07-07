const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const express = require('express');
const path = require('path');
const app = express();

// JSON anahtar dosyanızın yolunu belirtin
const keyPath = path.join(__dirname, '../config/golden-ripsaw-423815-n8-fec60e9445c0.json');
const key = require(keyPath);

const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        client_email: key.client_email,
        private_key: key.private_key.replace(/\\n/g, '\n'),
    },
});

class GoogleAnalyticsController {
    async getReport() {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/448590545`, // GA4 Property ID
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'today',
                },
            ],
            metrics: [
                {
                    name: 'sessions',
                },
            ],
            dimensions: [
                {
                    name: 'date',
                },
            ],
        });

        return response;
    }
}

module.exports = { GoogleAnalyticsController };
