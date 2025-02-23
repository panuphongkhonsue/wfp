const BaseController = require('./BaseControllers');
const { viewReimbursements} = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('viewReimbursementsController');

class Controller extends BaseController {
    constructor() {
        super(viewReimbursements);
      }

    list = async (req, res, next) => {
        const method = 'GetAllReimbursements';
        const { userId } = req.user;
        try {
            const { filter, page, itemPerPage } = req.query;
            var whereObj = { ...filter }
            const reimbursementsList = await viewReimbursements.paginate({
                page: page && !isNaN(page) ? Number(page) : 1,
                paginate: itemPerPage && !isNaN(itemPerPage) ? Number(itemPerPage) : 10,
                where: whereObj,
                order: [['updated_at', 'DESC'], ['request_date', 'DESC']]
            });
            logger.info('Complete', { method, data: { userId } });
            res.status(200).json(reimbursementsList);
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