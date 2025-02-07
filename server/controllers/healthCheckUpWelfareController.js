const BaseController = require('./BaseControllers');
const { reimbursementsGeneral, categories, users, positions, sector, employeeTypes, departments, sequelize } = require('../models/mariadb');
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
                    [col("reim_number"), "reimNumber"],
                    [col("request_date"), "requestDate"],
                    [col("updated_at"), "updatedAt"],
                    [col("fund_receipt"), "fundReceipt"],
                    [col("fund_eligible_sum"), "fundEligibleSum"],
                    [col("fund_sum_request"), "fundSumRequest"],
                    'status',
                ],
                page: page && !isNaN(page) ? Number(page) : 1,
                paginate: itemPerPage && !isNaN(itemPerPage) ? Number(itemPerPage) : 0,
                where: whereObj,
                order: [['updated_at', 'DESC'], ['created_at', 'DESC']]
            });

            if (listData) {
                var bindList = {};
                bindList.pagination = {
                    page: page && !isNaN(page) ? Number(page) : 1,
                    total: listData.total
                }
                bindList.datas = listData.docs.map((listObj) => {
                    const plainObj = listObj.toJSON();
                    return {
                        ...plainObj,
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
    getById = async (req, res, next) => {
        const method = 'GetHealthCheckupWelfarebyId';
        const { userId } = req.user;
        const dataId = req.params['id'];
        try {
            const requestData = await reimbursementsGeneral.findByPk(dataId, {
                attributes: [
                    [col("reim_number"), "reimNumber"],
                    [col("fund_receipt"), "fundReceipt"],
                    [col("fund_eligible"), "fundEligible"],
                    [col("fund_sum_request"), "fundSumRequest"],
                    [col("fund_decree"), "fundDecree"],
                    [col("fund_university"), "fundUniversity"],
                    [col("fund_eligible_name"), "fundEligibleName"],
                    [col("fund_eligible_sum"), "fundEligibleSum"],
                    [col("request_date"), "requestDate"],
                    [col("status"), "status"],
                    [col("created_by_user.id"), "userId"],
                    [col("created_by_user.name"), "name"],
                    [col("created_by_user.position.name"), "position"],
                    [col("created_by_user.employee_type.name"), "employeeType"],
                    [col("created_by_user.sector.name"), "sector"],
                    [col("created_by_user.department.name"), "department"],
                ],
                include: [
                    {
                        model: users, as: 'created_by_user',
                        attributes: [],
                        include: [
                            {
                                model: positions, as: 'position',
                                attributes: ['name']
                            },
                            {
                                model: employeeTypes, as: 'employee_type',
                                attributes: ['name']
                            },
                            {
                                model: sector, as: 'sector',
                                attributes: ['name']
                            },
                            {
                                model: departments, as: 'department',
                                attributes: ['name']
                            },
                        ]
                    },
                ],
            });
            if (requestData) {
                const datas = JSON.parse(JSON.stringify(requestData));
                logger.info('Complete', { method, data: { userId } });
                res.status(200).json({
                    datas: datas,
                });
            } else {
                logger.info('Data not found', {
                    method,
                    data: { userId, dataId },
                });
                res.status(404).json({
                    message: `ไม่พบข้อมูล`,
                });
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