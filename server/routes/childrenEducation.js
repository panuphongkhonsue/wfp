var express = require('express');
var router = express.Router();
const childrenEducationController = require('../controllers/childrenEducationController');
const { authPermission, bindFilter, getRemaining } = require('../middleware/childrenEducation')

router.get('/', authPermission, bindFilter, childrenEducationController.list);
router.get('/remaining', authPermission, childrenEducationController.getRemainingChildFund);
module.exports = router;