const BaseController = require('./BaseControllers');
const { logCategory } = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('logCategoryController');

class Controller extends BaseController {
    constructor() {
        super(logCategory);
    }
}
module.exports = new Controller();