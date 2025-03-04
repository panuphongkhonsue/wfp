var express = require('express');
var router = express.Router();
const { createPdfGeneral } = require('../controllers/export/general');
const { fetchDataHealthCheckup, fetchDataMedical, fetchDataDental } = require('../middleware/export/general');
const { createPdfAssist } = require('../controllers/export/assist');
const { fetchDataVarious, fetchDataFuneralFamily } = require('../middleware/export/assist');
const { createPdfFuneralDeceaseEmployee } = require('../controllers/export/funeralDeceaseEmployee');
const { fetchDataFuneralDeceaseEmployee } = require('../middleware/export/funeralDeceaseEmployee');
router.get('/health-check-up/:id', fetchDataHealthCheckup, createPdfGeneral);

router.get('/dental/:id', fetchDataDental, createPdfGeneral);

router.get('/medical/:id', fetchDataMedical, createPdfGeneral);

router.get('/various/:id', fetchDataVarious, createPdfAssist);

router.get('/various-Funeral-Family/:id', fetchDataFuneralFamily, createPdfAssist);

router.get('/funeral-Decease-Employee/:id', fetchDataFuneralDeceaseEmployee, createPdfFuneralDeceaseEmployee);
module.exports = router;