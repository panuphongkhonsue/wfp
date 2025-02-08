var express = require('express');
var router = express.Router();
const reimbursementsAssistController = require('../controllers/variousWelfareController');
const { authPermission, bindFilter, getRemaining, checkRemaining } = require('../middleware/variousWelfare')
router.get('/', authPermission, bindFilter, reimbursementsAssistController.list);
router.get('/remaining', authPermission, getRemaining, reimbursementsAssistController.getRemaining);
router.get('/:id', authPermission, reimbursementsAssistController.getById);
router.post('/', authPermission, getRemaining, checkRemaining, reimbursementsAssistController.create);
// router.put('/:id', authPermission, reimbursementsGeneralController.update);
// router.delete('/:id', authPermission, reimbursementsGeneralController.delete);
module.exports = router;