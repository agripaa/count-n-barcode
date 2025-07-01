const express = require('express');
const router = express.Router();

const authRoute = require('./authRoutes');
const userRoute = require('./userRoutes');
const identityRoute = require('./identityRoutes');
const countingRoute = require('./countingRoutes');
const barcodeRoute = require('./barcodeRoutes');

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/identity", identityRoute);
router.use("/barcode", barcodeRoute);
router.use("/counting", countingRoute);

module.exports = router;