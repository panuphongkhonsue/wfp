const { isNullOrEmpty, getFiscalYear, getYear2Digits, formatNumber } = require('../middleware/utility');
const { initLogger } = require('../logger');
const logger = initLogger('UserValidator');
const { Op, literal } = require('sequelize')
const permissionType = require('../enum/permission')
const statusText = require('../enum/statusText')
const status = require('../enum/status')
const category = require('../enum/category');
const welfareType = require('../enum/welfareType');
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
const bindCreate = async (req, res, next) => {
    try {
        const { fundReceipt, fundDecree, fundUniversity, fundEligible, fundEligibleName, createFor, actionId } = req.body;
        const errorObj = {};
        if (fundReceipt < 0) errorObj['fundReceipt'] = 'จำนวนเงินตามใบเสร็จน้อยกว่า 0 ไม่ได้';
        if (fundDecree < 0) errorObj['fundDecree'] = 'ข้อมูลเงินจากสิทธิที่เบิกได้ตามพระราชกฤษฎีกาเงินสวัสดิการเกี่ยวกับการรักษาพยาบาลน้อยกว่า 0 ไม่ได้';
        if (fundUniversity < 0) errorObj['fundUniversity'] = 'เงินที่เบิกได้ตามประกาศสวัสดิการคณะกรรมการสวัสดิการ มหาวิทยาลัยบูรพาน้อยกว่า 0 ไม่ได้';
        if (fundEligible < 0) errorObj['fundEligible'] = 'ค่าสิทธิอื่น ๆ น้อยกว่า 0 ไม่ได้';
        const fundEligibleSum = fundDecree + fundUniversity + fundEligible;
        const fundSumRequest = fundReceipt - fundEligibleSum;
        if (fundSumRequest < 0) errorObj['fundSumRequest'] = 'จำนวนตามใบเสร็จไม่สามารถน้อยกว่าเงินที่ได้รับจากสิทธิอื่น ๆ';
        if (Object.keys(errorObj).length) res.status(400).json({ errors: errorObj });
        const { id } = req.user;
        const results = await reimbursementsGeneral.findOne({
            attributes: ["id"],
            order: [["id", "DESC"]] // Order by id in descending order
        });
        var reimNumber;
        if (results) {
            const datas = JSON.parse(JSON.stringify(results));
            reimNumber = getYear2Digits() + formatNumber(welfareType.general) + formatNumber(category.healthCheckup) + formatNumber(datas.id + 1);
        }
        const dataBinding = {
            reim_number: reimNumber,
            fund_receipt: fundReceipt,
            fund_decree: fundDecree,
            fund_university: fundUniversity,
            fund_eligible: fundEligible,
            fund_eligible_name: fundEligibleName,
            fund_eligible_sum: fundEligibleSum,
            fund_sum_request: fundSumRequest,
            created_by: createFor ?? id,
            updated_by: id,
            status: actionId,
            request_date: actionId === status.waitApprove ? new Date() : null,
            categories_id: category.healthCheckup,
        }
        req.body = dataBinding;
        next();
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};
const bindUpdate = async (req, res, next) => {
    try {
        const { fundReceipt, fundDecree, fundUniversity, fundEligible, fundEligibleName, createFor, actionId } = req.body;
        const errorObj = {};
        if (fundReceipt < 0) errorObj['fundReceipt'] = 'จำนวนเงินตามใบเสร็จน้อยกว่า 0 ไม่ได้';
        if (fundDecree < 0) errorObj['fundDecree'] = 'ข้อมูลเงินจากสิทธิที่เบิกได้ตามพระราชกฤษฎีกาเงินสวัสดิการเกี่ยวกับการรักษาพยาบาลน้อยกว่า 0 ไม่ได้';
        if (fundUniversity < 0) errorObj['fundUniversity'] = 'เงินที่เบิกได้ตามประกาศสวัสดิการคณะกรรมการสวัสดิการ มหาวิทยาลัยบูรพาน้อยกว่า 0 ไม่ได้';
        if (fundEligible < 0) errorObj['fundEligible'] = 'ค่าสิทธิอื่น ๆ น้อยกว่า 0 ไม่ได้';
        const fundEligibleSum = fundDecree + fundUniversity + fundEligible;
        const fundSumRequest = fundReceipt - fundEligibleSum;
        if (fundSumRequest < 0) errorObj['fundSumRequest'] = 'จำนวนตามใบเสร็จไม่สามารถน้อยกว่าเงินที่ได้รับจากสิทธิอื่น ๆ';
        if (Object.keys(errorObj).length) res.status(400).json({ errors: errorObj });
        const { id } = req.user;
        const dataId = req.params['id'];
        const results = await reimbursementsGeneral.findOne({
            attributes: ["status"],
            where: { id: dataId },
        });
        if (results) {
            const datas = JSON.parse(JSON.stringify(results));
            if (datas.status !== statusText.draft) {
                return res.status(400).json({
                    message: "ไม่สามารถแก้ไขได้ เนื่องจากสถานะไม่ถูกต้อง",
                });
            }
        }
        const dataBinding = {
            fund_receipt: fundReceipt,
            fund_decree: fundDecree,
            fund_university: fundUniversity,
            fund_eligible: fundEligible,
            fund_eligible_name: fundEligibleName,
            fund_eligible_sum: fundEligibleSum,
            fund_sum_request: fundSumRequest,
            updated_by: id,
            request_date: actionId === status.waitApprove ? new Date() : null,
            status: actionId,
        }
        if (createFor) dataBinding.created_by = createFor;
        req.body = dataBinding;
        next();
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
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
        const { status } = req.body;
        const { filter } = req.query;
        var whereObj = { ...filter }
        const { fundSumRequest } = req.body;
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
            if (status === 1) {
                return next();
            }
            if (datas.fundRemaining === 0 || datas.requestsRemaining === 0) {
                logger.info('No Remaining', { method });
                return res.status(400).json({
                    message: "คุณไม่มีสิทธ์ขอเบิกสวัสดิการดังกล่าว เนื่องจากได้ทำการขอเบิกครบแล้ว",
                });
            };
            if (fundSumRequest > datas.fundRemaining) {
                logger.info('Request Over', { method });
                return res.status(400).json({
                    message: "จำนวนที่ขอเบิกเกินเพดานเงินกรุณาลองใหม่อีกครั้ง",
                });
            }
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
const deletedMiddleware = async (req, res, next) => {
    const method = 'DeletedMiddleware';
    try {
        const dataId = req.params['id'];
        const results = await reimbursementsGeneral.findOne({
            attributes: [
                "status"
            ],
            where: { id: dataId },
        });
        if (results) {
            const datas = JSON.parse(JSON.stringify(results));
            if (datas.status !== statusText.draft) {
                logger.info('Can not Deleted', { method });
                return res.status(400).json({
                    message: "ไม่สามารถลบใบเบิกนี้ได้",
                });
            };
            return next();
        };
        res.status(400).json({
            message: "ไม่พบข้อมูลที่ต้องการลบ กรุณาลองอีกครั้ง"
        });
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        next(error);
    }
}
module.exports = { authPermission, bindFilter, getRemaining, checkRemaining, bindCreate, bindUpdate, deletedMiddleware };