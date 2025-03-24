const { isNullOrEmpty, getFiscalYear, getYear2Digits, formatNumber, isInvalidNumber , dynamicCheckRemaining } = require('../middleware/utility');
const { initLogger } = require('../logger');
const logger = initLogger('HealthCheckupValidator');
const { Op, literal, col } = require('sequelize')
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
        else {
            const isEditor = await permissionsHasRoles.count({
                where: {
                    [Op.and]: [{ roles_id: roleId }, { permissions_id: permissionType.welfareManagement }],
                },
            });
            if (isEditor) req.isEditor = true;
        }
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(401).json({ message: error.message });
    }
};
const authPermissionEditor = async (req, res, next) => {
    const method = 'AuthPermissionEditor';
    const { roleId } = req.user;
    try {
        const isAccess = await permissionsHasRoles.count({
            where: {
                [Op.and]: [{ roles_id: roleId }, { permissions_id: permissionType.welfareManagement }],
            },
        });
        if (!isAccess) {
            throw Error("You don't have access to this API");
        }
        req.access = true;
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(401).json({ error: error.message });
    }
};
const bindFilter = async (req, res, next) => {
    const method = 'BindFilter';
    const { id } = req.user;
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
        req.query.filter[Op.and].push({
            '$reimbursementsGeneral.created_by$': { [Op.eq]: id },
            '$reimbursementsGeneral.categories_id$': { [Op.eq]: category.healthCheckup },
        });
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(400).json({ message: error.message });
    }
};
const byIdMiddleWare = async (req, res, next) => {
    const method = 'ByIdMiddleware';
    const dataId = req.params['id'];
    const { id } = req.user;
    try {
        req.query.filter = {};
        req.query.filter[Op.and] = [];
        if (req.access) {
            req.query.filter[Op.and].push(
                { '$reimbursementsGeneral.id$': { [Op.eq]: dataId } },
            );
        }
        else {
            req.query.filter[Op.and].push(
                { '$reimbursementsGeneral.id$': { [Op.eq]: dataId } },
                { '$reimbursementsGeneral.created_by$': { [Op.eq]: id }, }
            );
        }
        req.query.filter[Op.and].push(
            {
                '$reimbursementsGeneral.categories_id$': { [Op.eq]: category.healthCheckup },
            }
        );
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(400).json({ message: error.message });
    }
};
const checkNullValue = async (req, res, next) => {
    try {
        const { fundReceipt, fundDecree, fundUniversity, fundEligible, fundEligibleName, actionId } = req.body;
        
        if(req.access && (actionId === status.NotApproved || actionId === status.approve) && !isNullOrEmpty(actionId)){
            return next();
        }
        const errorObj = {};
        if (isNullOrEmpty(fundReceipt)) {
            errorObj["fundReceipt"] = "กรุณากรอกข้อมูลจำนวนเงินตามใบเสร็จ";
        } else if (isInvalidNumber(fundReceipt)) {
            errorObj["fundReceipt"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
        } else if (fundReceipt <= 0) {
            return res.status(400).json({
                message: "จำนวนเงินตามใบเสร็จน้อยกว่าหรือเท่ากับ 0 ไม่ได้",
            });
        }

        if (isInvalidNumber(fundDecree) && !isNullOrEmpty(fundDecree)) {
            errorObj["fundDecree"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
        } else if (fundDecree < 0) {
            return res.status(400).json({
                message: "ข้อมูลเงินจากสิทธิที่เบิกได้ตามพระราชกฤษฎีกาเงินสวัสดิการเกี่ยวกับการรักษาพยาบาลน้อยกว่า 0 ไม่ได้",
            });
        }

        if(isNullOrEmpty(fundUniversity)){
            errorObj["fundUniversity"] = "กรุณากรอกข้อมูลเงินที่ต้องการเบิก";
        }
        else if (isInvalidNumber(fundUniversity) && !isNullOrEmpty(fundUniversity)) {
            errorObj["fundUniversity"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
        } else if (fundUniversity < 0) {
            return res.status(400).json({
                message: "เงินที่เบิกได้ตามประกาศสวัสดิการคณะกรรมการสวัสดิการ มหาวิทยาลัยบูรพาน้อยกว่า 0 ไม่ได้",
            });
        }
        if (isInvalidNumber(fundEligible) && !isNullOrEmpty(fundEligible)) {
            errorObj["fundEligible"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
        } else if (fundEligible < 0) {
            errorObj["fundEligible"] = "ค่าสิทธิอื่น ๆ น้อยกว่า 0 ไม่ได้";
            return res.status(400).json({
                message: "ค่าสิทธิอื่น ๆ น้อยกว่า 0 ไม่ได้",
            });
        }
        if (!isNullOrEmpty(fundEligible) && isNullOrEmpty(fundEligibleName)) {
            return res.status(400).json({
                message: "กรุณากรอกชื่อสิทธิอื่น ๆ",
            });
        }
        else if (isNullOrEmpty(fundEligible) && !isNullOrEmpty(fundEligibleName)) {
            return res.status(400).json({
                message: "กรุณากรอกจำนวนเงินที่เบิกได้จากสิทธิอื่น ๆ",
            });
        }
        const fundEligibleSum = Number(fundReceipt) -  Number(fundDecree) + Number(fundEligible);
        const fundSumRequest = Number(fundUniversity);
        if ((isNullOrEmpty(actionId) || (actionId != status.draft && actionId != status.waitApprove)) && !req.access) {
            return res.status(400).json({
                message: "ไม่มีการกระทำที่ต้องการ",
            });
        }
        if (Object.keys(errorObj).length) return res.status(400).json({ errors: errorObj });
        req.body = {
            ...req.body,
            fundEligibleSum: fundEligibleSum,
            fundSumRequest: fundSumRequest,
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}

const bindCreate = async (req, res, next) => {
    try {
        const { fundReceipt, fundDecree, fundUniversity, fundEligible, fundEligibleName, fundEligibleSum, fundSumRequest, createFor, actionId } = req.body;
        const { id } = req.user;
        if (!isNullOrEmpty(createFor) && !req.isEditor) {
            return res.status(400).json({
                message: "ไม่มีสิทธิ์สร้างให้คนอื่นได้",
            });
        }
        if (!isNullOrEmpty(createFor) && actionId == status.draft && createFor !== id) {
            return res.status(400).json({
                message: "กรณีเบิกให้ผู้อื่น ไม่สามารถบันทึกฉบับร่างได้",
            });
        }
        const results = await reimbursementsGeneral.findOne({
            attributes: ["id"],
            order: [["id", "DESC"]]
        });
        var reimNumber = getYear2Digits() + formatNumber(welfareType.general) + formatNumber(category.healthCheckup) + formatNumber(1);
        if (results) {
            const datas = JSON.parse(JSON.stringify(results));
            reimNumber = getYear2Digits() + formatNumber(welfareType.general) + formatNumber(category.healthCheckup) + formatNumber(Number(datas.id) + 1);
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
        const { fundReceipt, fundDecree, fundUniversity, fundEligible, fundEligibleName, fundEligibleSum, fundSumRequest, createFor, actionId } = req.body;
        const { id } = req.user;
        if (!isNullOrEmpty(createFor) && !req.isEditor) {
            return res.status(400).json({
                message: "ไม่มีสิทธิ์แก้ไขให้คนอื่นได้",
            });
        }
        if (!isNullOrEmpty(createFor) && actionId == status.draft && createFor !== id) {
            return res.status(400).json({
                message: "กรณีเบิกให้ผู้อื่น ไม่สามารถบันทึกฉบับร่างได้",
            });
        }
        const dataId = req.params['id'];
        const results = await reimbursementsGeneral.findOne({
            attributes: ["status", "created_by"],
            where: { id: dataId, categories_id: category.healthCheckup },
        });
        var createByData;
        if (results) {
            const datas = JSON.parse(JSON.stringify(results));
            createByData = datas.created_by;
            if (!req.access && datas.created_by !== id) {
                return res.status(400).json({
                    message: "ไม่มีสิทธิ์แก้ไขให้คนอื่นได้",
                });
            }
            if (!req.access && datas.status !== statusText.draft) {
                return res.status(400).json({
                    message: "ไม่สามารถแก้ไขได้ เนื่องจากสถานะไม่ถูกต้อง",
                });
            }
            if (req.access && (datas.status != statusText.waitApprove)) {
                return res.status(400).json({
                    message: "ไม่สามารถแก้ไขได้ เนื่องจากสถานะไม่ถูกต้อง",
                });
            }
            
            if(req.access && (actionId === status.NotApproved || actionId === status.approve) && !isNullOrEmpty(actionId)){
                const dataBinding = {
                    status : actionId,
                    updated_by: id,
                }
                req.body = dataBinding;
                return next();
            }
        }
        else {
            return res.status(400).json({
                message: "ไม่พบข้อมูล",
            });
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
        }
        if (!isNullOrEmpty(actionId)) {
            dataBinding.status = actionId;
            if (actionId === status.waitApprove) {
                dataBinding.request_date = new Date();
            }
        }
        if (!isNullOrEmpty(createFor) && !req.access) {
            dataBinding.created_by = createFor;
        }
        if (!isNullOrEmpty(createByData) && req.access) {
            dataBinding.createByData = createByData;
        }
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
        const { id } = req.user;
        const { createFor } = req.query;
        const { created_by, createByData } = req.body;
        const { actionId } = req.body;
        
        if(req.access && (actionId === status.NotApproved) && !isNullOrEmpty(actionId)){
            return next();
        }
        req.query.filter = {};
        req.query.filter[Op.and] = [];
        const getFiscalYearWhere = getFiscalYear();
        if (req.access && !isNullOrEmpty(createByData)) {
            req.query.filter[Op.and].push(
                { '$reimbursementsGeneral.created_by$': createByData },
            );
        }
        else if (!isNullOrEmpty(created_by) && req.isEditor) {
            req.query.filter[Op.and].push(
                { '$reimbursementsGeneral.created_by$': created_by },
            );
        }
        else if (!isNullOrEmpty(createFor) && req.isEditor) {
            req.query.filter[Op.and].push(
                { '$reimbursementsGeneral.created_by$': createFor },
            );
        }
        else {
            req.query.filter[Op.and].push(
                { '$reimbursementsGeneral.created_by$': id },
            );
        }
        req.query.filter[Op.and].push(
            { '$reimbursementsGeneral.request_date$': getFiscalYearWhere },
            { '$reimbursementsGeneral.categories_id$': category.healthCheckup },
            { '$reimbursementsGeneral.status$': { [Op.eq]: status.approve }}
        );
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(400).json({ message: error.message });
    }
};
const checkUpdateRemaining = async (req, res, next) => {
    const method = 'CheckUpdateRemainingMiddleware';
    try {
        const { filter } = req.query;
        const dataId = req.params['id'];
        var whereObj = { ...filter }
        
        const { fund_sum_request, actionId } = req.body;
        if(req.access && (actionId === status.NotApproved) && !isNullOrEmpty(actionId)){
           return next();
        }
        const results = await reimbursementsGeneral.findOne({
            attributes: [
                [
                    literal("category.fund - SUM(reimbursementsGeneral.fund_sum_request)"),
                    "fundRemaining"
                ],
                [col("category.per_times"), "perTimes"],
                [
                    literal("category.per_years - COUNT(reimbursementsGeneral.fund_sum_request)"),
                    "requestsRemaining"
                ],
                [
                    literal("category.per_users - COUNT(reimbursementsGeneral.fund_sum_request)"),
                    "perUsersRemaining"
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
        const welfareCheckData = await reimbursementsGeneral.findOne({
            attributes: ["fund_sum_request"],
            where: { id: dataId, categories_id: category.healthCheckup },
        });
        if (!welfareCheckData) {
            return res.status(400).json({
                message: "ไม่พบข้อมูล",
            });
        }
        if (results) {
            const datas = JSON.parse(JSON.stringify(results));
            if(actionId === status.approve){
                if(dynamicCheckRemaining(datas)){
                    return res.status(400).json({
                        message: "ไม่สามารถอนุมัติได้เนื่องจากผู้ขอเบิกสวัสดิการไม่มีสิทธิ์ขอเบิก",
                    });
                }
                else{
                    return next();
                }
            }
            const oldWelfareData = JSON.parse(JSON.stringify(welfareCheckData));
            if (fund_sum_request < oldWelfareData.fund_sum_request) {
                return next();
            }
            else if (fund_sum_request > datas.perTimes && !isNullOrEmpty(datas.perTimes)) {
                return res.status(400).json({
                    message: "คุณสามารถเบิกได้สูงสุด " + datas.perTimes + " ต่อครั้ง",
                });
            }
            else {
                const diffFund = fund_sum_request - oldWelfareData.fund_sum_request;
                if ((datas.fundRemaining === 0 || datas.fundRemaining - diffFund < 0) && !isNullOrEmpty(datas.fundRemaining)) {
                    return res.status(400).json({
                        message: "ไม่สามารถทำรายการได้เนื่องจากเกินเพดานเงินคงเหลือ",
                    });
                }
            }
        };
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        next(error);
    }
}
const checkFullPerTimes = async (req, res, next) => {
    const method = 'CheckFullPerTimes';
    try {
        
        const { fund_sum_request, actionId } = req.body;
        if(req.access && (actionId === status.NotApproved || actionId === status.approve) && !isNullOrEmpty(actionId)){
            return next();
        }
        const getFund = await categories.findOne({
            attributes: [
                [col("fund"), "fundRemaining"],
                [col("per_times"), "perTimes"],
            ],
            where: { id: category.healthCheckup }
        })
        if (getFund) {
            const datas = JSON.parse(JSON.stringify(getFund));
            if (fund_sum_request > datas.perTimes && !isNullOrEmpty(datas.perTimes)) {
                return res.status(400).json({
                    message: "คุณสามารถเบิกได้สูงสุด " + datas.perTimes + " ต่อครั้ง",
                });
            }
            if (fund_sum_request > datas.fundRemaining && !isNullOrEmpty(datas.fundRemaining)) {
                logger.info('Request Over', { method });
                return res.status(400).json({
                    message: "จำนวนที่ขอเบิกเกินเพดานเงินกรุณาลองใหม่อีกครั้ง",
                });
            }
        }
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        next(error);
    }
}
const checkRemaining = async (req, res, next) => {
    const method = 'CheckRemainingMiddleware';
    try {
        const { status } = req.body;
        const { filter } = req.query;
        var whereObj = { ...filter }
        const { fund_sum_request } = req.body;
        const results = await reimbursementsGeneral.findOne({
            attributes: [
                [
                    literal("category.fund - SUM(reimbursementsGeneral.fund_sum_request)"),
                    "fundRemaining"
                ],
                [col("category.per_times"), "perTimes"],
                [
                    literal("category.per_years - COUNT(reimbursementsGeneral.fund_sum_request)"),
                    "requestsRemaining"
                ],
                [
                    literal("category.per_users - COUNT(reimbursementsGeneral.fund_sum_request)"),
                    "perUsersRemaining"
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
            if (dynamicCheckRemaining(datas)) {
                logger.info('No Remaining', { method });
                return res.status(400).json({
                    message: "ไม่มีสิทธิ์ขอเบิกสวัสดิการดังกล่าว เนื่องจากได้ทำการขอเบิกครบแล้ว",
                });
            };
            if (fund_sum_request > datas.perTimes && !isNullOrEmpty(datas.perTimes)) {
                return res.status(400).json({
                    message: "คุณสามารถเบิกได้สูงสุด " + datas.perTimes + " ต่อครั้ง",
                });
            }
            if (fund_sum_request > datas.fundRemaining && !isNullOrEmpty(datas.fundRemaining)) {
                logger.info('Request Over', { method });
                return res.status(400).json({
                    message: "จำนวนที่ขอเบิกเกินเพดานเงินกรุณาลองใหม่อีกครั้ง",
                });
            }
        };
        next();
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
        const { id } = req.user;
        const results = await reimbursementsGeneral.findOne({
            attributes: ["status"],
            where: { id: dataId, created_by: id, categories_id: category.healthCheckup },
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
        res.status(404).json({
            message: "ไม่พบข้อมูลที่ต้องการลบ กรุณาลองอีกครั้ง"
        });
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        next(error);
    }
}
module.exports = {
    authPermission,
    bindFilter,
    getRemaining,
    checkRemaining,
    bindCreate,
    bindUpdate,
    deletedMiddleware,
    byIdMiddleWare,
    authPermissionEditor,
    checkNullValue,
    checkUpdateRemaining,
    checkFullPerTimes
};