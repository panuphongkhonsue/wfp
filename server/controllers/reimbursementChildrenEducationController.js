const BaseController = require('./BaseControllers');
const { reimbursementsChildrenEducation,users,positions, sector, employeeTypes, departments, childrenInfomation, subCategories, reimbursementsChildrenEducationHasChildrenInfomation, sequelize, categories } = require('../models/mariadb');
const { initLogger } = require('../logger');
const { isNullOrEmpty } = require('../controllers/utility');
const { Op, fn, col, literal, where } = require("sequelize");
const logger = initLogger('reimbursementChildrenEducationController');
const childType = require('../enum/childType');
const sub_categories = require('../models/mariadb/sub_categories');

class Controller extends BaseController {
    constructor() {
        super(reimbursementsChildrenEducation);
    }

    list = async (req, res, next) => {
        const method = 'GetAllReimbursementsChildrenEducation'
        const { userId } = req.user;
        try {
            const { filter, page, itemPerPage } = req.query;
            var whereObj = { ...filter }
            const reimbursChildEdiDataList = await reimbursementsChildrenEducation.paginate({
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
                page: page && !isNaN(page) ? Number(page) : 1,
                paginate: itemPerPage && !isNaN(itemPerPage) ? Number(itemPerPage) : 10,
                where: whereObj,
                order: [['updated_at', 'DESC'], ['created_at', 'DESC']]
            });

            if (reimbursChildEdiDataList) {
                var reimbursChildEdiList = {};
                reimbursChildEdiList.pagination = {
                    page: page && !isNaN(page) ? Number(page) : 1,
                    total: reimbursChildEdiDataList.total
                }
                reimbursChildEdiList.datas = reimbursChildEdiDataList.docs
                logger.info('Complete', { method, data: { userId } });
                res.status(200).json(reimbursChildEdiList);

            }

        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);

        }
    }



    getRemainingChildFund = async (req, res, next) => {
        const method = 'getChildFundSummary';
        const userId = req.user?.id;
        const { subCategoriesId } = req.body;

        try {
            const { filter } = req.query;
            var whereObj = { ...filter };

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
                group: [
                    "childrenInfomation.child_name",
                    "sub_category.id"
                ]
            });

            if (results) {
                const datas = JSON.parse(JSON.stringify(results));

                // Loop ผ่าน array datas
                datas.forEach(data => {
                    if (data.fundRemaining === 0 || data.requestsRemaining === 0) {
                        data.canRequest = false;
                    } else {
                        data.canRequest = true;
                    }
                });

                logger.info('Complete', { method, data: { userId } });
                return res.status(200).json({
                    datas: datas,
                    canRequest: datas.some(data => data.canRequest) // ถ้ามีอย่างน้อย 1 อันที่ true ให้ return true
                });
            };

            const getFund = await subCategories.findAll({
                attributes: [
                    [col("fund"), "fundRemaining"],
                    [col("per_years"), "requestsRemaining"],
                    [col("per_times"), "perTimesRemaining"],
                ],
                where: { id: subCategoriesId }
            })

            if (getFund) {
                const datas = JSON.parse(JSON.stringify(getFund));
                logger.info('Complete', { method, data: { userId } });
                return res.status(200).json({
                    datas: datas,
                    canRequest: datas.canRequest ?? true,
                });
            }

            logger.info('Data not Found', { method, data: { userId } });
            res.status(400).json({
                message: "ไม่พบข้อมูลที่ต้องการ กรุณาลองอีกครั้ง"
            });
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    };

    create = async (req, res, next) => {
        const method = 'CreateReimbursementsChildrenEducation';
        const { id } = req.user;
        const child = req.body.child ?? null;
        delete req.body.child
        const dataCreate = req.body;
        dataCreate.fund_receipt = isNaN(dataCreate.fund_receipt) ? 0 : parseFloat(dataCreate.fund_receipt);

        try {
            const results = await sequelize.transaction(async t => {
                const newReimbursementsChild = await reimbursementsChildrenEducation.create(dataCreate, { transaction: t });
                if (!isNullOrEmpty(child)) {
                    var childData = child.map((childObj) => {
                        let data = {
                            reimbursements_children_education_id: newReimbursementsChild.id,
                            fund_receipt: Number(childObj.fundReceipt),
                            fund_eligible: Number(childObj.fundEligible),
                            fund_other: Number(childObj.fundOther),
                            fund_university: Number(childObj.fundUniversity),
                            fund_sum_request: (Number(childObj.fundUniversity) || 0) - (Number(childObj.fundOther) || 0),
                            child_name: childObj.childName,
                            child_birth_day: childObj.childBirthDay,
                            child_father_number: childObj.childFatherNumber,
                            child_mother_number: childObj.childMotherNumber,
                            child_type: childObj.childPassedAway ? childType.DELEGATE : childType.COMMON,
                            school_name: childObj.schoolName,
                            district: childObj.district,
                            province: childObj.province,
                            sub_categories_id: childObj.subCategoriesId,
                        };

                        // ถ้า childPassedAway เป็น true ให้เพิ่ม delegate_xxx
                        if (childObj.childPassedAway) {
                            data.delegate_name = childObj.delegateName ?? null;
                            data.delegate_number = childObj.delegateNumber ?? null;
                            data.delegate_birth_day = childObj.delegateBirthDay ?? null;
                            data.delegate_death_day = childObj.delegateDeathDay ?? null;
                        }

                        return data;
                    });


                    const newItemChild = await childrenInfomation.bulkCreate(childData, {
                        fields: [
                            'reimbursements_children_education_id', 'fund_receipt', 'fund_other',
                            'fund_eligible', 'fund_university', 'fund_sum_request', 'child_name',
                            'child_birth_day', 'child_father_number', 'child_mother_number',
                            'child_type', 'school_name', 'district', 'province', 'sub_categories_id',
                            'delegate_name', 'delegate_number', 'delegate_birth_day', 'delegate_death_day' // ✅ บันทึกเฉพาะค่า delegate
                        ],
                        transaction: t,
                    });

                    var itemsReturned = {
                        ...newReimbursementsChild.toJSON(),
                        child: newItemChild,
                    };

                    var childrenInfoData = newItemChild.map((childItem) => ({
                        reimbursements_children_education_id: newReimbursementsChild.id,
                        children_infomation_id: childItem.id
                    }));

                    await reimbursementsChildrenEducationHasChildrenInfomation.bulkCreate(childrenInfoData, {
                        fields: ['reimbursements_children_education_id', "children_infomation_id"],
                        transaction: t,
                    });
                }

                if (!isNullOrEmpty(child)) return itemsReturned;
                return newReimbursementsChild;
            });

            res.status(201).json({ newItem: results, message: "บันทึกข้อมูลสำเร็จ" });
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { id },
            });
            next(error);
        }
    };



    update = async (req, res, next) => {
        const method = 'UpdateReimbursementsChildrenEducation';
        const { id } = req.user;
        const dataId = req.params['id'];
        const deletedChild = req.deleteChild ?? null;
        const child = req.body.child ?? null;
        delete req.body.child;
        const dataUpdate = req.body;
        var itemsReturned = null;
        dataUpdate.fund_receipt = isNaN(dataUpdate.fund_receipt) ? 0 : parseFloat(dataUpdate.fund_receipt);
        dataUpdate.fund_eligible = isNaN(dataUpdate.fund_eligible) ? 0 : parseFloat(dataUpdate.fund_eligible);

        try {
            const result = await sequelize.transaction(async t => {

                const [updated] = await reimbursementsChildrenEducation.update(dataUpdate, {
                    where: { id: dataId },
                    transaction: t,
                });


                if (updated === 0 && isNullOrEmpty(child)) {
                    return { updated: false };
                }

                if (!isNullOrEmpty(deletedChild)) {
                    const idsToDelete = deletedChild.map(child => child.id);

                    var childIds = await reimbursementsChildrenEducationHasChildrenInfomation.findAll({
                        attributes: ['children_infomation_id'],
                        where: {
                            reimbursements_children_education_id: dataId,
                            children_infomation_id: idsToDelete
                        },
                        raw: true
                    });
                    const childIdArray = childIds.map(item => item.children_infomation_id);

                    var deleteItemSub = await reimbursementsChildrenEducationHasChildrenInfomation.destroy(
                        {
                            where: { reimbursements_children_education_id: dataId, children_infomation_id: childIdArray },
                            transaction: t,
                        }
                    );

                    var deleteItemChild = await childrenInfomation.destroy(
                        {
                            where: { id: childIdArray },
                            transaction: t,
                        }
                    );
                }

                if (!isNullOrEmpty(child)) {
                    var childData = child.map((childObj) => {
                        let data = {
                            id: childObj.id,
                            fund_receipt: Number(childObj.fundReceipt) || 0,
                            fund_eligible: Number(childObj.fundEligible) || 0,
                            fund_other: Number(childObj.fundOther) || 0,
                            fund_university: Number(childObj.fundUniversity) || 0,
                            fund_sum_request: (Number(childObj.fundUniversity) || 0) - (Number(childObj.fundOther) || 0),
                            child_name: childObj.childName,
                            child_birth_day: childObj.childBirthDay,
                            child_father_number: childObj.childFatherNumber,
                            child_mother_number: childObj.childMotherNumber,
                            child_type: childObj.childPassedAway ? childType.DELEGATE : childType.COMMON,
                            school_name: childObj.schoolName,
                            district: childObj.district,
                            province: childObj.province,
                            sub_categories_id: childObj.subCategoriesId,
                        };

                        if (childObj.childPassedAway) {
                            data.delegate_name = childObj.delegateName ?? null;
                            data.delegate_number = childObj.delegateNumber ?? null;
                            data.delegate_birth_day = childObj.delegateBirthDay ?? null;
                            data.delegate_death_day = childObj.delegateDeathDay ?? null;
                        }

                        return data;
                    });

                    const existingChildren = await childrenInfomation.findAll({
                        attributes: ['id', 'fund_receipt', 'fund_other',
                            'fund_eligible', 'fund_university', 'fund_sum_request', 'child_name',
                            'child_birth_day', 'child_father_number', 'child_mother_number',
                            'child_type', 'school_name', 'district', 'province', 'sub_categories_id',
                            'delegate_name', 'delegate_number', 'delegate_birth_day', 'delegate_death_day'],
                        include: [
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
                                        where: { created_by: id }
                                    }
                                ]
                            }
                        ],
                        raw: true,
                    });

                    const updatedChildren = await childrenInfomation.bulkCreate(childData, {
                        updateOnDuplicate: ['fund_receipt', 'fund_other',
                            'fund_eligible', 'fund_university', 'fund_sum_request', 'child_name',
                            'child_birth_day', 'child_father_number', 'child_mother_number',
                            'child_type', 'school_name', 'district', 'province', 'sub_categories_id',
                            'delegate_name', 'delegate_number', 'delegate_birth_day', 'delegate_death_day'],
                        transaction: t,
                        returning: true,
                        individualHooks: true,
                    });

                    // Check if there are any updates on the children data
                    const hasChildUpdated = existingChildren.some((existingChild, index) => {
                        const updatedChild = updatedChildren[index];
                        return (
                            existingChild.fund_receipt !== updatedChild.fund_receipt ||
                            existingChild.fund_eligible !== updatedChild.fund_eligible ||
                            existingChild.child_name !== updatedChild.child_name ||
                            existingChild.child_birth_day !== updatedChild.child_birth_day ||
                            existingChild.school_name !== updatedChild.school_name ||
                            existingChild.delegate_name !== updatedChild.delegate_name
                        );
                    });

                    // 🔹 Update relationship table
                    const childrenInfoData = updatedChildren.map((childItem) => ({
                        reimbursements_children_education_id: dataId,
                        children_infomation_id: childItem.id
                    }));

                    await reimbursementsChildrenEducationHasChildrenInfomation.bulkCreate(childrenInfoData, {
                        updateOnDuplicate: ['reimbursements_children_education_id', "children_infomation_id"],
                        transaction: t,
                    });

                    if (updated > 0 || hasChildUpdated || deleteItemChild || deleteItemSub) {
                        itemsReturned = {
                            ...updated,
                            child: updatedChildren,
                            delete: deleteItemSub,
                            deleteChild: deleteItemChild,
                        };
                    } else {
                        itemsReturned = null;
                    }
                    return itemsReturned;
                }

            });

            if (result) {
                logger.info('Complete', { method, data: { id } });
                return res.status(201).json({ newItem: result, message: "บันทึกข้อมูลสำเร็จ" });
            }

            res.status(400).json({ message: "ไม่มีข้อมูลที่ถูกแก้ไข" });
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { id },
            });
            next(error);
        }
    };

    getLatestSchoolByChildName = async (req, res, next) => {
        const method = "GetLatestSchoolByChildId";
        const { id } = req.user;
        try {
            // ดึงข้อมูลล่าสุดจาก reimbursementsChildrenEducation
            const latestEducation = await reimbursementsChildrenEducation.findOne({
                attributes: ['id'],
                where: {
                    created_by: id
                },
                order: [["updated_at", "DESC"]], // เรียงลำดับตาม updated_at
                limit: 1, // จำกัดแค่รายการเดียว
            });
            console.log("Latest Education ID: ", latestEducation.id);
    
            // ตรวจสอบว่าได้รับข้อมูลจาก reimbursementsChildrenEducation หรือไม่
            if (!latestEducation) {
                return res.status(404).json({ message: "ไม่พบข้อมูลการเบิกค่าศึกษาของบุตรล่าสุด" });
            }
    
            // ดึงข้อมูลล่าสุดของบุตร
            const childData = await childrenInfomation.findAll({
                attributes: [
                    'id',
                    [col('child_name'), "childName"],
                    [col('school_name'), "schoolName"],
                ],
                include: [
                    {
                        model: reimbursementsChildrenEducationHasChildrenInfomation,
                        as: "reimbursements_children_education_has_children_infomations",
                        required: true,
                        where: { reimbursements_children_education_id: latestEducation.id },
                    }
                ],
            });
    
            console.log("childData: ", childData);
    
            // ตรวจสอบว่ามีข้อมูลหรือไม่
            if (childData && childData.length > 0) {
                // สร้างอาร์เรย์เพื่อเก็บข้อมูลโรงเรียนของบุตรทั้งหมด
                const ChildInformation = childData.map(child => child.dataValues);
    
                console.log("ChildInformation: ", ChildInformation);
    
                res.status(200).json({ ChildInformation });
            } else {
                res.status(404).json({ ChildInformation: "ไม่พบข้อมูลโรงเรียนของบุตร" });
            }
    
        } catch (error) {
            console.error(`Error: ${error.message}`, { method });
            next(error);
        }
    };
    



    getById = async (req, res, next) => {
        const method = 'GetReimbursementsChildrenEducationbyId';
        const { id } = req.user;
        const dataId = req.params['id'];

        try {
            const { filter } = req.query;
            var whereObj = { ...filter };
            const ChildrenEducationData = await reimbursementsChildrenEducation.findOne({
                where: whereObj,
                attributes: [
                    'id',
                    [col('reim_number'), "reimNumber"],
                    [col('marry_regis'), "marryRegis"],
                    [col('request_date'), "requestDate"],
                    'eligible',
                    'spouse',
                    'status',
                    'role',
                    'position',
                    'department',
                    [col("created_by_user.id"), "userId"],
                    [col("created_by_user.name"), "name"],
                    [col("created_by_user.position.name"), "positionUser"],
                    [col("created_by_user.employee_type.name"), "employeeType"],
                    [col("created_by_user.sector.name"), "sector"],
                    [col("created_by_user.department.name"), "departmentUser"],

                ],
                include: [
                    {
                        model: categories, as: 'category',
                        attributes: ['id', 'name']
                    },
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
            });
            const childrenData = await childrenInfomation.findAll({
                attributes: [
                    'id',
                    [col('childrenInfomation.fund_receipt'), "fundReceipt"],
                    [col('childrenInfomation.fund_other'), "fundOther"],
                    [col('childrenInfomation.fund_sum_request'), "fundSumRequest"],
                    [col('childrenInfomation.child_name'), "childName"],
                    [col('childrenInfomation.child_type'), "childType"],
                    [col('childrenInfomation.child_birth_day'), "childBirthDay"],
                    [col('childrenInfomation.fund_university'), "fundUniversity"],
                    [col('childrenInfomation.child_father_number'), "childFatherNumber"],
                    [col('childrenInfomation.child_mother_number'), "childMotherNumber"],
                    [col('childrenInfomation.child_type'), "childType"],
                    [col('childrenInfomation.school_name'), "schoolName"],
                    [col('delegate_name'), "delegateName"],
                    [col('delegate_number'), "delegateNumber"],
                    [col('delegate_birth_day'), "delegateBirthDay"],
                    [col('delegate_death_day'), "delegateDeathDay"],
                    'district',
                    'province',
                ],
                include: [
                    {
                        model: subCategories,
                        as: "sub_category",
                        attributes: ['id', 'name']
                    },
                    {
                        model: reimbursementsChildrenEducationHasChildrenInfomation,
                        as: "reimbursements_children_education_has_children_infomations",
                        required: true,
                        attributes: [],
                        where: { reimbursements_children_education_id: dataId },
                        include: [
                            {
                                model: reimbursementsChildrenEducation,
                                as: "reimbursements_children_education",
                                required: true,
                                attributes: [],
                                where: {
                                    created_by: id
                                }
                            }
                        ]
                    }
                ],
            });
            if (ChildrenEducationData) {
                const datas = JSON.parse(JSON.stringify(ChildrenEducationData));
                var reimChildrenEducation = {};
                reimChildrenEducation.datas = {
                    ...datas,
                    user: {
                        userId: datas.userId,
                        name: datas.name,
                        position: datas.position,
                        employeeType: datas.employeeType,
                        sector: datas.sector,
                        department: datas.department,
                    },
                    children: childrenData,
                };
                logger.info('Complete', { method, data: { id } });
                res.status(200).json(reimChildrenEducation);
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

    getByCategories = async (req, res, next) => {
        const method = 'getSubCategories';
        const { id } = req.user;
        const { categories_id } = req.query;
        try {
            const subCategoriesData = await subCategories.findAll({
                attributes: ['id', 'name'],
                where: { categories_id: categories_id }
            });

            if (subCategoriesData && subCategoriesData.length > 0) {
                logger.info('Complete', { method, data: { id } });
                res.status(200).json(subCategoriesData);
            } else {
                logger.info('No data found', { method, data: { id } });
                res.status(404).json({ message: 'No subcategories found' });
            }
        } catch (error) {
            logger.error('Error occurred', { method, error: error.message });
            res.status(500).json({ message: 'Internal server error' });
            next(error);
        }
    };


    deleteReimbursement = async (req, res, next) => {
        const method = 'DeleteReimbursementsChildrenEducation';
        const { id } = req.user;
        const reimbursementId = req.params['id'];

        try {
            // 1️⃣ ดึงรายการบุตรที่อยู่ในใบเบิกนี้
            const childIds = await reimbursementsChildrenEducationHasChildrenInfomation.findAll({
                attributes: ['children_infomation_id'],
                where: { reimbursements_children_education_id: reimbursementId },
                raw: true
            });

            const childIdList = childIds.map(item => item.children_infomation_id);

            // 2️⃣ ลบข้อมูลจากตารางกลาง (Unlink children from reimbursement)
            await reimbursementsChildrenEducationHasChildrenInfomation.destroy({
                where: { reimbursements_children_education_id: reimbursementId }
            });

            // 3️⃣ ลบ childrenInfomation ที่ไม่มีการเชื่อมกับใบเบิกอื่นๆ
            await childrenInfomation.destroy({
                where: {
                    id: childIdList,
                }
            });

            // 4️⃣ ลบใบเบิก
            const deleted = await reimbursementsChildrenEducation.destroy({
                where: { id: reimbursementId }
            });

            if (deleted) {
                logger.info('Deleted Successfully', { method, data: { id, reimbursementId } });
                res.status(200).json({ message: "ลบใบเบิกสำเร็จ" });
            } else {
                logger.info('Data not found', { method, data: { id, reimbursementId } });
                res.status(404).json({ message: "ไม่พบข้อมูลใบเบิก" });
            }
        } catch (error) {
            logger.error(`Error ${error.message}`, { method, data: { id } });
            next(error);
        }
    };















}
module.exports = new Controller();
