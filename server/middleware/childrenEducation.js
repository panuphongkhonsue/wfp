const { permissionsHasRoles, childrenInfomation, subCategories, reimbursementsChildrenEducationHasChildrenInfomation, reimbursementsChildrenEducation } = require('../models/mariadb')
const { isNullOrEmpty, getFiscalYear, getYear2Digits, formatNumber, isInvalidNumber } = require('../middleware/utility');
const permissionType = require('../enum/permission')
const { Op, literal, col, where } = require("sequelize");
const { initLogger } = require('../logger');
const logger = initLogger('ChildrenEducationValidator');
const roleType = require('../enum/role')
const status = require('../enum/status')
const statusText = require('../enum/statusText')
const welfareType = require('../enum/welfareType');

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
        req.query.filter = {};
        req.query.filter[Op.and] = [];
        const getFiscalYearWhere = getFiscalYear();
        req.query.filter[Op.and].push(
            { '$reimbursements_children_education_has_children_infomations.reimbursements_children_education.request_date$': getFiscalYearWhere, },
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
    const { child, status } = req.body;

    try {

        const userId = req.user?.id;
        const { filter } = req.query;
        let whereObj = { ...filter, [Op.and]: [] };
        const subCategoriesIds = child?.map(c => Number(c.subCategoriesId)) || [];
        const fundSumRequests = child?.map(c => Number(c.fundUniversity) - Number(c.fundOther) || 0) || [];

        // Loop ผ่านบุตรแต่ละคน
        for (let i = 0; i < child.length; i++) {
            const currentChild = child[i];
            const childName = currentChild.childName;
            const currentFundSumRequest = fundSumRequests[i];

            // ค้นหาข้อมูลที่เกี่ยวข้องกับบุตรปัจจุบัน
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
                        attributes: [],
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
                group: ["childrenInfomation.child_name", "sub_category.id"]
            });

            const resultsSub = await subCategories.findAll({
                attributes: [
                    'id',
                    [col("fund"), "fundRemaining"],
                    [col("per_times"), "perTimes"],


                ],
                where: { id: { [Op.in]: subCategoriesIds } } // แก้ไขเงื่อนไขนี้   

            })

            if (results && !isNullOrEmpty(resultsSub)) {
                const datas = JSON.parse(JSON.stringify(resultsSub));
                const fundRemaining = datas[0]?.fundRemaining || 0;
                const perTimes = datas[0]?.perTimes || 0;
                if (status === 1) {
                    return next();
                }


                // ตรวจสอบว่าจำนวนที่ขอเบิกเกินจำนวนครั้งที่สามารถขอได้หรือไม่
                if (currentFundSumRequest > perTimes && perTimes) {
                    return res.status(400).json({
                        message: `บุตร ${childName} สามารถเบิกได้สูงสุด ${perTimes} ต่อครั้ง`,
                    });
                }

                // ตรวจสอบว่าจำนวนที่ขอเบิกเกินเพดานเงินหรือไม่
                if (currentFundSumRequest > fundRemaining && fundRemaining) {
                    logger.info(`Request Over for child ${childName}`, { method });
                    return res.status(400).json({
                        message: `จำนวนที่ขอเบิกของบุตร ${childName} เกินเพดานเงิน กรุณาลองใหม่อีกครั้ง`,
                    });
                }
            }

            if (!isNullOrEmpty(results)) {
                const datas = JSON.parse(JSON.stringify(results));  // ตรวจสอบ fundRemaining จากผลลัพธ์

                const fundRemaining = datas[0]?.fundRemaining || 0;
                const requestsRemaining = datas[0]?.requestsRemaining || 0;
                const perTimes = datas[0]?.perTimes || 0;

                if (status === 1) {
                    return next();
                }

                // ตรวจสอบว่าค่าคงเหลือเป็น 0 หรือไม่
                if (fundRemaining === 0 || requestsRemaining === 0) {
                    logger.info(`No Remaining for child ${childName}`, { method });
                    return res.status(400).json({
                        message: `บุตร ${childName} ไม่มีสิทธิ์ขอเบิก เนื่องจากสิทธิ์เต็มแล้ว`,
                    });
                }

                // ตรวจสอบว่าจำนวนที่ขอเบิกเกินจำนวนครั้งที่สามารถขอได้หรือไม่
                if (currentFundSumRequest > perTimes && perTimes) {
                    return res.status(400).json({
                        message: `บุตร ${childName} สามารถเบิกได้สูงสุด ${perTimes} ต่อครั้ง`,
                    });
                }

                // ตรวจสอบว่าจำนวนที่ขอเบิกเกินเพดานเงินหรือไม่
                if (currentFundSumRequest > fundRemaining && fundRemaining) {
                    logger.info(`Request Over for child ${childName}`, { method });
                    return res.status(400).json({
                        message: `จำนวนที่ขอเบิกของบุตร ${childName} เกินเพดานเงิน กรุณาลองใหม่อีกครั้ง`,
                    });
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
            createFor,
            eligible
        } = req.body;

        const { id, roleId } = req.user;

        if (!isNullOrEmpty(createFor) && roleId !== roleType.financialUser) {
            return res.status(400).json({ message: "ไม่มีสิทธิ์สร้างให้คนอื่นได้" });
        }
        if (!isNullOrEmpty(createFor) && actionId == status.draft && createFor !== id) {
            return res.status(400).json({
                message: "กรณีเบิกให้ผู้อื่น ไม่สามารถบันทึกฉบับร่างได้",
            });
        }

        const results = await reimbursementsChildrenEducation.findOne({
            attributes: ["id"],
            order: [["id", "DESC"]]
        });

        var reimNumber;
        if (results) {
            const datas = JSON.parse(JSON.stringify(results));
            reimNumber = getYear2Digits() + formatNumber(welfareType.childrenEducation) + formatNumber(datas.id + 1);
        }

        let childFundReceipt = 0;
        let childfundOther = 0;
        let childFundUniversity = 0;
        if (!isNullOrEmpty(req.body.child)) {

            childFundReceipt = req.body.child.reduce((sum, child) => {
                let sumReceipt = Number(child.fundReceipt);
                return sum + (isNaN(sumReceipt) ? 0 : sumReceipt);
            }, 0);

            childfundOther = req.body.child.reduce((sum, child) => {
                let sumOther = Number(child.fundOther);
                return sum + (isNaN(sumOther) ? 0 : sumOther);
            }, 0);

            childFundUniversity = req.body.child.reduce((sum, child) => {
                let sumUniversity = Number(child.fundUniversity);
                return sum + (isNaN(sumUniversity) ? 0 : sumUniversity);
            }, 0);

        }


        const dataBinding = {
            reim_number: reimNumber,
            fund_receipt: childFundReceipt,
            fund_eligible: fundEligible,
            fund_university: childFundUniversity,
            fund_sum_request: childFundUniversity - childfundOther,
            fund_sum_receipt: fundSumReceipt,
            fund_other: childfundOther,
            status: actionId,
            spouse: prefix + ' ' + spouse,
            eligible: eligible,
            marry_regis: marryRegis,
            role: role,
            position: position,
            department: department,
            request_date: actionId === status.waitApprove ? new Date() : null,
            created_by: createFor ?? id,
            updated_by: id,
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
            categoriesId,
            actionId,
            createFor,
            deleteChild,
            eligible
        } = req.body;

        const { id, roleId } = req.user;
        if (!isNullOrEmpty(createFor) && roleId !== roleType.financialUser) {
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
            if (req.access && (datas.status == statusText.draft || datas.status == statusText.approve)) {
                return res.status(400).json({
                    message: "ไม่สามารถแก้ไขได้ เนื่องจากสถานะไม่ถูกต้อง",
                });
            }
        }

        let childFundReceipt = 0;
        let childfundOther = 0;
        let childFundUniversity = 0;
        if (!isNullOrEmpty(req.body.child)) {

            childFundReceipt = req.body.child.reduce((sum, child) => {
                let sumReceipt = Number(child.fundReceipt);
                return sum + (isNaN(sumReceipt) ? 0 : sumReceipt);
            }, 0);

            childfundOther = req.body.child.reduce((sum, child) => {
                let sumOther = Number(child.fundOther);
                return sum + (isNaN(sumOther) ? 0 : sumOther);
            }, 0);

            childFundUniversity = req.body.child.reduce((sum, child) => {
                let sumUniversity = Number(child.fundUniversity);
                return sum + (isNaN(sumUniversity) ? 0 : sumUniversity);
            }, 0);
        }

        const dataBinding = {
            fund_receipt: childFundReceipt,
            fund_eligible: fundEligible,
            fund_university: childFundUniversity,
            fund_sum_request: childFundUniversity - childfundOther,
            fund_sum_receipt: fundSumReceipt,
            fund_other: childfundOther,
            status: actionId,
            spouse: prefix + ' ' + spouse,
            marry_regis: marryRegis,
            eligible: eligible,
            role: role,
            position: position,
            department: department,
            request_date: actionId === status.waitApprove ? new Date() : null,
            updated_by: id,
            categories_id: categoriesId,
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
        const { spouse, marryRegis, role, categoriesId, child, actionId } = req.body;
        const errorObj = {};

        if (isNullOrEmpty(spouse)) {
            errorObj["spouse"] = "กรุณากรอกชื่อคู่สมรส";
        } else if (!isInvalidNumber(spouse)) {
            errorObj["spouse"] = "ค่าที่กรอกไม่ใช่ตัวหนังสือ";
        }

        if (isNullOrEmpty(marryRegis)) {
            errorObj["marryRegis"] = "กรุณาเลือกการจดทะเบียนสมรส";
        }

        if (isNullOrEmpty(role)) {
            errorObj["role"] = "กรุณาเลือกประเภทคู่สมรส";
        }

        if (isNullOrEmpty(categoriesId)) {
            errorObj["categoriesId"] = "กรุณากรอกระดับชั้นเรียน";
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

                if (isNullOrEmpty(c.fundUniversity) || c.fundUniversity === '') {
                    errorObj["fundUniversity"] = "กรุณากรอกข้อมูลจำนวนเงินตามขอเบิกจากหน่วยงานอื่น";
                } else if (isInvalidNumber(c.fundUniversity)) {
                    errorObj["fundUniversity"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
                } else if (c.fundUniversity <= 0) {
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
                    errorObj["district"] = "กรุณากรอกชื่อโรงเรียน";
                } else if (!isInvalidNumber(c.district)) {
                    errorObj["district"] = "ค่าที่กรอกไม่ใช่ตัวหนังสือ";
                }

                if (isNullOrEmpty(c.district)) {
                    errorObj["district"] = "กรุณากรอกชื่อโรงเรียน";
                } else if (!isInvalidNumber(c.district)) {
                    errorObj["district"] = "ค่าที่กรอกไม่ใช่ตัวหนังสือ";
                }

                if (isNullOrEmpty(c.province)) {
                    errorObj["province"] = "กรุณากรอกชื่อโรงเรียน";
                } else if (!isInvalidNumber(c.province)) {
                    errorObj["province"] = "ค่าที่กรอกไม่ใช่ตัวหนังสือ";
                }

                if (isNullOrEmpty(c.subCategoriesId)) {
                    errorObj["subCategoriesId"] = "กรุณากรอกระดับชั้นเรียน";
                }

                if (c.childPassedAway) {
                    if (isNullOrEmpty(c.delegateName)) {
                        errorObj["delegateName"] = "กรุณากรอกชื่อโรงเรียน";
                    } else if (!isInvalidNumber(c.delegateName)) {
                        errorObj["delegateName"] = "ค่าที่กรอกไม่ใช่ตัวหนังสือ";
                    }

                    if (isNullOrEmpty(c.delegateName)) {
                        errorObj["delegateNumber"] = "กรุณากรอกชื่อโรงเรียน";
                    } else if (isInvalidNumber(c.delegateNumber)) {
                        errorObj["delegateNumber"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
                    }

                    if (isNullOrEmpty(c.delegateBirthDay)) {
                        errorObj["delegateBirthDay"] = "กรุณากรอกชื่อโรงเรียน";
                    }

                    if (isNullOrEmpty(c.delegateDeathDay)) {
                        errorObj["delegateDeathDay"] = "กรุณากรอกชื่อโรงเรียน";
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

        if ((isNullOrEmpty(actionId) || (actionId != status.draft && actionId != status.waitApprove)) && !req.access) {
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


const checkFullPerTimes = async (req, res, next) => {
    const method = 'CheckFullPerTimes';
    try {
        const { fund_sum_request, sub_categories_id } = req.body;
        const getFund = await subCategories.findAll({
            attributes: [
                [col("fund"), "fundRemaining"],
                [col("per_times"), "perTimes"],
            ],
            where: { id: sub_categories_id }
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

const checkUpdateRemaining = async (req, res, next) => {
    const method = 'CheckUpdateRemainingMiddleware';
    try {
        const { filter } = req.query;
        const dataId = req.params['id'];
        const userId = req.user?.id;
        var whereObj = { ...filter }
        const { fund_sum_request } = req.body;

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
            const oldWelfareData = JSON.parse(JSON.stringify(welfareCheckData));
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
    checkFullPerTimes,
    checkUpdateRemaining
};