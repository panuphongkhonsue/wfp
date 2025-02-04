const BaseController = require('./BaseControllers');
const { roles } = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('RoleController');
const roleType = require('../enum/role')
const { Op } = require('sequelize')
class Controller extends BaseController {
    constructor() {
        super(roles);
    }
    listAll = async (req, res, next) => {
        const method = 'GetAllRoles';
        const { userId } = req.user;
        try {
            const roleList = await roles.findAll({
                where: { id: { [Op.ne]: roleType.adminUser } }
            });

            logger.info('Complete', { method, data: { userId } });
            res.status(200).json(roleList);
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    }
}

module.exports = new Controller();