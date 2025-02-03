const BaseController = require('./BaseControllers');
const { sector } = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('RoleController');

class Controller extends BaseController {
    constructor() {
        super(sector);
    }
}

module.exports = new Controller();