var express = require('express');
var router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authPermission } = require('../middleware/dashboard');

router.get('/', authPermission, dashboardController.listAll);
module.exports = router;
