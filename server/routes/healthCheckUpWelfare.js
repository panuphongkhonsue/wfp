var express = require('express');
var router = express.Router();
const reimbursementsGeneralController = require('../controllers/healthCheckUpWelfareController');
const { authPermission, bindFilter, getRemaining, checkRemaining, bindUpdate, bindCreate, deletedMiddleware } = require('../middleware/healthCheckUpWelfare')
router.get('/', authPermission, bindFilter, reimbursementsGeneralController.list);
router.get('/remaining', authPermission, getRemaining, reimbursementsGeneralController.getRemaining);
router.get('/:id', authPermission, reimbursementsGeneralController.getById);
router.post('/', authPermission, bindCreate, getRemaining, checkRemaining, reimbursementsGeneralController.create);
router.put('/:id', authPermission, bindUpdate, getRemaining, checkRemaining, reimbursementsGeneralController.update);
router.delete('/:id', authPermission, deletedMiddleware, reimbursementsGeneralController.delete);
module.exports = router;