var express = require('express');
var router = express.Router();
const { createPdfGeneral } = require('../controllers/export/general');
const { fetchDataHealthCheckup, fetchDataMedical, fetchDataDental } = require('../middleware/export/general');

router.get('/health-check-up/:id', fetchDataHealthCheckup, createPdfGeneral);

router.get('/dental/:id', fetchDataDental, createPdfGeneral);

router.get('/medical/:id', fetchDataMedical, createPdfGeneral);


module.exports = router;