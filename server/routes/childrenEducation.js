var express = require('express');
var router = express.Router();
const childrenEducationController = require('../controllers/childrenEducationController');
const { authPermission, bindFilter, getRemaining, checkRemaining } = require('../middleware/childrenEducation')

router.get('/', authPermission, bindFilter, childrenEducationController.list);
router.get('/remaining', authPermission, getRemaining , childrenEducationController.getRemainingChildFund);
module.exports = router;