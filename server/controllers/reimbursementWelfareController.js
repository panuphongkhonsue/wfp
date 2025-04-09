const BaseController = require('./BaseControllers');
const { viewReimbursements } = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('viewReimbursementsController');
const { Sequelize} = require("sequelize");


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
                order: [
                    [
                        Sequelize.literal(`CASE 
                            WHEN status = 'รอตรวจสอบ' THEN 1
                            WHEN status = 'อนุมัติ' THEN 2
                            ELSE 3
                        END`), 'ASC'
                    ],
                    [
                        Sequelize.literal(`CASE 
                            WHEN status = 'รอตรวจสอบ' THEN id
                            ELSE NULL
                        END`), 'ASC'
                    ],
                    [
                        Sequelize.literal(`CASE 
                            WHEN status = 'อนุมัติ' THEN updated_at
                            ELSE NULL
                        END`), 'DESC'
                    ]
                ]
                
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