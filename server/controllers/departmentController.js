const BaseController = require('./BaseControllers');
const { departments } = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('DepartmentController');

class Controller extends BaseController {
    constructor() {
        super(departments);
    }
}

module.exports = new Controller();