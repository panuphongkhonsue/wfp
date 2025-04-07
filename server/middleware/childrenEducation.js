const { permissionsHasRoles, childrenInfomation, subCategories, reimbursementsChildrenEducationHasChildrenInfomation, reimbursementsChildrenEducation, users } = require('../models/mariadb')
const { isNullOrEmpty, getFiscalYear, getYear2Digits, formatNumber, isInvalidNumber } = require('../middleware/utility');
const permissionType = require('../enum/permission')
const { Op, literal, col, fn } = require("sequelize");
const { initLogger } = require('../logger');
const logger = initLogger('ChildrenEducationValidator');
const roleType = require('../enum/role')
const statusType = require('../enum/status')
const statusText = require('../enum/statusText')
const welfareType = require('../enum/welfareType');
const { sendMail } = require('../helper/mail');

const authPermission = async (req, res, next) => {
    const method = 'AuthPermission';
    const { roleId } = req.user;
    try {
        const isAccess = await permissionsHasRoles.count({
            where: {
                [Op.and]: [{ roles_id: roleId }, { permissions_id: permissionType.childrenEdWelfare }],
            },
        });
        if (!isAccess) {
            throw Error("You don't have access to this API");
        }
        else {
            const isEditor = await permissionsHasRoles.count({
                where: {
                    [Op.and]: [{ roles_id: roleId }, { permissions_id: permissionType.childrenEdWelfare }],
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

const bindFilter = async (req, res, next) => {
    const method = 'BindFilter';
    const { id } = req.user;
    try {
        const { keyword, from, to, status } = req.query;
        req.query.filter = {};
        req.query.filter[Op.and] = [];


        if (!isNullOrEmpty(keyword)) {
            req.query.filter[Op.and].push({
                '$reimbursementsChildrenEducation.reim_number$': { [Op.like]: `%${keyword}%` },
            });
        }

        if (!isNullOrEmpty(from) && !isNullOrEmpty(to)) {
            req.query.filter[Op.and].push({
                '$reimbursementsChildrenEducation.request_date$': { [Op.between]: [from, to] }
            });
        }

        if (!isNullOrEmpty(from) && isNullOrEmpty(to)) {
            req.query.filter[Op.and].push({
                '$reimbursementsChildrenEducation.request_date$': { [Op.between]: [from] }
            });
        }

        if (!isNullOrEmpty(status)) {
            req.query.filter[Op.and].push({
                '$reimbursementsChildrenEducation`.status$': { [Op.eq]: status }
            });
        }
        req.query.filter[Op.and].push({
            '$reimbursementsChildrenEducation.created_by$': { [Op.eq]: id },
        });

        next();
    } catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(400).json({ error: error.message });
    }
};

const getRemaining = async (req, res, next) => {
    const method = 'RemainingMiddleware';
    try {
        const { id } = req.user || {};
        const { createFor } = req.query || {};
        const { created_by, createByData} = req.body || {};

        if(req.access && (req.body.status === statusType.NotApproved || req.body.status === statusType.approve) && !isNullOrEmpty(req.body.status)){
            return next();
        }

        // ตรวจสอบให้แน่ใจว่า filter[Op.and] ถูกกำหนดค่า
        if (!req.query.filter) {
            req.query.filter = {};
        }
        if (!Array.isArray(req.query.filter[Op.and])) {
            req.query.filter[Op.and] = [];
        }
        const getFiscalYearWhere = getFiscalYear();


        if (req.access && !isNullOrEmpty(createByData)) {
            req.query.filter[Op.and].push({
                '$reimbursements_children_education_has_children_infomations.reimbursements_children_education.created_by$': createByData
            });
        } else if (!isNullOrEmpty(created_by) && req.isEditor) {
            req.query.filter[Op.and].push({
                '$reimbursements_children_education_has_children_infomations.reimbursements_children_education.created_by$': created_by
            });
        } else if (!isNullOrEmpty(createFor) && req.isEditor) {
            req.query.filter[Op.and].push({
                '$reimbursements_children_education_has_children_infomations.reimbursements_children_education.created_by$': createFor
            });
        } else {
            req.query.filter[Op.and].push({
                '$reimbursements_children_education_has_children_infomations.reimbursements_children_education.created_by$': id
            });
        }
        // เพิ่มเงื่อนไข statusType.approve
        req.query.filter[Op.and].push(
            {'$reimbursements_children_education_has_children_infomations.reimbursements_children_education.status$': { [Op.eq]: statusType.approve }},
            { '$reimbursements_children_education_has_children_infomations.reimbursements_children_education.request_date$': getFiscalYearWhere, },
    );

        next();
    } catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(400).json({ message: error.message });
    }
};


const checkRemaining = async (req, res, next) => {
    const method = 'CheckRemainingMiddleware';
    const { child, status } = req.body;

    try {
        const userId = req.user?.id;
        const { filter } = req.query;
        let whereObj = { ...filter, [Op.and]: [] };

        for (let i = 0; i < child.length; i++) {
            const currentChild = child[i];
            const childName = currentChild.childName;
            const currentFundSumRequest = Number(currentChild.fundUniversity) + Number(currentChild.fundSubUniversity) || 0


            // ค้นหาข้อมูลการเบิกของบุตรปัจจุบัน
            const results = await childrenInfomation.findAll({
                attributes: [
                    [col("sub_category.id"), "subCategoryId"],
                    [col("childrenInfomation.child_name"), "childName"],
                    [col("sub_category.fund"), "fund"],
                    [fn("SUM", col("childrenInfomation.fund_sum_request")), "totalSumRequested"],
                    [
                        literal("sub_category.fund - SUM(childrenInfomation.fund_sum_request)"),
                        "fundRemaining"
                    ],
                    [col("sub_category.per_times"), "perTimes"],
                    [fn("COUNT", col("childrenInfomation.fund_sum_request")), "totalCountRequested"],
                    [col("sub_category.per_years"), "perYears"],
                    [
                        literal("sub_category.per_years - COUNT(childrenInfomation.fund_sum_request)"),
                        "requestsRemaining"
                    ]
                ],
                include: [
                    {
                        model: subCategories,
                        as: "sub_category",
                        attributes: ['id', 'fund', 'per_times', 'per_years'],
                    },
                    {
                        model: reimbursementsChildrenEducationHasChildrenInfomation,
                        as: "reimbursements_children_education_has_children_infomations",
                        required: true,
                        attributes: [],
                        include: [
                            {
                                model: reimbursementsChildrenEducation,
                                as: "reimbursements_children_education",
                                required: true,
                                attributes: [],
                                where: { created_by: userId, status: statusType.waitApprove }
                            }
                        ]
                    }
                ],
                where: { ...whereObj, child_name: childName },
                group: ["childrenInfomation.child_name", "sub_category.id"]
            });

            let fundRemaining = 0;
            let requestsRemaining = 0;
            let perTimes = 0;
            let fund = 0;

            if (results.length > 0) {
                // หากบุตรมีประวัติการเบิก
                const data = results[0].dataValues;
                fundRemaining = data.fundRemaining || 0;
                requestsRemaining = data.requestsRemaining || 0;
                fund = data.fund || 0;
                perTimes = data.perTimes || 0;
                if (status !== statusType.draft) {
                    if (fundRemaining === 0 || requestsRemaining === 0) {
                        logger.info(`No Remaining for child ${childName}`, { method });
                        return res.status(400).json({
                            message: `บุตร ${childName} ไม่มีสิทธิ์ขอเบิก เนื่องจากสิทธิ์เต็มแล้ว`,
                        });
                    }

                    if (currentFundSumRequest > perTimes && perTimes) {
                        return res.status(400).json({
                            message: `บุตร ${childName} สามารถเบิกได้สูงสุด ${perTimes} ต่อครั้ง`,
                        });
                    }

                    if (currentFundSumRequest > fundRemaining && fundRemaining) {
                        logger.info(`Request Over for child ${childName}`, { method });
                        return res.status(400).json({
                            message: `ยอดเงินคงเหลือของบุตร ${childName} สามารถเบิกเบิกได้ ${fundRemaining} กรุณาลองใหม่อีกครั้ง`,
                        });
                    }

                    if (currentFundSumRequest > fund && fund) {
                        logger.info(`Request Over for child ${childName}`, { method });
                        return res.status(400).json({
                            message: `ยอหเพดานเงินที่บุตร ${childName} สามารถเบิกเบิกได้ ${fund} กรุณาลองใหม่อีกครั้ง`,
                        });
                    }
                }

            } else {
                // หากบุตรไม่เคยเบิก ใช้ข้อมูลจาก resultsSub
                const resultsSub = await subCategories.findOne({
                    attributes: [
                        'id',
                        [col("fund"), "fund"],
                        [col("per_times"), "perTimes"]
                    ],
                    where: { id: Number(currentChild.subCategoriesId) }
                });

                if (resultsSub) {
                    fund = resultsSub.fund || 0;
                    perTimes = resultsSub.dataValues?.perTimes || 0;
                    if (status !== statusType.draft) {

                        if (currentFundSumRequest > perTimes && perTimes) {
                            return res.status(400).json({
                                message: `บุตร ${childName} สามารถเบิกได้สูงสุด ${perTimes} ต่อครั้ง`,
                            });
                        }

                        if (currentFundSumRequest > fund && fund) {
                            logger.info(`Request Over for child ${childName}`, { method });
                            return res.status(400).json({
                                message: `ยอดเงินคงเหลือของบุตร ${childName} สามารถเบิกเบิกได้ ${fund} กรุณาลองใหม่อีกครั้ง`,
                            });
                        }

                    }
                }
            }

        }

        return next();
    } catch (error) {
        logger.error(`Error ${error.message}`, { method });
        next(error);
    }
};


const bindCreate = async (req, res, next) => {
    try {
        const {
            prefix,
            spouse,
            marryRegis,
            role,
            position,
            department,
            fundEligible,
            fundSumReceipt,
            categoriesId,
            actionId,
            eligibleBenefits,
            eligibleSubSenefits,
            createFor,
            parentalStatus,
            eligible
        } = req.body;

        const { id, roleId } = req.user;

        if (!isNullOrEmpty(createFor) && roleId !== roleType.financialUser) {
            return res.status(400).json({ message: "ไม่มีสิทธิ์สร้างให้คนอื่นได้" });
        }
        if (!isNullOrEmpty(createFor) && actionId == statusType.draft && createFor !== id) {
            return res.status(400).json({
                message: "กรณีเบิกให้ผู้อื่น ไม่สามารถบันทึกฉบับร่างได้",
            });
        }

        if (!isNullOrEmpty(req.body.child) && !Array.isArray(req.body.child)) {
            return res.status(400).json({ message: "ข้อมูล child ต้องเป็น array" });
        }

        const results = await reimbursementsChildrenEducation.findOne({
            attributes: ["id"],
            order: [["id", "DESC"]]
        });

        var reimNumber = getYear2Digits() + formatNumber(welfareType.childrenEducation) + formatNumber(1);
        if (results) {
            const datas = JSON.parse(JSON.stringify(results));
            reimNumber = getYear2Digits() + formatNumber(welfareType.childrenEducation) + formatNumber(datas.id + 1);
        }

        let childFundReceipt = 0;
        let childfundOther = 0;
        let childFundUniversity = 0;
        let childFundRequest = 0;

        if (!isNullOrEmpty(req.body.child)) {

            childFundReceipt = req.body.child.reduce((sum, child) => {
                let sumReceipt = !isNaN(Number(child.fundReceipt)) ? Number(child.fundReceipt) : 0;
                return sum + (isNaN(sumReceipt) ? 0 : sumReceipt);
            }, 0);

            childFundRequest = req.body.child.reduce((sum, child) => {

                let sumRequest = (!isNaN(Number(child.fundUniversity)) ? Number(child.fundUniversity) : 0) +
                    (!isNaN(Number(child.fundSubUniversity)) ? Number(child.fundSubUniversity) : 0);
                return sum + (isNaN(sumRequest) ? 0 : sumRequest);

            }, 0);

            childfundOther = req.body.child.reduce((sum, child) => {
                let sumOther = !isNaN(Number(child.fundOther)) ? Number(child.fundOther) : 0;
                return sum + (isNaN(sumOther) ? 0 : sumOther);
            }, 0);

            childFundUniversity = req.body.child.reduce((sum, child) => {
                let sumUniversity = (!isNaN(Number(child.fundUniversity)) ? Number(child.fundUniversity) : 0) +
                    (!isNaN(Number(child.fundSubUniversity)) ? Number(child.fundSubUniversity) : 0);
                return sum + (isNaN(sumUniversity) ? 0 : sumUniversity);
            }, 0);

        }


        const dataBinding = {
            reim_number: reimNumber,
            fund_receipt: childFundReceipt,
            fund_eligible: fundEligible,
            fund_university: childFundUniversity,
            fund_sum_request: childFundRequest,
            fund_sum_receipt: fundSumReceipt,
            fund_other: childfundOther,
            status: actionId,
            spouse: prefix + ' ' + spouse,
            eligible: eligible,
            marry_regis: marryRegis,
            role: role,
            position: position,
            department: department,
            request_date: actionId === statusType.waitApprove ? new Date() : null,
            created_by: createFor ?? id,
            updated_by: id,
            eligible_benefits: eligibleBenefits,
            eligible_sub_benefits: eligibleSubSenefits,
            parental_status: parentalStatus,
            categories_id: categoriesId,
            child: req.body.child,
        };
        var hasNull = false;
        if (!isNullOrEmpty(dataBinding.child)) {
            hasNull = dataBinding.child.some(item =>
                Object.values(item).some(value => value === null || value === "")
            );
        }
        if (hasNull) {
            delete dataBinding.child;
        }

        req.body = dataBinding;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const bindUpdate = async (req, res, next) => {
    try {
        const {
            prefix,
            spouse,
            marryRegis,
            role,
            position,
            department,
            fundEligible,
            fundSumReceipt,
            actionId,
            createFor,
            deleteChild,
            eligibleBenefits,
            eligibleSubSenefits,
            parentalStatus,
            eligible
        } = req.body;


        const { id, roleId } = req.user;
        if (!isNullOrEmpty(createFor) && roleId !== roleType.financialUser) {
            return res.status(400).json({
                message: "ไม่มีสิทธิ์แก้ไขให้คนอื่นได้",
            });
        }
        if (!isNullOrEmpty(createFor) && actionId == statusType.draft && createFor !== id && roleId !== roleType.financialUser) {
            return res.status(400).json({
                message: "กรณีเบิกให้ผู้อื่น ไม่สามารถบันทึกฉบับร่างได้",
            });
        }
        const dataId = req.params['id'];
        const results = await reimbursementsChildrenEducation.findOne({
            attributes: ["status", "created_by"],
            where: { id: dataId },
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

            if (req.access && (actionId === statusType.NotApproved || actionId === statusType.approve) && !isNullOrEmpty(actionId)) {
                const dataBinding = {
                    status: actionId,
                    updated_by: id,
                }
                req.body = dataBinding;
                return next();
            }
        } else {
            return res.status(400).json({
                message: "ไม่พบข้อมูล",
            });
        }

        let childFundReceipt = 0;
        let childfundOther = 0;
        let childFundUniversity = 0;
        let childFundRequest = 0;

        if (!isNullOrEmpty(req.body.child)) {

            childFundReceipt = req.body.child.reduce((sum, child) => {
                let sumReceipt = !isNaN(Number(child.fundReceipt)) ? Number(child.fundReceipt) : 0;
                return sum + (isNaN(sumReceipt) ? 0 : sumReceipt);
            }, 0);

            childFundRequest = req.body.child.reduce((sum, child) => {
                let sumRequest = (!isNaN(Number(child.fundUniversity)) ? Number(child.fundUniversity) : 0) +
                    (!isNaN(Number(child.fundSubUniversity)) ? Number(child.fundSubUniversity) : 0);
                return sum + (isNaN(sumRequest) ? 0 : sumRequest);

            }, 0);

            childfundOther = req.body.child.reduce((sum, child) => {
                let sumOther = !isNaN(Number(child.fundOther)) ? Number(child.fundOther) : 0;
                return sum + (isNaN(sumOther) ? 0 : sumOther);
            }, 0);

            childFundUniversity = req.body.child.reduce((sum, child) => {
                let sumUniversity = (!isNaN(Number(child.fundUniversity)) ? Number(child.fundUniversity) : 0) +
                    (!isNaN(Number(child.fundSubUniversity)) ? Number(child.fundSubUniversity) : 0);
                return sum + (isNaN(sumUniversity) ? 0 : sumUniversity);
            }, 0);

        }

        const dataBinding = {
            fund_receipt: childFundReceipt,
            fund_eligible: fundEligible,
            fund_university: childFundUniversity,
            fund_sum_request: childFundRequest,
            fund_sum_receipt: fundSumReceipt,
            fund_other: childfundOther,
            spouse: prefix + ' ' + spouse,
            marry_regis: marryRegis,
            eligible: eligible,
            role: role,
            position: position,
            department: department,
            request_date: actionId === statusType.waitApprove ? new Date() : null,
            updated_by: id,
            eligible_benefits: eligibleBenefits,
            eligible_sub_benefits: eligibleSubSenefits,
            parental_status: parentalStatus,
            child: req.body.child,
        };

        if (!isNullOrEmpty(deleteChild)) {
            req.deleteChild = deleteChild;

        }
        if (isNullOrEmpty(req.body.child)) {
            delete dataBinding.child;
        } else {
            var hasNull = false;
            if (!isNullOrEmpty(dataBinding.child)) {
                hasNull = req.body.child.some(item =>
                    Object.values(item).some(value => value === null || value === "")
                );
            }
            if (hasNull) {
                delete dataBinding.child;
            }
        }
        if (!isNullOrEmpty(actionId)) {
            dataBinding.status = actionId;
            if (actionId === statusType.waitApprove) {
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
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deletedMiddleware = async (req, res, next) => {
    const method = 'DeletedMiddleware';
    try {
        const dataId = req.params['id'];
        const { id } = req.user;
        const results = await reimbursementsChildrenEducation.findOne({
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

const byIdMiddleWare = async (req, res, next) => {
    const method = 'ByIdMiddleware';
    const dataId = req.params['id'];
    const { id } = req.user;
    try {
        req.query.filter = {};
        req.query.filter[Op.and] = [];

        req.query.childrenEducation = {};
        req.query.childrenEducation[Op.and] = [];

        if (req.access) {
            req.query.filter[Op.and].push(
                { '$reimbursementsChildrenEducation.id$': { [Op.eq]: dataId } },
            );
        }
        else {

            req.query.filter[Op.and].push(
                { '$reimbursementsChildrenEducation.id$': { [Op.eq]: dataId } },
                { '$reimbursementsChildrenEducation.created_by$': { [Op.eq]: id }, }
            );
        }
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(400).json({ message: error.message });
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

const checkNullValue = async (req, res, next) => {
    try {
        const { spouse, marryRegis, child, actionId } = req.body;
        if (req.access && (actionId === statusType.NotApproved || actionId === statusType.approve) && !isNullOrEmpty(actionId)) {
            return next();
        }
        const errorObj = {};
        if (!isInvalidNumber(spouse)) {
            errorObj["spouse"] = "ค่าที่กรอกไม่ใช่ตัวหนังสือ";
        }

        if (isNullOrEmpty(marryRegis)) {
            errorObj["marryRegis"] = "กรุณาเลือกการจดทะเบียนสมรส";
        }


        if (!isNullOrEmpty(child) && Array.isArray(child)) {
            child.forEach((c) => {
                if (isNullOrEmpty(c.fundReceipt) || c.fundReceipt === '') {
                    errorObj["fundReceipt"] = "กรุณากรอกข้อมูลจำนวนเงินตามใบเสร็จ";
                } else if (isInvalidNumber(c.fundReceipt)) {
                    errorObj["fundReceipt"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
                } else if (c.fundReceipt <= 0) {
                    return res.status(400).json({
                        message: "จำนวนเงินตามใบเสร็จน้อยกว่า 0 ไม่ได้",
                    });
                }

                if (isNullOrEmpty(c.fundOther) || c.fundOther === '') {
                    errorObj["fundOther"] = "กรุณากรอกข้อมูลจำนวนเงินตามขอเบิกจากหน่วยงานอื่น";
                } else if (isInvalidNumber(c.fundOther)) {
                    errorObj["fundOther"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
                } else if (c.fundOther < 0) {
                    return res.status(400).json({
                        message: "จำนวนเงินตามใบเสร็จน้อยกว่า 0 ไม่ได้",
                    });
                }

                if (isNullOrEmpty(c.fundUniversity) || c.fundUniversity === '') {
                    errorObj["fundUniversity"] = "กรุณากรอกข้อมูลจำนวนเงินตามขอเบิกจากสวัสดิการมหาวิทยาลัย 5(8)";
                } else if (isInvalidNumber(c.fundUniversity)) {
                    errorObj["fundUniversity"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
                } else if (c.fundUniversity < 0) {
                    return res.status(400).json({
                        message: "จำนวนเงินตามใบเสร็จน้อยกว่า 0 ไม่ได้",
                    });
                }

                if (isNullOrEmpty(c.fundSubUniversity) || c.fundSubUniversity === '') {
                    errorObj["fundSubUniversity"] = "กรุณากรอกข้อมูลจำนวนเงินตามขอเบิกจากสวัสดิการมหาวิทยาลัย 5(9),(10)";
                } else if (isInvalidNumber(c.fundSubUniversity)) {
                    errorObj["fundSubUniversity"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
                } else if (c.fundSubUniversity < 0) {
                    return res.status(400).json({
                        message: "จำนวนเงินตามใบเสร็จน้อยกว่า 0 ไม่ได้",
                    });
                }

                if (isNullOrEmpty(c.childName)) {
                    errorObj["childName"] = "กรุณากรอกชื่อบุตร";
                }

                if (isNullOrEmpty(c.childFatherNumber)) {
                    errorObj["childFatherNumber"] = "กรุณากรอกลำดับบุตรของบิดา";
                } else if (isInvalidNumber(c.childFatherNumber)) {
                    errorObj["childFatherNumber"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
                } else if (c.childFatherNumber <= 0) {
                    errorObj["childFatherNumber"] = "ลำดับบุตรของบิดาต้องมากกว่า 0";
                }

                if (isNullOrEmpty(c.childMotherNumber)) {
                    errorObj["childMotherNumber"] = "กรุณากรอกลำดับบุตรของมารดา";
                } else if (isInvalidNumber(c.childMotherNumber)) {
                    errorObj["childMotherNumber"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
                } else if (c.childMotherNumber <= 0) {
                    errorObj["childMotherNumber"] = "ลำดับบุตรของมารดาต้องมากกว่า 0";
                }

                if (isNullOrEmpty(c.schoolName)) {
                    errorObj["schoolName"] = "กรุณากรอกชื่อโรงเรียน";
                } else if (!isInvalidNumber(c.schoolName)) {
                    errorObj["schoolName"] = "ค่าที่กรอกไม่ใช่ตัวหนังสือ";
                }

                if (isNullOrEmpty(c.district)) {
                    errorObj["district"] = "กรุณากรอกอำเภอ";
                } else if (!isInvalidNumber(c.district)) {
                    errorObj["district"] = "ค่าที่กรอกไม่ใช่ตัวหนังสือ";
                }

                if (isNullOrEmpty(c.province)) {
                    errorObj["province"] = "กรุณากรอกจังหวัด";
                } else if (!isInvalidNumber(c.province)) {
                    errorObj["province"] = "ค่าที่กรอกไม่ใช่ตัวหนังสือ";
                }

                if (isNullOrEmpty(c.subCategoriesId)) {
                    errorObj["subCategoriesId"] = "กรุณากรอกระดับชั้นเรียน";
                }

                if (c.childPassedAway) {
                    if (isNullOrEmpty(c.delegateName)) {
                        errorObj["delegateName"] = "กรุณากรอกลำดับบุตรที่เสียชีวิต";
                    } else if (!isInvalidNumber(c.delegateName)) {
                        errorObj["delegateName"] = "ค่าที่กรอกไม่ใช่ตัวหนังสือ";
                    }

                    if (isNullOrEmpty(c.delegateDeathDay)) {
                        errorObj["delegateDeathDay"] = "กรุณากรอกวันที่ถึงแก่กรรม";
                    }


                } else {
                    req.body = {
                        ...req.body,
                        delegateName: null,
                        delegateName: null,
                        delegateBirthDay: null,
                        delegateDeathDay: null,
                    }

                }


            });
        }

        if ((isNullOrEmpty(actionId) || (actionId != statusType.draft && actionId != statusType.waitApprove)) && !req.access) {
            return res.status(400).json({
                message: "ไม่มีการกระทำที่ต้องการ",
            });
        }
        if (Object.keys(errorObj).length > 0) {
            return res.status(400).json({ errors: errorObj });
        }


        next();
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

const checkUpdateRemaining = async (req, res, next) => {
    const method = 'CheckUpdateRemainingMiddleware';
    try {
        const { filter } = req.query;
        const dataId = req.params['id'];
        const userId = req.user?.id;
        var whereObj = { ...filter }
        const { fund_sum_request} = req.body;
        const welfareCheckData = await reimbursementsChildrenEducation.findOne({
            attributes: ["fund_sum_request", "reim_number"],
            include: [
                {
                  model: users,
                  as: "created_by_user",
                  attributes: ['name','email'],
                }
            ],
            where: { id: dataId },
        });
        if (!welfareCheckData) {
            return res.status(400).json({
                message: "ไม่พบข้อมูล",
            });
        }
        const oldWelfareData = JSON.parse(JSON.stringify(welfareCheckData));
        if(req.access && (req.body.status === statusType.NotApproved || req.body.status === statusType.approve) && !isNullOrEmpty(req.body.status)){
            sendMail(oldWelfareData.created_by_user.email,oldWelfareData.reim_number,req.body.status,oldWelfareData.created_by_user.name);
            return next();
        }

        const results = await childrenInfomation.findAll({
            attributes: [
                [
                    literal("sub_category.fund - COALESCE(SUM(childrenInfomation.fund_sum_request), 0)"),
                    "fundRemaining"
                ],
                [col("sub_category.per_times"), "perTimes"],
                [
                    literal("sub_category.per_years - COALESCE(COUNT(childrenInfomation.fund_sum_request), 0)"),
                    "requestsRemaining"
                ]
            ],
            include: [
                {
                    model: subCategories,
                    as: "sub_category",
                    attributes: []
                },
                {
                    model: reimbursementsChildrenEducationHasChildrenInfomation,
                    as: "reimbursements_children_education_has_children_infomations",
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: reimbursementsChildrenEducation,
                            as: "reimbursements_children_education",
                            required: true,
                            attributes: [],
                            where: { created_by: userId }
                        }
                    ]
                }
            ],
            where: whereObj,
            group: ["childrenInfomation.child_name",
                "sub_category.id"]
        });
        
        if (results) {
            const datas = JSON.parse(JSON.stringify(results));
            
            if (fund_sum_request < oldWelfareData.fund_sum_request) {
                return next();
            }
            else if (fund_sum_request > datas.perTimes) {
                return res.status(400).json({
                    message: "คุณสามารถเบิกได้สูงสุด " + datas.perTimes + " ต่อครั้ง",
                });
            }
            else {
                const diffFund = fund_sum_request - oldWelfareData.fund_sum_request;
                if (datas.fundRemaining === 0 || datas.fundRemaining - diffFund < 0) {
                    return res.status(400).json({
                        message: "ไม่สามารถทำรายการได้เนื่องจากเกินเพดานเงินคงเหลือ",
                    });
                }
            }
        };
        sendMail(oldWelfareData.created_by_user.email,oldWelfareData.reim_number,req.body.status,oldWelfareData.created_by_user.name);
        next();
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
    checkUpdateRemaining
};