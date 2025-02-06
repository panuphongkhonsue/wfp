const BaseController = require('./BaseControllers');
const { reimbursementsGeneral, users, positions, sector, employeeTypes, roles, departments, children, sequelize } = require('../models/mariadb');
const { Op } = require('sequelize')
const { initLogger } = require('../logger');
const logger = initLogger('ReimbursementsGeneralController');
const { isNullOrEmpty } = require('./utility');

class Controller extends BaseController {
    constructor() {
        super(reimbursementsGeneral);
    }

    list = async (req, res, next) => {
        const method = 'GetListUser';
        const { userId } = req.user;
        try {
            const { filter, page, itemPerPage } = req.query;
            var whereObj = { ...filter }
            const listData = await reimbursementsGeneral.paginate({
                attributes: [
                    'id',
                    'reim_number',
                    'request_date',
                    'updated_at',
                    'fund_receipt',
                    'fund_eligible_sum',
                    'fund_sum_request',
                    'status',
                ],
                page: page && !isNaN(page) ? Number(page) : 1,
                paginate: itemPerPage && !isNaN(itemPerPage) ? Number(itemPerPage) : 0,
                where: whereObj,
                order: [['id', 'ASC']]
            });

            if (listData) {
                var bindList = {};
                bindList.pagination = {
                    page: page && !isNaN(page) ? Number(page) : 1,
                    total: listData.total
                }
                bindList.datas = listData.docs.map((listObj) => {
                    const plainObj = listObj.toJSON();
                    var reimNumber = plainObj.reim_number;
                    var requestDate = plainObj.request_date;
                    var updatedAt = plainObj.updated_at;
                    var fundReceipt = plainObj.fund_receipt;
                    var fundEligibleSum = plainObj.fund_eligible_sum;
                    var fundSumRequest = plainObj.fund_sum_request;
                    delete plainObj.reim_number;
                    delete plainObj.request_date;
                    delete plainObj.updated_at;
                    delete plainObj.fund_receipt;
                    delete plainObj.fund_eligible_sum;
                    delete plainObj.fund_sum_request;
                    return {
                        ...plainObj,
                        reimNumber: reimNumber,
                        requestDate: requestDate,
                        updatedAt: updatedAt,
                        fundReceipt: fundReceipt,
                        fundEligibleSum: fundEligibleSum,
                        fundSumRequest: fundSumRequest,
                    }
                });
                logger.info('Complete', { method, data: { userId } });
                res.status(200).json(bindList);
            }
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