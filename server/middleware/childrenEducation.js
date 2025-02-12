const { permissionsHasRoles, childrenInfomation, subCategories,reimbursementsChildrenEducationHasChildrenInfomation,reimbursementsChildrenEducation} = require('../models/mariadb')
const { isNullOrEmpty, getFiscalYear, getYear2Digits, formatNumber, isInvalidNumber } = require('../middleware/utility');
const permissionType = require('../enum/permission')
const { Op, literal } = require("sequelize");
const { initLogger } = require('../logger');
const logger = initLogger('ChildrenEducationValidator');
const roleType = require('../enum/role')
const status = require('../enum/status')
const welfareType = require('../enum/welfareType');
const category = require('../enum/category');


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
            console.log("🚀 ~ datas:", datas); // ตรวจสอบค่าที่ได้

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
        console.log("🟢 Request Body:", req.body);  // Log request body
        console.log("🟢 User Info:", req.user);     // Log user details

        const {
            spouse,
            marry_regis,
            role,
            position,
            department,
            fund_receipt,
            fund_sum_request,
            fund_eligible,
            fund_university,
            fund_other,
            fund_sum_receipt,
            categories_id,
            status,
            child,
            createFor 
        } = req.body;
        
        const { id, roleId } = req.user;

        if (!isNullOrEmpty(createFor) && roleId !== roleType.financialUser) {
            console.log("🔴 ไม่มีสิทธิ์สร้างให้คนอื่น");
            return res.status(400).json({ message: "ไม่มีสิทธิ์สร้างให้คนอื่นได้" });
        }
        if (!isNullOrEmpty(createFor) && actionId == status.draft) {
            console.log("🔴 ไม่สามารถบันทึกฉบับร่างได้");
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
            console.log("🟢 Generated reimNumber:", reimNumber);
        }

const dataBinding = {
    reim_number: reimNumber,
    fund_receipt: fund_receipt,
    fund_eligible: fund_eligible,
    fund_sum_request: fund_sum_request,
    fund_sum_receipt: fund_sum_receipt,
    fund_university: fund_university,
    fund_other: fund_other,
    status: status,
    spouse: spouse,
    marry_regis: marry_regis,
    role: role,
    position: position,
    department: department,
    request_date: status === "รอตรวจสอบ" ? new Date() : null,
    created_by: req.body.created_by ?? id,
    updated_by: id,
    categories_id: categories_id,
    child: child
};


        console.log("🟢 Initial dataBinding:", dataBinding);

        if (isNullOrEmpty(req.body.childrenInfomation)) {
            console.log("🔴 childrenInfomation is null, deleting child field");
            delete dataBinding.child;
        } else {
            var hasNull = false;
            if (!isNullOrEmpty(dataBinding.child)) {
                hasNull = req.body.childrenInfomation.some(item =>
                    Object.values(item).some(value => value === null || value === "")
                );
            }
            if (hasNull) {
                console.log("🔴 Some child fields are null, deleting child field");
                delete dataBinding.child;
            }
        }

        console.log("🟢 Final dataBinding:", dataBinding);

        req.body = dataBinding;
        console.log("🟢 Final dataBinding:", JSON.stringify(dataBinding, null, 2));

        next();
    } catch (error) {
        console.error("🚨 Error in bindCreate:", error);  // Log error
        res.status(500).json({ message: 'Internal Server Error' });
    }
};






module.exports = { authPermission, bindFilter, getRemaining, checkRemaining, bindCreate };