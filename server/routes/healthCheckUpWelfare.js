var express = require('express');
var router = express.Router();
const reimbursementsGeneralController = require('../controllers/healthCheckUpWelfareController');
const { authPermission, bindFilter, getRemaining, checkRemaining } = require('../middleware/healthCheckUpWelfare')
router.get('/', authPermission, bindFilter, reimbursementsGeneralController.list);
router.get('/remaining', authPermission, getRemaining, reimbursementsGeneralController.getRemaining);
router.get('/:id', authPermission, reimbursementsGeneralController.getById);
router.post('/', authPermission, getRemaining, checkRemaining, reimbursementsGeneralController.create);
// router.put('/:id', authPermission, reimbursementsGeneralController.update);
// router.delete('/:id', authPermission, reimbursementsGeneralController.delete);
module.exports = router;