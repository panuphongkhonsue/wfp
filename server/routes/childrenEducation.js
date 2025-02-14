var express = require('express');
var router = express.Router();
const reimbursementChildrenEducationController = require('../controllers/reimbursementChildrenEducationController');
const { authPermission, bindFilter, getRemaining, checkRemaining, bindCreate, bindUpdate,deletedMiddleware,byIdMiddleWare, authPermissionEditor, checkNullValue } = require('../middleware/childrenEducation');

router.get('/', authPermission, bindFilter, reimbursementChildrenEducationController.list);
router.get('/remaining', authPermission, getRemaining , reimbursementChildrenEducationController.getRemainingChildFund);

router.get('/:id',authPermission, byIdMiddleWare, reimbursementChildrenEducationController.getById);
router.get('/get-welfare/:id',authPermissionEditor, byIdMiddleWare, reimbursementChildrenEducationController.getById);

router.post('/', authPermission, checkNullValue, bindCreate, getRemaining, checkRemaining, reimbursementChildrenEducationController.create);

router.put('/:id', authPermission, bindUpdate, getRemaining, checkRemaining, reimbursementChildrenEducationController.update);
router.put('/get-welfare/:id', authPermissionEditor, checkNullValue, bindUpdate, getRemaining, checkRemaining, reimbursementChildrenEducationController.update);

router.delete('/:id', authPermission, deletedMiddleware, reimbursementChildrenEducationController.deleteReimbursement);
module.exports = router;