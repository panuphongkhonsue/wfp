var express = require('express');
var router = express.Router();
const userController = require('../controllers/usersController');
const { authPermission, bindFilter, bindCreate, bindUpdate, validateDuplicate } = require('../middleware/user')

router.get('/', authPermission, bindFilter, userController.list);
router.get('/userInitialData', bindFilter, userController.getUserInitialData);
router.get('/:id', userController.getById);
router.post('/', authPermission, bindCreate, validateDuplicate, userController.create);
router.put('/:id', authPermission, bindUpdate, validateDuplicate, userController.update);
router.delete('/:id', authPermission, userController.delete);
router.delete('/delete-child/:id', authPermission, userController.deletChild);
module.exports = router;