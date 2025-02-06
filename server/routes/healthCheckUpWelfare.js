var express = require('express');
var router = express.Router();
const reimbursementsGeneralController = require('../controllers/healthCheckUpWelfareController');
const { authPermission, bindFilter } = require('../middleware/healthCheckUpWelfare')
router.get('/', authPermission, bindFilter, reimbursementsGeneralController.list);
// router.get('/:id', authPermission, reimbursementsGeneralController.getById);
// router.post('/', authPermission, reimbursementsGeneralController.create);
// router.put('/:id', authPermission, reimbursementsGeneralController.update);
// router.delete('/:id', authPermission, reimbursementsGeneralController.delete);
module.exports = router;