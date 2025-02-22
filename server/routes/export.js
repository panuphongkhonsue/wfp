var express = require('express');
var router = express.Router();
const { createPdfGeneral, createReceiptGeneral } = require('../controllers/export/general');
const { fetchDataHealthCheckup } = require('../middleware/export/general');

router.get('/health-check-up/:id', fetchDataHealthCheckup, createPdfGeneral);
router.get('/health-check-up-receipt/:id', fetchDataHealthCheckup, createReceiptGeneral);

router.get('/dental/:id', fetchDataHealthCheckup, createPdfGeneral);
router.get('/dental-receipt/:id', fetchDataHealthCheckup, createReceiptGeneral);

router.get('/medical/:id', fetchDataHealthCheckup, createPdfGeneral);
router.get('/medical-receipt/:id', fetchDataHealthCheckup, createReceiptGeneral);

module.exports = router;