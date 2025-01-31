const BaseController = require('./BaseControllers');
const { subCategories, categories, welfareTypes } = require('../models/mariadb');
const { isNullOrEmpty } = require('../middleware/utility');

const { initLogger } = require('../logger');
const logger = initLogger('categoryController');

class Controller extends BaseController {
    constructor() {
        super(categories);
    }

    list = async (req, res, next) => {
        const method = 'GetAllCategory';
        const { userId } = req.user;
        try {
            const { filter, page, itemPerPage } = req.query;
            var whereObj = { ...filter }
            const categoryList = await categories.paginate({
                page: page && !isNaN(page) ? Number(page) : 1,
                paginate: itemPerPage && !isNaN(itemPerPage) ? Number(itemPerPage) : 10,
                include: [
                    {
                        model: welfareTypes, as: 'welfare_type',
                    }
                ],
            });
            logger.info('Complete', { method, data: { userId } });
            res.status(200).json(categoryList);
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