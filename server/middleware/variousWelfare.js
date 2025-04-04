const { isNullOrEmpty, getFiscalYear, getYear2Digits, formatNumber, isInvalidNumber, dynamicCheckRemaining } = require('../middleware/utility');
const { initLogger } = require('../logger');
const logger = initLogger('UserValidator');
const { Op, literal, col } = require('sequelize')
const permissionType = require('../enum/permission')
const statusText = require('../enum/statusText')
const status = require('../enum/status')
const welfareType = require('../enum/welfareType');
const category = require('../enum/category')
const { permissionsHasRoles, reimbursementsAssist, categories,users, sequelize } = require('../models/mariadb')
const { sendMail } = require('../helper/mail');

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
                '$reimbursementsAssist.reim_number$': { [Op.like]: `%${keyword}%` },
            });
        }
        if (!isNullOrEmpty(from) && !isNullOrEmpty(to)) {
            req.query.filter[Op.and].push({
                '$reimbursementsAssist.request_date$': { [Op.between]: [from, to] },
            });
        }
        if (!isNullOrEmpty(from) && isNullOrEmpty(to)) {
            req.query.filter[Op.and].push({
                '$reimbursementsAssist.request_date$': { [Op.eq]: from },
            });
        }
        if (!isNullOrEmpty(status)) {
            req.query.filter[Op.and].push({
                '$reimbursementsAssist.status$': { [Op.eq]: status },
            });
        }
        req.query.filter[Op.and].push({
            '$reimbursementsAssist.created_by$': { [Op.eq]: id },
            '$reimbursementsAssist.categories_id$': { [Op.ne]: category.variousFuneralFamily }

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
                { '$reimbursementsAssist.id$': { [Op.eq]: dataId } },
            );
        }
        else {
            req.query.filter[Op.and].push(
                { '$reimbursementsAssist.id$': { [Op.eq]: dataId } },
                { '$reimbursementsAssist.created_by$': { [Op.eq]: id }, }
            );
        }
        req.query.filter[Op.and].push(
            {
                '$reimbursementsAssist.category_id$': { [Op.ne]: category.variousFuneralFamily }
            }
        )
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(400).json({ message: error.message });
    }
};
const checkNullValue = async (req, res, next) => {
    try {
        const { fundReceipt, fundEligible, actionId } = req.body;
        if (req.access && (actionId === status.NotApproved || actionId === status.approve) && !isNullOrEmpty(actionId)) {
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
        const fundSumReceipt = Number(fundReceipt);
        if (isInvalidNumber(fundEligible) && fundEligible) {
            errorObj["fundEligible"] = "ค่าที่กรอกไม่ใช่ตัวเลข";

        } else if (fundEligible <= 0) {
            errorObj["fundEligible"] = "จำนวนเงินที่ต้องการเบิกน้อยกว่าหรือเท่ากับ 0 ไม่ได้";
            return res.status(400).json({
                message: "จำนวนเงินที่ต้องการเบิกน้อยกว่าหรือเท่ากับ 0 ไม่ได้",
            });
        }
        const fundSumRequest = Number(fundEligible);
        if (Number(fundEligible) > Number(fundReceipt)) {
            return res.status(400).json({
                message: "จำนวนเงินที่ต้องการเบิกไม่สามารถมากกว่าจำนวนเงินตามใบสำคัญรับเงินได้",
            });
        }
        if (fundSumRequest <= 0) {
            return res.status(400).json({
                message: "จำนวนตามใบเสร็จไม่สามารถน้อยกว่าเงินที่ต้องการเบิกได้",
            });
        }
        if ((isNullOrEmpty(actionId) || (actionId != status.draft && actionId != status.waitApprove)) && !req.access) {
            return res.status(400).json({
                message: "ไม่มีการกระทำที่ต้องการ",
            });
        }
        if (Object.keys(errorObj).length) return res.status(400).json({ errors: errorObj });
        req.body = {
            ...req.body,
            fundSumRequest: fundSumRequest,
            fundSumReceipt: fundSumReceipt,
        };
        next();
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
const bindCreate = async (req, res, next) => {
    try {
        const { fundReceipt, fundEligible, fundSumRequest, fundSumReceipt, createFor, actionId, categoryId } = req.body;
        const { id, roleId } = req.user;
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
        const results = await reimbursementsAssist.findOne({
            attributes: ["id"],
            order: [["id", "DESC"]] // Order by id in descending order
        });
        var reimNumber = getYear2Digits() + formatNumber(welfareType.Assist) + formatNumber(categoryId) + formatNumber(1);
        if (results) {
            const datas = JSON.parse(JSON.stringify(results));
            reimNumber = getYear2Digits() + formatNumber(welfareType.Assist) + formatNumber(categoryId) + formatNumber(datas.id + 1);
        }
        const dataBinding = {
            reim_number: reimNumber,
            fund_receipt: fundReceipt,
            fund_sum_receipt: fundReceipt,
            fund_eligible: fundEligible,
            fund_sum_request: fundSumRequest,
            fund_sum_receipt: fundSumReceipt,
            created_by: createFor ?? id,
            updated_by: id,
            status: actionId,
            request_date: actionId === status.waitApprove ? new Date() : null,
            categories_id: categoryId,
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
        const { fundReceipt, fundEligible, fundSumRequest, createFor, actionId, categoryId } = req.body;
        const { id, } = req.user;
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
        const validCategory = await categories.findOne({
            where: {
                id: categoryId
            }
        });
        if (!validCategory) {
            return res.status(400).json({ message: "Invalid Category ID" });
        }

        const dataId = req.params['id'];
        const results = await reimbursementsAssist.findOne({
            attributes: ["status", "created_by", "id", "categories_id"],
            where: { id: dataId, categories_id: categoryId },
        });

        let createByData;
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
            if (req.access && (actionId === status.NotApproved || actionId === status.approve) && !isNullOrEmpty(actionId)) {
                const dataBinding = {
                    status: actionId,
                    updated_by: id,
                    categories_id: categoryId,
                }
                req.body = dataBinding;
                return next();
            }
            var reimNumber;
            reimNumber = getYear2Digits() + formatNumber(welfareType.Assist) + formatNumber(categoryId) + formatNumber(datas.id);
        }
        const dataBinding = {
            reim_number: reimNumber,
            fund_receipt: fundReceipt,
            fund_eligible: fundEligible,
            fund_sum_request: fundSumRequest,
            status: actionId,
            categories_id: categoryId,
            updated_by: id,
        }
        if (!isNullOrEmpty(actionId)) {
            if (req.access && actionId != status.approve) {
                return res.status(400).json({
                    message: "ไม่มีการกระทำที่ต้องการ",
                });
            }
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
        const { created_by, createByData, categories_id, } = req.body;
        if (req.access && (req.body.status === status.NotApproved || req.body.status === status.approve) && !isNullOrEmpty(req.body.status)) {
            return next();
        }
        req.query.filter = {};
        req.query.filter[Op.and] = [];
        const getFiscalYearWhere = getFiscalYear();

        if (req.access && !isNullOrEmpty(createByData)) {
            req.query.filter[Op.and].push(
                { '$reimbursementsAssist.created_by$': createByData },
            );
        }
        else if (!isNullOrEmpty(created_by) && req.isEditor) {
            req.query.filter[Op.and].push(
                { '$reimbursementsAssist.created_by$': created_by },
            );
        }
        else if (!isNullOrEmpty(createFor) && req.isEditor) {
            req.query.filter[Op.and].push(
                { '$reimbursementsAssist.created_by$': createFor },
            );
        }
        else {
            req.query.filter[Op.and].push(
                { '$reimbursementsAssist.created_by$': id },
            );
        }
        if (!isNullOrEmpty(categories_id)) {
            req.query.filter[Op.and].push(
                { '$category.id$': categories_id }
            );
        } else {
            req.query.filter[Op.and].push({
                '$category.id$': { [Op.in]: [4, 5, 6, 7] }
            });
        }

        req.query.filter[Op.and].push(
            { '$reimbursementsAssist.request_date$': getFiscalYearWhere },
            { '$reimbursementsAssist.status$': { [Op.eq]: status.approve } },

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
        const { fund_sum_request, categories_id } = req.body;
        const welfareCheckData = await reimbursementsAssist.findOne({
            attributes: ["fund_sum_request", "reim_number"],
            include: [
                {
                    model: users,
                    as: "created_by_user",
                    attributes: ['name', 'email'],
                }
            ],
            where: { id: dataId, categories_id: categories_id },
        });
        if (!welfareCheckData) {
            return res.status(400).json({
                message: "ไม่พบข้อมูล",
            });
        }
        const oldWelfareData = JSON.parse(JSON.stringify(welfareCheckData));
        if (req.access && (req.body.status === status.NotApproved || req.body.status === status.approve) && !isNullOrEmpty(req.body.status)) {
            sendMail(oldWelfareData.created_by_user.email, oldWelfareData.reim_number, req.body.status, oldWelfareData.created_by_user.name);
            return next();
        }
        const results = await reimbursementsAssist.findOne({
            attributes: [
                [
                    literal("category.fund - SUM(reimbursementsAssist.fund_sum_request)"),
                    "fundRemaining"
                ],
                [col("category.per_times"), "perTimes"],
                [
                    literal("category.per_years - COUNT(reimbursementsAssist.fund_sum_request)"),
                    "requestsRemaining"
                ],
                [
                    literal("category.per_users - COUNT(reimbursementsAssist.fund_sum_request)"),
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
        sendMail(oldWelfareData.created_by_user.email, oldWelfareData.reim_number, req.body.status, oldWelfareData.created_by_user.name);
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
        const { fund_sum_request, categories_id, } = req.body;
        if (req.access && (req.body.status === status.NotApproved || req.body.status === status.approve) && !isNullOrEmpty(req.body.status)) {
            return next();
        }
        const getFund = await categories.findOne({
            attributes: [
                [col("fund"), "fundRemaining"],
                [col("per_times"), "perTimes"],
            ],
            where: { id: categories_id }
        })
        if (getFund) {
            const datas = JSON.parse(JSON.stringify(getFund));
            if (fund_sum_request > datas.perTimes && datas.perTimes) {
                return res.status(400).json({
                    message: "คุณสามารถเบิกได้สูงสุด " + datas.perTimes + " ต่อครั้ง",
                });
            }
            if (fund_sum_request > datas.fundRemaining && datas.fundRemaining) {
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
        const { status, categories_id, fund_sum_request, createFor } = req.body;
        if (!categories_id) {
            return res.status(400).json({ message: "Category ID is missing or invalid" });
        }

        const { filter } = req.query;
        let whereObj = { ...filter };
        if (!isNullOrEmpty(categories_id)) {
            whereObj['$category.id$'] = { [Op.in]: [4, 5, 6, 7] };
        }

        const results = await reimbursementsAssist.findAll({
            attributes: [
                [literal("COALESCE(category.fund - SUM(reimbursementsAssist.fund_sum_request), 0)"), "fundRemaining"],
                [col("category.per_times"), "perTimes"],
                [
                    literal("category.per_years - COUNT(reimbursementsAssist.fund_sum_request)"),
                    "requestsRemaining"
                ],
                [
                    literal("category.per_users - COUNT(reimbursementsAssist.fund_sum_request)"),
                    "perUsersRemaining"
                ]
            ],
            include: [
                {
                    model: categories,
                    as: "category",
                    attributes: [],
                }
            ],
            where: whereObj,
            group: ["category.id"]
        });

        if (results && results.length > 0) {
            const datas = JSON.parse(JSON.stringify(results));
            const remainingData = datas[0] || {};
            if (status === 1) {
                return next();
            }
            if (dynamicCheckRemaining(remainingData)) {
                logger.info('No Remaining', { method });
                return res.status(400).json({
                    message: "ไม่มีสิทธิ์ขอเบิกสวัสดิการดังกล่าว เนื่องจากได้ทำการขอเบิกครบแล้ว",
                });
            };
            if (fund_sum_request > remainingData.perTimes && !isNullOrEmpty(remainingData.perTimes)) {
                return res.status(400).json({
                    message: "คุณสามารถเบิกได้สูงสุด " + remainingData.perTimes + " ต่อครั้ง",
                });
            }
            if (fund_sum_request > remainingData.fundRemaining && !isNullOrEmpty(remainingData.fundRemaining)) {
                logger.info('Request Over', { method });
                return res.status(400).json({
                    message: "จำนวนที่ขอเบิกเกินเพดานเงินกรุณาลองใหม่อีกครั้ง",
                });
            }
        }
        next();
    } catch (error) {
        logger.error(`Error in ${method}: ${error.message}`, { method });
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const deletedMiddleware = async (req, res, next) => {
    const method = 'DeletedMiddleware';
    try {
        const dataId = req.params['id'];
        const { id } = req.user;
        const results = await reimbursementsAssist.findOne({
            attributes: ["status"],
            where: { id: dataId, created_by: id },
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