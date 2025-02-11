var express = require('express');
var router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authPermission, bindGetDataDashboard } = require('../middleware/dashboard');

router.get('/', authPermission, bindGetDataDashboard, dashboardController.list);
module.exports = router;
