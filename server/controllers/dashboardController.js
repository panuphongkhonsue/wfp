const BaseController = require('./BaseControllers');
const { viewDashboard } = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('viewDashboardController');


class Controller extends BaseController {
    constructor() {
        super(viewDashboard);
    } 

    list = async (req, res, next) => {
        const method = 'GetAllViewDashboard';
        const { userId } = req.user;
        try {
            const { filter, page, itemPerPage } = req.query;
            var whereObj = { ...filter }
            const dashboardDataList = await viewDashboard.paginate({
                page: page && !isNaN(page) ? Number(page) : 1,
                paginate: itemPerPage && !isNaN(itemPerPage) ? Number(itemPerPage) : 10,
                where: whereObj
            });
            logger.info('Complete', { method, data: { userId } });
            res.status(200).json(dashboardDataList);
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