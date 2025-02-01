var express = require('express');
var router = express.Router();
const configWelfareController = require('../controllers/configWelfareController');
const { authPermission } = require('../middleware/user');
const { bindFilter } = require('../middleware/configWelfare');

router.get('/', authPermission, bindFilter, configWelfareController.list);
module.exports = router;
