var express = require('express');
var router = express.Router();
const childrenEducationController = require('../controllers/childrenEducationController');
const { authPermission, bindFilter } = require('../middleware/childrenEducation')

router.get('/', authPermission, bindFilter, childrenEducationController.list);
router.get('/:id', authPermission, childrenEducationController.getById);
module.exports = router;