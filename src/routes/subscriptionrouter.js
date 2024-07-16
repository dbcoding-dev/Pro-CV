const express = require('express');
const router = express.Router();
const { SubscriptionCancelController } = require('../controller/subscriptionController.js');
const { authMiddleware } = require("../middleware/userMiddleware.js");

// İptal sayfasını görüntüle
router.get('/cancel-subscription', SubscriptionCancelController.getCancelSubscriptionPage);
router.post('/cancel-subscription', SubscriptionCancelController.cancelSubscription);
router.get('/panel/subscription-requests', authMiddleware, SubscriptionCancelController.getSubscriptionRequests);
router.post('/panel/subscription-requests/:id/:action', authMiddleware, SubscriptionCancelController.handleSubscriptionRequest);

module.exports = router;
