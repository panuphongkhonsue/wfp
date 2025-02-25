const BaseController = require('./BaseControllers');
const { reimbursementsGeneral, categories, users, positions, sector, employeeTypes, departments, sequelize } = require('../models/mariadb');
const { fn, col, literal, Op } = require("sequelize");
const { initLogger } = require('../logger');
const category = require('../enum/category');
const logger = initLogger('dentalWelfareController');
const { getFiscalYearDynamic, getFiscalYear } = require('../middleware/utility');

class Controller extends BaseController {
    constructor() {
        super(reimbursementsGeneral);
    }

    list = async (req, res, next) => {
        const method = 'GetListDentalWelfare';
        const { id } = req.user;
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
        const method = 'GetRemainingDentalWelfare';
        const { id } = req.user;
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
                    ],
                    [col("category.per_times"), "perTimesRemaining"],
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
                whereObj = {};
                whereObj[Op.and] = [];
                var getFiscalYearWhere = getFiscalYear();
                whereObj[Op.and].push(
                    { '$reimbursementsGeneral.request_date$': getFiscalYearWhere },
                    { '$reimbursementsGeneral.categories_id$': category.dentalWelfare },
                    { '$reimbursementsGeneral.created_by$': req.query.createFor ?? id },
                );
                const getRequestData = await reimbursementsGeneral.findAll({
                    attributes: [
                        'id',
                        [col("date_receipt"), "dateReceipt"],
                        [col("fund_sum_request"), "fundSumRequest"],
                    ],
                    where: whereObj,
                })
                logger.info('Complete', { method, data: { id } });
                return res.status(200).json({
                    datas: datas,
                    canRequest: datas.canRequest ?? true,
                    requestData: JSON.parse(JSON.stringify(getRequestData)),
                });
            };
            const getFund = await categories.findOne({
                attributes: [
                    [col("fund"), "fundRemaining"],
                    [col("per_years"), "requestsRemaining"],
                    [col("per_times"), "perTimesRemaining"],
                ],
                where: { id: category.dentalWelfare }
            })
            if (getFund) {
                const datas = JSON.parse(JSON.stringify(getFund));
                logger.info('Complete', { method, data: { id } });
                return res.status(200).json({
                    datas: datas,
                    canRequest: datas.canRequest ?? true,
                    requestData: null,
                });
            }
            logger.info('Data not Found', { method, data: { id } });
            res.status(200).json({
                message: "มีสิทธ์คงเหลือเท่ากับเพดานเงิน"
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
        const method = 'GetDentalWelfarebyId';
        const { id } = req.user;
        const dataId = req.params['id'];
        try {
            const { filter } = req.query;
            var whereObj = { ...filter }
            const requestData = await reimbursementsGeneral.findOne({
                attributes: [
                    'id',
                    [col("reim_number"), "reimNumber"],
                    [col("fund_receipt"), "fundReceipt"],
                    [col("date_receipt"), "dateReceipt"],
                    [col("fund_sum_request"), "fundSumRequest"],
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
                                attributes: []
                            },
                            {
                                model: employeeTypes, as: 'employee_type',
                                attributes: []
                            },
                            {
                                model: sector, as: 'sector',
                                attributes: []
                            },
                            {
                                model: departments, as: 'department',
                                attributes: []
                            },
                        ]
                    },
                ],
                where: whereObj,
            });
            if (requestData) {
                const datas = JSON.parse(JSON.stringify(requestData));
                whereObj = {};
                whereObj[Op.and] = [];
                var getFiscalYearWhere;
                if (datas.requestDate) {
                    getFiscalYearWhere = getFiscalYearDynamic(datas.requestDate);
                }
                else {
                    getFiscalYearWhere = getFiscalYear();
                }
                whereObj[Op.and].push(
                    { '$reimbursementsGeneral.request_date$': getFiscalYearWhere },
                    { '$reimbursementsGeneral.categories_id$': category.dentalWelfare },
                    { '$reimbursementsGeneral.created_by$': datas.userId },
                    { '$reimbursementsGeneral.id$': { [Op.lte]: datas.id } },
                );
                const getRequestData = await reimbursementsGeneral.findAll({
                    attributes: [
                        'id',
                        [col("date_receipt"), "dateReceipt"],
                        [col("fund_sum_request"), "fundSumRequest"],
                    ],
                    where: whereObj,
                })
                var welfareData = {
                    ...datas,
                    user: {
                        userId: datas.userId,
                        name: datas.name,
                        position: datas.position,
                        employeeType: datas.employeeType,
                        sector: datas.sector,
                        department: datas.department,
                    },
                    requestData: JSON.parse(JSON.stringify(getRequestData))
                }
                delete welfareData.userId;
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