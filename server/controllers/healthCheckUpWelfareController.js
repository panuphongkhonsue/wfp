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
                    [col("category.id"), "category_id"],
                    [fn("SUM", col("reimbursementsGeneral.fund_sum_request")), "total_sum_requested"],
                    [col("category.fund"), "fund"],
                    [
                        literal("category.fund - SUM(reimbursementsGeneral.fund_sum_request)"),
                        "fund_remaining"
                    ],
                    [fn("COUNT", col("reimbursementsGeneral.fund_sum_request")), "total_count_requested"],
                    [col("category.per_years"), "per_years"],
                    [
                        literal("category.per_years - COUNT(reimbursementsGeneral.fund_sum_request)"),
                        "requests_remaining"
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
                var bindData = {};
                const datas = JSON.parse(JSON.stringify(results));
                bindData.datas = {
                    ...datas,
                    categoryId: datas.category_id,
                    totalSumRequested: datas.total_sum_requested,
                    fundRemaining: datas.fund_remaining,
                    totalCountRequested: datas.total_count_requested,
                    perYears: datas.per_years,
                    requestsRemaining: datas.requests_remaining,
                };
                delete bindData.datas.category_id;
                delete bindData.datas.total_sum_requested;
                delete bindData.datas.fund_remaining;
                delete bindData.datas.total_count_requested;
                delete bindData.datas.per_years;
                delete bindData.datas.requests_remaining;
                if (datas.fund_remaining === 0 || datas.requests_remaining === 0) bindData.canRequest = false;
                logger.info('Complete', { method, data: { userId } });
                return res.status(200).json({
                    datas: bindData.datas,
                    canRequest: bindData.canRequest ?? true,
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