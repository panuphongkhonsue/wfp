var express = require('express');
var router = express.Router();
const userController = require('../controllers/usersController');
const { authPermission, bindFilter, bindCreate, bindUpdate, validateDuplicate } = require('../middleware/user')

router.get('/', authPermission, bindFilter, userController.list);
router.get('/:id', authPermission, userController.getById);
router.post('/', authPermission, bindCreate, validateDuplicate, userController.create);
router.put('/:id', authPermission, bindUpdate, validateDuplicate, userController.update);
router.delete('/:id', authPermission, userController.delete);
module.exports = router;