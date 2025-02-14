const { permissionsHasRoles, childrenInfomation, subCategories,reimbursementsChildrenEducationHasChildrenInfomation,reimbursementsChildrenEducation} = require('../models/mariadb')
const { isNullOrEmpty, getFiscalYear, getYear2Digits, formatNumber, isInvalidNumber } = require('../middleware/utility');
const permissionType = require('../enum/permission')
const { Op, literal } = require("sequelize");
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
		next();
	}
	catch (error) {
		logger.error(`Error ${error.message}`, { method });
		res.status(401).json({ error: error.message });
	}
};

const bindFilter = async (req, res, next) => {
	const method = 'BindFilter';
	try {
		const { keyword, from, to, statusReim } = req.query; 
		req.query.filter = {};
		req.query.filter[Op.and] = [];


		if (!isNullOrEmpty(keyword)) {
			req.query.filter[Op.and].push({
				'$reimbursementsChildrenEducation.reim_number$': { [Op.like]: `%${keyword}%` },
			});
		}

		if (!isNullOrEmpty(from) && !isNullOrEmpty(to)) {
			req.query.filter[Op.and].push({
				'$reimbursementsChildrenEducation.request_date$': { [Op.between]: [from,to] }
			});
		}

		if (!isNullOrEmpty(statusReim)) {
			req.query.filter[Op.and].push({
				'$reimbursementsChildrenEducation`.status$': { [Op.eq]: statusReim }
			});
		}

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
    try {
        const { status, fundSumRequest } = req.body;
        const userId = req.user?.id;
        const { filter } = req.query;
        var whereObj = { ...filter };

        const results = await childrenInfomation.findAll({
            attributes: [
                [
                    literal("sub_category.fund - COALESCE(SUM(childrenInfomation.fund_sum_request), 0)"),
                    "fundRemaining"
                ],
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

        if (results.length > 0) {
            const datas = JSON.parse(JSON.stringify(results));

            const noRemaining = datas.some(data => 
                (data.fundRemaining == null || data.fundRemaining <= 0) && 
                (data.requestsRemaining == null || data.requestsRemaining <= 0)
            );

            if (noRemaining) {
                logger.info('No Remaining', { method });
                return res.status(400).json({
                    message: "คุณไม่มีสิทธ์ขอเบิกสวัสดิการดังกล่าว เนื่องจากได้ทำการขอเบิกครบแล้ว",
                });
            }

            const overLimit = datas.some(data => fundSumRequest > data.fundRemaining);

            if (overLimit) {
                logger.info('Request Over', { method });
                return res.status(400).json({
                    message: "จำนวนที่ขอเบิกเกินเพดานเงินกรุณาลองใหม่อีกครั้ง",
                });
            }

            return next();
        }

        res.status(400).json({
            message: "ไม่พบข้อมูลสิทธ์คงเหลือ กรุณาลองอีกครั้ง"
        });
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        next(error);
    }
};

const bindCreate = async (req, res, next) => {
    try {
        const {
            spouse,
            marry_regis,
            role,
            position,
            department,
            fund_university,
            fund_other,
            fund_sum_receipt,
            categories_id,
            actionId,
            createFor 
        } = req.body;
        
        const { id, roleId } = req.user;

        if (!isNullOrEmpty(createFor) && roleId !== roleType.financialUser) {
            return res.status(400).json({ message: "ไม่มีสิทธิ์สร้างให้คนอื่นได้" });
        }
        if (!isNullOrEmpty(createFor) && actionId == status.draft) {
            return res.status(400).json({ message: "กรณีเบิกให้ผู้อื่น ไม่สามารถบันทึกฉบับร่างได้" });
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
        let childFundEligible = 0;
        let childFundSumRequest = 0;
        if (!isNullOrEmpty(req.body.childrenInfomation)) {

            childFundReceipt = req.body.childrenInfomation.reduce((sum, child) => {
                let childReceipt = parseFloat(child.fund_receipt);
                    return sum + (isNaN(childReceipt) ? 0 : childReceipt);
            }, 0);

            childFundEligible = req.body.childrenInfomation.reduce((sum, child) => {
                let childEligible = parseFloat(child.fund_eligible);
                    return sum + (isNaN(childEligible) ? 0 : childEligible);
            }, 0);

            childFundSumRequest = req.body.childrenInfomation.reduce((sum, child) => {
                let childSumRequest = parseFloat(child.fund_sum_request);
                    return sum + (isNaN(childSumRequest) ? 0 : childSumRequest);
            }, 0);
        }

        // ป้องกัน NaN
        const safeParseFloat = (value) => isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        const dataBinding = {
            reim_number: reimNumber,
            fund_receipt: safeParseFloat(req.body.fund_receipt) + childFundReceipt, // รวมค่าของบุตร
            fund_eligible: safeParseFloat(req.body.fund_eligible) + childFundEligible,
            fund_sum_request: safeParseFloat(req.body.fund_sum_request) + childFundSumRequest,
            fund_sum_receipt: fund_sum_receipt,
            fund_university: fund_university,
            fund_other: fund_other,
            status: actionId,
            spouse: spouse,
            marry_regis: marry_regis,
            role: role,
            position: position,
            department: department,
            request_date: actionId === status.waitApprove ? new Date() : null,
            created_by: req.body.created_by ?? id,
            updated_by: id,
            categories_id: categories_id,
            childrenInfomation: req.body.childrenInfomation,
        };

        if (isNullOrEmpty(req.body.childrenInfomation)) {
            delete dataBinding.child;
        } else {
            var hasNull = false;
            if (!isNullOrEmpty(dataBinding.child)) {
                hasNull = req.body.childrenInfomation.some(item =>
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
        console.error("🚨 Error in bindCreate:", error);  // Log error
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const bindUpdate = async (req, res, next) => {
    try {
        const {
            spouse,
            marry_regis,
            role,
            position,
            department,
            fund_university,
            fund_other,
            fund_sum_receipt,
            categories_id,
            actionId,
            createFor 
        } = req.body;
        
        const { id, roleId } = req.user;
        if (!isNullOrEmpty(createFor) && roleId !== roleType.financialUser) {
            return res.status(400).json({
                message: "ไม่มีสิทธ์แก้ไขให้คนอื่นได้",
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
                    message: "ไม่มีสิทธ์แก้ไขให้คนอื่นได้",
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
        let childFundEligible = 0;
        let childFundSumRequest = 0;
        if (!isNullOrEmpty(req.body.childrenInfomation)) {

            childFundReceipt = req.body.childrenInfomation.reduce((sum, child) => {
                let childReceipt = parseFloat(child.fund_receipt);
                    return sum + (isNaN(childReceipt) ? 0 : childReceipt);
            }, 0);

            childFundEligible = req.body.childrenInfomation.reduce((sum, child) => {
                let childEligible = parseFloat(child.fund_eligible);
                    return sum + (isNaN(childEligible) ? 0 : childEligible);
            }, 0);

            childFundSumRequest = req.body.childrenInfomation.reduce((sum, child) => {
                let childSumRequest = parseFloat(child.fund_sum_request);
                    return sum + (isNaN(childSumRequest) ? 0 : childSumRequest);
            }, 0);
        }

        // ป้องกัน NaN
        const safeParseFloat = (value) => isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        const dataBinding = {
            fund_receipt: safeParseFloat(req.body.fund_receipt) + childFundReceipt, // รวมค่าของบุตร
            fund_eligible: safeParseFloat(req.body.fund_eligible) + childFundEligible,
            fund_sum_request: safeParseFloat(req.body.fund_sum_request) + childFundSumRequest,
            fund_sum_receipt: fund_sum_receipt,
            fund_university: fund_university,
            fund_other: fund_other,
            status: actionId,
            spouse: spouse,
            marry_regis: marry_regis,
            role: role,
            position: position,
            department: department,
            request_date: actionId === statusText.waitApprove ? new Date() : null,
            updated_by: id,
            categories_id: categories_id,
            deleteChildId : req.body.deleteChild,
            childrenInfomation: req.body.childrenInfomation,
        };
        if (isNullOrEmpty(req.body.childrenInfomation)) {
            console.log("🔴 childrenInfomation is null, deleting child field");
            delete dataBinding.childrenInfomation;
        } else {
            var hasNull = false;
            if (!isNullOrEmpty(dataBinding.childrenInfomation)) {
                hasNull = req.body.childrenInfomation.some(item =>
                    Object.values(item).some(value => value === null || value === "")
                );
            }
            if (hasNull) {
                console.log("🔴 Some child fields are null, deleting child field");
                delete dataBinding.childrenInfomation;
            }
        }

        console.log("🟢 Final payload sent to DB:", req.body);


        req.body = dataBinding;

        next();
    } catch (error) {
        console.error("🚨 Error in bindCreate:", error);  // Log error
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
        const { fundReceipt, fundUniversity, fundEligible, childName, childFatherNum, childMotherNum, schoolName,subCategories, spouse, marryRegis, role, actionId } = req.body;
        const errorObj = {};
        if (isNullOrEmpty(fundReceipt)) {
            errorObj["fundReceipt"] = "กรุณากรอกข้อมูลจำนวนเงินตามใบเสร็จ";
        } else if (isInvalidNumber(fundReceipt)) {
            errorObj["fundReceipt"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
        } else if (fundReceipt <= 0) {
            return res.status(400).json({
                message: "จำนวนเงินตามใบเสร็จน้อยกว่า 0 ไม่ได้",
            });
        }

        if (isInvalidNumber(fundUniversity) && fundUniversity) {
            errorObj["fundUniversity"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
        } else if (fundUniversity <= 0) {
            return res.status(400).json({
                message: "เงินที่เบิกได้ตามประกาศสวัสดิการคณะกรรมการสวัสดิการ มหาวิทยาลัยบูรพาน้อยกว่า 0 ไม่ได้",
            });
        }
        if (isInvalidNumber(fundEligible) && fundEligible) {
            errorObj["fundEligible"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
        } else if (fundEligible <= 0) {
            errorObj["fundEligible"] = "ค่าสิทธิอื่น ๆ น้อยกว่า 0 ไม่ได้";
            return res.status(400).json({
                message: "ค่าสิทธิอื่น ๆ น้อยกว่า 0 ไม่ได้",
            });
        }

        if(isNullOrEmpty(childName)){
            errorObj["childName"] = "กรุณากรอกชื่อบุตร";
        }

        if(isNullOrEmpty(childFatherNum)){
            errorObj["childFatherNum"] = "กรุณากรอกลำดับบุตร";
        } else if (isInvalidNumber(childFatherNum)) {
            errorObj["childFatherNum"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
        } else if (childFatherNum <= 0) {
            return res.status(400).json({
                message: "จำนวนเงินตามใบเสร็จน้อยกว่า 0 ไม่ได้",
            });
        }

        if(isNullOrEmpty(childMotherNum)){
            errorObj["childMotherNum"] = "กรุณากรอกลำดับบุตร";
        } else if (isInvalidNumber(childMotherNum)) {
            errorObj["childMotherNum"] = "ค่าที่กรอกไม่ใช่ตัวเลข";
        } else if (childMotherNum <= 0) {
            return res.status(400).json({
                message: "จำนวนเงินตามใบเสร็จน้อยกว่า 0 ไม่ได้",
            });
        }

        if(isNullOrEmpty(schoolName)){
            errorObj["schoolName"] = "กรุณากรอกชื่อโรงเรียน";
        }else if (!isInvalidNumber(schoolName)) {
            errorObj["childMotherNum"] = "ค่าที่กรอกไม่ใช่ตัวหนังสือ";
        } 

        
        if(isNullOrEmpty(subCategories)){
            errorObj["subCategories"] = "กรุณากรอกระดับชั้นเรียน";
        }

        if(isNullOrEmpty(spouse)){
            errorObj["spouse"] = "กรุณากรอกชื่อคู่สมรส";
        }else if (!isInvalidNumber(spouse)) {
            errorObj["spouse"] = "ค่าที่กรอกไม่ใช่ตัวหนังสือ";
        } 

        if(isNullOrEmpty(marryRegis)){
            errorObj["marryRegis"] = "กรุณาเลือกการจดทะเบียนสมรส";
        }

        if(isNullOrEmpty(role)){
            errorObj["marryRegis"] = "กรุณาเลือกประเภทคู่สมรส";
        }


        // const fundSumRequest = Number(fundReceipt) - Number(fundEligibleSum);
        // if (fundSumRequest <= 0) {
        //     return res.status(400).json({
        //         message: "จำนวนตามใบเสร็จไม่สามารถน้อยกว่าเงินที่ได้รับจากสิทธิอื่น ๆ",
        //     });
        // }
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
            if (fund_sum_request > datas.perTimes) {
                return res.status(400).json({
                    message: "คุณสามารถเบิกได้สูงสุด " + datas.perTimes + " ต่อครั้ง",
                });
            }
            if (fund_sum_request > datas.fundRemaining) {
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








module.exports = {  authPermission,
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
                 };