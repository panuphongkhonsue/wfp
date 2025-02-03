const BaseController = require('./BaseControllers');
const { employeeTypes } = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('EmployeeTypeController');

class Controller extends BaseController {
    constructor() {
        super(employeeTypes);
    }
}

module.exports = new Controller();