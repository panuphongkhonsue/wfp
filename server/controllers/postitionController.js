const BaseController = require('./BaseControllers');
const { positions } = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('EmployeeTypeController');

class Controller extends BaseController {
    constructor() {
        super(positions);
    }
}

module.exports = new Controller();