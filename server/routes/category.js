var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authPermission, bindFilter} = require('../middleware/user')

router.get('/', authPermission, bindFilter ,categoryController.list);
module.exports = router;
