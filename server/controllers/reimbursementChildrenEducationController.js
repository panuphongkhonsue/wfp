const BaseController = require('./BaseControllers');
const { reimbursementsChildrenEducation, childrenInfomation, subCategories, reimbursementsChildrenEducationHasChildrenInfomation, sequelize, categories } = require('../models/mariadb');
const { initLogger } = require('../logger');
const { isNullOrEmpty } = require('../controllers/utility');
const { Op, fn, col, literal, where } = require("sequelize");
const logger = initLogger('reimbursementChildrenEducationController');
const childType =  require('../enum/childType');
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
        const { sub_categories_id } = req.body;

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
                where: { id: sub_categories_id}
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
                console.log("🚀 Debug:", child);
                if (!isNullOrEmpty(child)) {
                    var childData = child.map((childObj) => ({
                        reimbursements_children_education_id: newReimbursementsChild.id,
                        fund_receipt: childObj.fund_receipt,
                        fund_eligible: childObj.fund_eligible,
                        fund_university : childObj.fund_university,
                        fund_sum_request: (parseFloat(childObj.fund_receipt) || 0) + (parseFloat(childObj.fund_eligible) || 0),
                        child_name: childObj.child_name,
                        child_birth_day: childObj.child_birth_day,
                        child_father_number: childObj.child_father_number,
                        child_mother_number: childObj.child_mother_number,
                        child_type: childObj.childPassedAway ? childType.DELEGATE : childType.COMMON,
                        school_name: childObj.school_name,
                        district: childObj.district,
                        province: childObj.province,
                        sub_categories_id: childObj.sub_categories_id,
                        delegate_name: childObj.childPassedAway ? childObj.delegate_name : null,
                        delegate_number: childObj.childPassedAway ? childObj.delegate_number : null,
                        delegate_birth_day: childObj.childPassedAway ? childObj.delegate_birth_day : null,
                        delegate_death_day: childObj.childPassedAway ? childObj.delegate_death_day : null,
                    }));
    
                    const newItemChild = await childrenInfomation.bulkCreate(childData, {
                        fields: [
                            'reimbursements_children_education_id', 'fund_receipt',
                            'fund_eligible','fund_university', 'fund_sum_request', 'child_name',
                            'child_birth_day', 'child_father_number', 'child_mother_number',
                            'child_type', 'school_name','district', 'province', 'sub_categories_id',
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

        try {


            const result = await sequelize.transaction(async t => {
                // 🔹 อัปเดตตารางหลัก
                const [updated] = await reimbursementsChildrenEducation.update(dataUpdate, {
                    where: { id: dataId },
                    transaction: t,
                });
                console.log("🔍 Update result:", updated);

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
                // 🔹 อัปเดตข้อมูลเด็ก
                if (!isNullOrEmpty(child)) {
                    var childData = child.map((childObj) => ({
                        reimbursements_children_education_id: newReimbursementsChild.id,
                        fund_receipt: childObj.fund_receipt,
                        fund_eligible: childObj.fund_eligible,
                        fund_university : childObj.fund_university,
                        fund_sum_request: (parseFloat(childObj.fund_receipt) || 0) + (parseFloat(childObj.fund_eligible) || 0),
                        child_name: childObj.child_name,
                        child_birth_day: childObj.child_birth_day,
                        child_father_number: childObj.child_father_number,
                        child_mother_number: childObj.child_mother_number,
                        child_type: childObj.child_type,
                        school_name: childObj.school_name,
                        district: childObj.district,
                        province: childObj.province,
                        sub_categories_id: childObj.sub_categories_id,
                        delegate_name: childObj.childPassedAway ? childObj.delegate_name : null,
                        delegate_number: childObj.childPassedAway ? childObj.delegate_number : null,
                        delegate_birth_day: childObj.childPassedAway ? childObj.delegate_birth_day : null,
                        delegate_death_day: childObj.childPassedAway ? childObj.delegate_death_day : null,
                    }));

                    const existingChildren = await childrenInfomation.findAll({
                        attributes: ['id', 'child_name'],
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

                    console.log("🚀 Child data before bulkCreate:", JSON.stringify(childData, null, 2));

                    var updateItemChild = await childrenInfomation.bulkCreate(childData, {
                        updateOnDuplicate: ['fund_receipt',
                            'fund_eligible','fund_university', 'fund_sum_request', 'child_name',
                            'child_birth_day', 'child_father_number', 'child_mother_number',
                            'child_type', 'school_name','district', 'province', 'sub_categories_id',
                            'delegate_name', 'delegate_number', 'delegate_birth_day', 'delegate_death_day'],
                        transaction: t,
                        returning: true,
                        individualHooks: true, // ✅ ลองเพิ่มตัวนี้
                    });
                    // Fetch updated child data after bulkCreate
                    const updatedChildren = await childrenInfomation.findAll({
                        attributes: ['id', 'child_name'],
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
                    var hasChildUpdated = JSON.stringify(existingChildren) !== JSON.stringify(updatedChildren);

                    // 🔹 อัปเดตตารางสัมพันธ์
                    const childrenInfoData = updateItemChild.map((childItem) => ({
                        reimbursements_children_education_id: dataId,
                        children_infomation_id: childItem.id
                    }));

                    console.log("🔍 Children Info Data for bulkCreate:", JSON.stringify(childrenInfoData, null, 2));

                    await reimbursementsChildrenEducationHasChildrenInfomation.bulkCreate(childrenInfoData, {
                        updateOnDuplicate: ['reimbursements_children_education_id', "children_infomation_id"],
                        transaction: t,
                    });


                }



                if (updated > 0 || hasChildUpdated || deleteItemSub || deleteItemChild) {
                    itemsReturned = {
                        ...updated,
                        child: updateItemChild,
                        delete: deleteItemSub,
                        deleteChild: deleteItemChild,
                    };
                }
                else {
                    itemsReturned = null;
                }
                return itemsReturned;

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
            console.error("❌ Error in bulkCreate:", error);
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
                    'spouse',
                    'marry_regis',
                    'role',
                    'position',
                    'department',
                ],
                include: [
                    {
                        model: categories, as: 'category',
                        attributes: ['id', 'name']
                    },
                ],
            });
            const childrenData = await childrenInfomation.findAll({
                attributes: [
                    'id',
                    'fund_receipt',
                    'fund_eligible',
                    'fund_sum_request',
                    'child_name',
                    'child_birth_day',
                    'child_father_number',
                    'child_mother_number',
                    'school_name',
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
            console.log("id child : " + childIdList)

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
