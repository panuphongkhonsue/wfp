const BaseController = require('./BaseControllers');
const { reimbursementsGeneral, categories, sequelize } = require('../models/mariadb');
const { Op, fn, col, literal } = require("sequelize");
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
    getRemaining = async (req, res, next) => {
        const method = 'GetRemaining';
        const { userId } = req.user;
        try {
            const { filter } = req.query;
            var whereObj = { ...filter }
            const results = await reimbursementsGeneral.findOne({
                attributes: [
                    [col("category.id"), "categoryId"],
                    [fn("SUM", col("reimbursementsGeneral.fund_sum_request")), "totalSumRequested"],
                    [col("category.fund"), "fund"],
                    [
                        literal("category.fund - SUM(reimbursementsGeneral.fund_sum_request)"),
                        "fundRemaining"
                    ],
                    [fn("COUNT", col("reimbursementsGeneral.fund_sum_request")), "totalCountRequested"],
                    [col("category.per_years"), "perYears"],
                    [
                        literal("category.per_years - COUNT(reimbursementsGeneral.fund_sum_request)"),
                        "requestsRemaining"
                    ]
                ],
                include: [
                    {
                        model: categories,
                        as: "category",
                        attributes: []
                    }
                ],
                where: whereObj,
                group: ["category.id"]
            });
            if (results) {
                const datas = JSON.parse(JSON.stringify(results));
                if (datas.fundRemaining === 0 || datas.requestsRemaining === 0) datas.canRequest = false;
                logger.info('Complete', { method, data: { userId } });
                return res.status(200).json({
                    datas: datas,
                    canRequest: datas.canRequest ?? true,
                });
            };
            logger.info('Data not Found', { method, data: { userId } });
            res.status(400).json({
                message: "ไม่พบข้อมูลที่ต้องการ กรุณาลองอีกครั้ง"
            });
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