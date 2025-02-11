var express = require('express');
var router = express.Router();
const reimbursementChildrenEducationController = require('../controllers/reimbursementChildrenEducationController');
const { authPermission, bindFilter, getRemaining, checkRemaining, bindCreate } = require('../middleware/childrenEducation');

router.get('/', authPermission, bindFilter, reimbursementChildrenEducationController.list);
router.get('/remaining', authPermission, getRemaining , reimbursementChildrenEducationController.getRemainingChildFund);
router.post('/', authPermission,bindCreate, getRemaining, checkRemaining, reimbursementChildrenEducationController.create);
module.exports = router;