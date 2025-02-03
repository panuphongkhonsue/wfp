const BaseController = require('./BaseControllers');
const { logSubCategory } = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('logSubCategoryController');

class Controller extends BaseController {
    constructor() {
        super(logSubCategory);
    }
}
module.exports = new Controller();