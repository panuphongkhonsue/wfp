var express = require('express');
var router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
const { authPermission, bindFilter} = require('../middleware/user')

router.get('/', authPermission, bindFilter ,subCategoryController.list);
module.exports = router;
