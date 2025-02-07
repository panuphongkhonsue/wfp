const { isNullOrEmpty, getFiscalYear } = require('../middleware/utility');
const { initLogger } = require('../logger');
const logger = initLogger('UserValidator');
const { Op, literal } = require('sequelize')
const permissionType = require('../enum/permission')
const { permissionsHasRoles, reimbursementsGeneral, categories, sequelize } = require('../models/mariadb')

const authPermission = async (req, res, next) => {
    const method = 'AuthPermission';
    const { roleId } = req.user;
    try {
        const isAccess = await permissionsHasRoles.count({
            where: {
                [Op.and]: [{ roles_id: roleId }, { permissions_id: permissionType.generalWelfare }],
            },
        });
        if (!isAccess) {
            throw Error("You don't have access to this API");
        }
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(401).json({ message: error.message });
    }
};
const bindFilter = async (req, res, next) => {
    const method = 'BindFilter';
    try {
        const { keyword, from, to, status } = req.query;
        req.query.filter = {};
        req.query.filter[Op.and] = [];
        if (!isNullOrEmpty(keyword)) {
            req.query.filter[Op.and].push({
                '$reimbursementsGeneral.reim_number$': { [Op.like]: `%${keyword}%` },
            });
        }
        if (!isNullOrEmpty(from) && !isNullOrEmpty(to)) {
            req.query.filter[Op.and].push({
                '$reimbursementsGeneral.request_date$': { [Op.between]: [from, to] },
            });
        }
        if (!isNullOrEmpty(from) && isNullOrEmpty(to)) {
            req.query.filter[Op.and].push({
                '$reimbursementsGeneral.request_date$': { [Op.eq]: from },
            });
        }
        if (!isNullOrEmpty(status)) {
            req.query.filter[Op.and].push({
                '$reimbursementsGeneral.status$': { [Op.eq]: status },
            });
        }
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(400).json({ message: error.message });
    }
};
const getRemaining = async (req, res, next) => {
    const method = 'RemainingMiddleware';
    try {
        req.query.filter = {};
        req.query.filter[Op.and] = [];
        const getFiscalYearWhere = getFiscalYear();
        req.query.filter[Op.and].push(
            { '$reimbursementsGeneral.request_date$': getFiscalYearWhere, },
            { '$category.id$': 1 }
        );
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(400).json({ message: error.message });
    }
};

const checkRemaining = async (req, res, next) => {
    const method = 'CheckRemainingMiddleware';
    try {
        const { filter } = req.query;
        var whereObj = { ...filter }
        const results = await reimbursementsGeneral.findOne({
            attributes: [
                [
                    literal("category.fund - SUM(reimbursementsGeneral.fund_sum_request)"),
                    "fundRemaining"
                ],
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
            if (datas.fundRemaining === 0 || datas.requestsRemaining === 0) {
                logger.info('No Remaining', { method });
                return res.status(400).json({
                    message: "คุณไม่มีสิทธ์ขอเบิกสวัสดิการดังกล่าว เนื่องจากได้ทำการขอเบิกครบแล้ว",
                });
            };
            return next();
        };
        res.status(400).json({
            message: "ไม่พบข้อมูลสิทธ์คงเหลือ กรุณาลองอีกครั้ง"
        });
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        next(error);
    }
}
module.exports = { authPermission, bindFilter, getRemaining, checkRemaining };