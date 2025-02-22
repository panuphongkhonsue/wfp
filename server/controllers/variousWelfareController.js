const BaseController = require('./BaseControllers');
const { reimbursementsAssist, categories, users, positions, sector, employeeTypes, departments, sequelize } = require('../models/mariadb');
const { Op, fn, col, literal } = require("sequelize");
const { initLogger } = require('../logger');
const logger = initLogger('variousWelfareController');

class Controller extends BaseController {
    constructor() {
        super(reimbursementsAssist);
    }

    list = async (req, res, next) => {
        const method = 'GetListVariousWelfare';
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
                where: whereObj,
                order: [['updated_at', 'DESC'], ['created_at', 'DESC']],
                limit: itemPerPage,
                offset: (page - 1) * itemPerPage
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
        const method = 'GetRemainingVariousWelfare';
        const { id } = req.user;
        try {
            const { filter } = req.query;
            var whereObj = { ...filter };
            const results = await reimbursementsAssist.findAll({
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
                    ],
                    [col("category.per_times"), "perTimesRemaining"],
                ],
                include: [
                    {
                        model: categories,
                        as: "category",
                        attributes: [],
                        required: true
                    }
                ],
                where: whereObj,
                group: ["category.id"]
            });
            if (results.length > 0) {
                const datas = results.map(item => {
                    const fundRemaining = item.dataValues.fundRemaining;
                    const requestsRemaining = item.dataValues.requestsRemaining;

                    return {
                        categoryId: item.dataValues.categoryId,
                        fundRemaining: fundRemaining,
                        requestsRemaining: requestsRemaining,
                        perTimesRemaining: item.dataValues.perTimesRemaining,
                        canRequest: fundRemaining > 0 && requestsRemaining > 0
                    };
                });

                logger.info('Complete', { method, data: { id } });
                return res.status(200).json({
                    datas: datas,
                });
            } else {
                const getFund = await categories.findAll({
                    attributes: [
                        [col("id"), "categoryId"],
                        [col("fund"), "fundRemaining"],
                        [col("per_years"), "requestsRemaining"],
                        [col("per_times"), "perTimesRemaining"],
                    ],
                    where: {
                        id: {
                            [Op.in]: [4, 5, 6, 7]
                        }
                    }
                });
                if (getFund.length > 0) {
                    const datas = getFund.map(item => {
                        const fundRemaining = item.dataValues.fundRemaining;
                        const requestsRemaining = item.dataValues.requestsRemaining;

                        return {
                            categoryId: item.dataValues.categoryId,
                            fundRemaining: fundRemaining,
                            requestsRemaining: requestsRemaining,
                            perTimesRemaining: item.dataValues.perTimesRemaining,
                            canRequest: fundRemaining > 0 && requestsRemaining > 0
                        };
                    });
                    logger.info('Complete', { method, data: { ids: [4, 5, 6, 7] } });
                    return res.status(200).json({
                        datas: datas,
                    });
                }
                logger.info('Data not Found', { method, data: { ids: [4, 5, 6, 7] } });
                res.status(200).json({
                    message: "ไม่มีข้อมูลสำหรับ ID ที่กำหนด"
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
    };
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
                    [col("categories_id"), "categoryId"],
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