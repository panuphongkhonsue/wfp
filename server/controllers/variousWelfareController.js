const BaseController = require('./BaseControllers');
const { reimbursementsAssist, categories, users, positions, sector, employeeTypes, departments, sequelize } = require('../models/mariadb');
const { fn, col, literal } = require("sequelize");
const { initLogger } = require('../logger');
const logger = initLogger('ReimbursementsAssistController');

class Controller extends BaseController {
    constructor() {
        super(reimbursementsAssist);
    }

    list = async (req, res, next) => {
        const method = 'GetListUser';
        const { id } = req.user;
        try {
            const { filter, page, itemPerPage } = req.query;
            var whereObj = { ...filter }
            const listData = await reimbursementsAssist.paginate({
                attributes: [
                    'id',
                    [col("reim_number"), "reimNumber"],
                    [col("request_date"), "requestDate"],
                    [col("updated_at"), "updatedAt"],
                    [col("fund_receipt"), "fundReceipt"],
                    [col("fund_eligible"), "fundEligible"],
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
                logger.info('Complete', { method, data: { id } });
                res.status(200).json(bindList);
            }
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { id },
            });
            next(error);
        }
    }
    getRemaining = async (req, res, next) => {
        const method = 'GetRemaining';
        const { id } = req.user;
        try {
            const { filter } = req.query;
            var whereObj = { ...filter }
            const results = await reimbursementsAssist.findOne({
                attributes: [
                    [col("category.id"), "categoryId"],
                    [fn("SUM", col("reimbursementsAssist.fund_sum_request")), "totalSumRequested"],
                    [col("category.fund"), "fund"],
                    [
                        literal("category.fund - SUM(reimbursementsAssist.fund_sum_request)"),
                        "fundRemaining"
                    ],
                    [fn("COUNT", col("reimbursementsAssist.fund_sum_request")), "totalCountRequested"],
                    [col("category.per_years"), "perYears"],
                    [
                        literal("category.per_years - COUNT(reimbursementsAssist.fund_sum_request)"),
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
                logger.info('Complete', { method, data: { id } });
                return res.status(200).json({
                    datas: datas,
                    canRequest: datas.canRequest ?? true,
                });
            };
            logger.info('Data not Found', { method, data: { id } });
            res.status(400).json({
                message: "ไม่พบข้อมูลที่ต้องการ กรุณาลองอีกครั้ง"
            });
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { id },
            });
            next(error);
        }
    }
    getById = async (req, res, next) => {
        const method = 'GetVariousWelfarebyId';
        const { id } = req.user;
        const dataId = req.params['id'];
        try {
            const requestData = await reimbursementsAssist.findByPk(dataId, {
                attributes: [
                    [col("reim_number"), "reimNumber"],
                    [col("fund_receipt"), "fundReceipt"],
                    [col("fund_sum_request"), "fundSumRequest"],
                    [col("fund_eligible"), "fundEligible"],
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
                var welfareData = {
                    ...datas,
                    user: {
                        id: datas.id,
                        name: datas.name,
                        position: datas.position,
                        employeeType: datas.employeeType,
                        sector: datas.sector,
                        department: datas.department,
                    }
                }
                delete welfareData.id;
                delete welfareData.name;
                delete welfareData.position;
                delete welfareData.employeeType;
                delete welfareData.sector;
                delete welfareData.department;
                logger.info('Complete', { method, data: { id } });
                res.status(200).json({
                    datas: welfareData,
                });
            } else {
                logger.info('Data not found', {
                    method,
                    data: { id, dataId },
                });
                res.status(404).json({
                    message: `ไม่พบข้อมูล`,
                });
            }
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { id },
            });
            next(error);
        }
    }
}

module.exports = new Controller();