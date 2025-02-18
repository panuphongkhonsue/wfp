const BaseController = require('./BaseControllers');
const { reimbursementsAssist, categories, subCategories, reimbursementsAssistHasSubCategories, users, positions, sector, employeeTypes, departments, sequelize } = require('../models/mariadb');
const { Op, fn, col, literal } = require("sequelize");
const { initLogger } = require('../logger');
const category = require('../enum/category');
const logger = initLogger('variousWelfareFuneralFamilyController');
const { getFiscalYearDynamic, getFiscalYear } = require('../middleware/utility');
const { isNullOrEmpty } = require('./utility');

class Controller extends BaseController {
    constructor() {
        super(reimbursementsAssist);
    }

    list = async (req, res, next) => {
        const method = 'GetListvariousWelfareFuneralFamily';
        const { id } = req.user;
        try {
            const { filter, page, itemPerPage } = req.query;
            var whereObj = { ...filter }
            const listData = await reimbursementsAssist.paginate({
                attributes: [
                    'id',
                    [col("reim_number"), "reimNumber"],
                    [col("request_date"), "requestDate"],
                    [col("updated_at"), "updatedAt"],
                    [col("fund_sum_receipt"), "fundSumReceipt"],
                    [col("fund_sum_request"), "fundSumRequest"],
                    'status',
                ],
                where: whereObj,
                order: [['updated_at', 'DESC'], ['created_at', 'DESC']],
                limit: itemPerPage,
                offset: (page - 1) * itemPerPage
            });

            if (listData) {
                var bindList = {};
                bindList.pagination = {
                    page: page && !isNaN(page) ? Number(page) : 1,
                    total: listData.total
                }
                bindList.datas = listData.docs.map((listObj) => {
                    const plainObj = listObj.toJSON();
                    return {
                        ...plainObj,
                    }
                });
                logger.info('Complete', { method, data: { id } });
                res.status(200).json(bindList);
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
    getRemaining = async (req, res, next) => {
        const method = 'GetRemainingvariousWelfareFuneralFamily';
        const { id } = req.user;
        try {
            const { filter } = req.query;
            var whereObj = { ...filter }
            whereObj[Op.and].push(
                { '$sub_category.id$': { [Op.in]: [3, 4, 5, 6] } }
            );
            const decreaseRemaining = await reimbursementsAssistHasSubCategories.findAll({
                attributes: [
                    [col("sub_category.id"), "subCategoriesId"],
                    [col("sub_category.name"), "subCategoriesName"],
                    [fn("SUM", col("reimbursements_assist.fund_decease")), "totalSumRequested"],
                    [col("sub_category.fund"), "fund"],
                    [
                        literal("sub_category.fund - SUM(reimbursements_assist.fund_decease)"),
                        "fundRemaining"
                    ],
                    [fn("COUNT", col("reimbursements_assist.fund_decease")), "totalCountRequested"],
                    [col("sub_category.per_years"), "perYears"],
                    [
                        literal("sub_category.per_years - COUNT(reimbursements_assist.fund_decease)"),
                        "requestsRemaining"
                    ],
                    [col("sub_category.per_times"), "perTimesRemaining"],
                ],
                include: [
                    {
                        model: subCategories,
                        as: "sub_category",
                        attributes: []
                    },
                    {
                        model: reimbursementsAssist,
                        as: "reimbursements_assist",
                        attributes: []
                    }
                ],
                where: whereObj,
                group: ["sub_category.id"],
            });
            whereObj[Op.and].push(
                { '$sub_category.id$': { [Op.in]: [7, 8] } }
            );
            const wreathRemaining = await reimbursementsAssistHasSubCategories.findAll({
                attributes: [
                    [col("sub_category.id"), "subCategoriesId"],
                    [col("sub_category.name"), "subCategoriesName"],
                    [col("sub_category.fund"), "fund"],
                    [col("sub_category.per_years"), "perYears"],
                    [col("sub_category.per_times"), "perTimesRemaining"],

                    // fund_wreath_arrange
                    [
                        fn("SUM", literal("CASE WHEN sub_category.id = 7 THEN reimbursements_assist.fund_wreath_arrange ELSE 0 END")),
                        "totalSumRequestedArrange"
                    ],
                    [
                        fn("SUM", literal("CASE WHEN sub_category.id = 7 THEN reimbursements_assist.fund_wreath_arrange ELSE 0 END")),
                        "fundRemainingArrange"
                    ],
                    [
                        fn("COUNT", literal("CASE WHEN sub_category.id = 7 THEN reimbursements_assist.fund_wreath_arrange ELSE NULL END")),
                        "totalCountRequestedArrange"
                    ],
                    [
                        fn("sub_category.per_years - COUNT", literal("CASE WHEN sub_category.id = 7 THEN reimbursements_assist.fund_wreath_arrange ELSE NULL END")),
                        "requestsRemainingArrange"
                    ],

                    // fund_wreath_university
                    [
                        fn("SUM", literal("CASE WHEN sub_category.id = 8 THEN reimbursements_assist.fund_wreath_university ELSE 0 END")),
                        "totalSumRequestedUniversity"
                    ],
                    [
                        fn("SUM", literal("CASE WHEN sub_category.id = 8 THEN reimbursements_assist.fund_wreath_university ELSE 0 END")),
                        "fundRemainingUniversity"
                    ],
                    [
                        fn("COUNT", literal("CASE WHEN sub_category.id = 8 THEN reimbursements_assist.fund_wreath_university ELSE NULL END")),
                        "totalCountRequestedUniversity"
                    ],
                    [
                        fn("sub_category.per_years - COUNT", literal("CASE WHEN sub_category.id = 8 THEN reimbursements_assist.fund_wreath_university ELSE NULL END")),
                        "requestsRemainingUniversity"
                    ],
                ],
                include: [
                    {
                        model: subCategories,
                        as: "sub_category",
                        attributes: []
                    },
                    {
                        model: reimbursementsAssist,
                        as: "reimbursements_assist",
                        attributes: []
                    }
                ],
                where: whereObj,
                group: ["sub_category.id"],
            });
            whereObj[Op.and] = whereObj[Op.and].filter(item => [7, 8].includes(item['$sub_category.id$']));
            whereObj[Op.and].push(
                { '$sub_category.id$': 9 }
            );
            const vechicleRemaining = await reimbursementsAssistHasSubCategories.findAll({
                attributes: [
                    [col("sub_category.id"), "subCategoriesId"],
                    [col("sub_category.name"), "subCategoriesName"],
                    [fn("SUM", col("reimbursements_assist.fund_vechicle")), "totalSumRequested"],
                    [col("sub_category.fund"), "fund"],
                    [
                        literal("sub_category.fund - SUM(reimbursements_assist.fund_vechicle)"),
                        "fundRemaining"
                    ],
                    [fn("COUNT", col("reimbursements_assist.fund_vechicle")), "totalCountRequested"],
                    [col("sub_category.per_years"), "perYears"],
                    [
                        literal("sub_category.per_years - COUNT(reimbursements_assist.fund_vechicle)"),
                        "requestsRemaining"
                    ],
                    [col("sub_category.per_times"), "perTimesRemaining"],
                ],
                include: [
                    {
                        model: subCategories,
                        as: "sub_category",
                        attributes: []
                    },
                    {
                        model: reimbursementsAssist,
                        as: "reimbursements_assist",
                        attributes: []
                    }
                ],
                where: whereObj,
                group: ["sub_category.id"],
            });
            if (!isNullOrEmpty(decreaseRemaining) || !isNullOrEmpty(wreathRemaining) || !isNullOrEmpty(vechicleRemaining)) {
                let bindData = [];
                if (!isNullOrEmpty(decreaseRemaining)) {
                    const datas = JSON.parse(JSON.stringify(decreaseRemaining[0]));
                    if (datas.fundRemaining == null) {
                        datas.fundRemaining = datas.fund;
                    }
                    if (datas.requestsRemaining == null) {
                        datas.requestsRemaining = datas.perYears;
                    }
                    if (datas.fundRemaining === 0 || datas.requestsRemaining === 0) datas.canRequest = false;
                    else datas.canRequest = true;
                    bindData.push(datas);
                }
                else {
                    const getFund = await subCategories.findAll({
                        attributes: [
                            [col("id"), "subCategoriesId"],
                            [col("name"), "subCategoriesName"],
                            [col("fund"), "fundRemaining"],
                            [col("per_years"), "requestsRemaining"],
                            [col("per_times"), "perTimesRemaining"],
                        ],
                        where: { id: [3, 4, 5, 6] }
                    });
                    const datas = JSON.parse(JSON.stringify(getFund));
                    datas.forEach(item => {
                        if (item.fundRemaining === 0 || item.requestsRemaining === 0) item.canRequest = false;
                        else item.canRequest = true;
                    });
                    bindData.push(datas);
                }


                if (!isNullOrEmpty(wreathRemaining)) {
                    const datas = JSON.parse(JSON.stringify(wreathRemaining[0]));
                    if (datas.fundRemaining == null) {
                        datas.fundRemaining = datas.fund;
                    }
                    if (datas.requestsRemaining == null) {
                        datas.requestsRemaining = datas.perYears;
                    }
                    if (datas.fundRemaining === 0 || datas.requestsRemaining === 0) datas.canRequest = false;
                    else datas.canRequest = true;
                    bindData.push(datas);
                }
                else {
                    const getFund = await subCategories.findAll({
                        attributes: [
                            [col("id"), "subCategoriesId"],
                            [col("name"), "subCategoriesName"],
                            [col("fund"), "fundRemaining"],
                            [col("per_years"), "requestsRemaining"],
                            [col("per_times"), "perTimesRemaining"],
                        ],
                        where: { id: [7, 8] }
                    })
                    const datas = JSON.parse(JSON.stringify(getFund));
                    datas.forEach(item => {
                        if (item.fundRemaining === 0 || item.requestsRemaining === 0) item.canRequest = false;
                        else item.canRequest = true;
                    });
                    bindData.push(datas);
                }

                if (!isNullOrEmpty(vechicleRemaining)) {
                    const datas = JSON.parse(JSON.stringify(vechicleRemaining[0]));
                    if (datas.fundRemaining == null) {
                        datas.fundRemaining = datas.fund;
                    }
                    if (datas.requestsRemaining == null) {
                        datas.requestsRemaining = datas.perYears;
                    }
                    if (datas.fundRemaining === 0 || datas.requestsRemaining === 0) datas.canRequest = false;
                    else datas.canRequest = true;

                    delete datas.totalSumRequested;
                    delete datas.fund;
                    delete datas.totalCountRequested;
                    delete datas.perYears;
                    bindData.push(datas);
                }
                else {
                    const getFund = await subCategories.findAll({
                        attributes: [
                            [col("id"), "subCategoriesId"],
                            [col("name"), "subCategoriesName"],
                            [col("fund"), "fundRemaining"],
                            [col("per_years"), "requestsRemaining"],
                            [col("per_times"), "perTimesRemaining"],
                        ],
                        where: { id: 9 }
                    })
                    const datas = JSON.parse(JSON.stringify(getFund));
                    datas.canRequest = true;
                    bindData.push(datas);
                }
                logger.info('Complete', { method, data: { id } });
                return res.status(200).json({
                    datas: bindData,
                });
            };
            const getFund = await subCategories.findAll({
                attributes: [
                    [col("id"), "subCategoriesId"],
                    [col("name"), "subCategoriesName"],
                    [col("fund"), "fundRemaining"],
                    [col("per_years"), "requestsRemaining"],
                    [col("per_times"), "perTimesRemaining"],
                ],
                where: {
                    id: {
                        [Op.in]: [3, 4, 5, 6, 7, 8, 9]
                    }
                }
            })
            if (getFund) {
                const datas = JSON.parse(JSON.stringify(getFund));
                datas[0].canRequest = true;
                datas[1].canRequest = true;
                logger.info('Complete', { method, data: { id } });
                return res.status(200).json({
                    datas: datas,
                    canRequest: datas.canRequest ?? true,
                });
            }
            logger.info('Data not Found', { method, data: { id } });
            res.status(200).json({
                message: "มีสิทธ์คงเหลือเท่ากับเพดานเงิน"
            });
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { id },
            });
            next(error);
        }
    };

    getById = async (req, res, next) => {
        const method = 'GetvariousWelfareFuneralFamilybyId';
        const { id } = req.user;
        const dataId = req.params['id'];
        try {
            const { filter } = req.query;
            var whereObj = { ...filter }
            const requestData = await reimbursementsAssist.findByPk(dataId, {
                attributes: [
                    [col("reim_number"), "reimNumber"],
                    [col("fund_receipt"), "fundReceipt"],
                    [col("fund_decease"), "fundDecease"],
                    [col("deceased"), "decease"],
                    [col("deceased_type"), "deceasedType"],
                    [col("fund_receipt_wreath"), "fundReceiptWreath"],
                    [col("fund_wreath_university"), "fundWreathUniversity"],
                    [col("fund_wreath_arrange"), "fundWreathArrange"],
                    [col("fund_receipt_vechicle"), "fundReceiptVechicle"],
                    [col("fund_vechicle"), "fundVechicle"],
                    [col("fund_sum_receipt"), "fundSumReceipt"],
                    [col("fund_sum_request"), "fundSumRequest"],
                    [col("request_date"), "requestDate"],
                    [col("status"), "status"],
                    [col("categories_id"), "categoryId"],
                    [col("created_by_user.id"), "userId"],
                    [col("created_by_user.name"), "name"],
                    [col("created_by_user.position.name"), "position"],
                    [col("created_by_user.employee_type.name"), "employeeType"],
                    [col("created_by_user.sector.name"), "sector"],
                    [col("created_by_user.department.name"), "department"],
                ],
                include: [
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
            if (requestData) {
                const datas = JSON.parse(JSON.stringify(requestData));
                whereObj = {};
                whereObj[Op.and] = [];
                var getFiscalYearWhere;
                if (datas.requestDate) {
                    getFiscalYearWhere = getFiscalYearDynamic(datas.requestDate);
                }
                else {
                    getFiscalYearWhere = getFiscalYear();
                }
                whereObj[Op.and].push(
                    { '$reimbursements_assist.request_date$': getFiscalYearWhere },
                    { '$reimbursements_assist.categories_id$': category.variousFuneralFamily },
                    { '$reimbursements_assist.created_by$': datas.userId },
                    { '$reimbursements_assist.id$': { [Op.lte]: datas.id } },
                    { '$sub_category.id$': { [Op.in]: [7, 8, 9] } },
                );
                const getRequestData = await reimbursementsAssistHasSubCategories.findAll({
                    attributes: [
                        [col("reimbursements_assist.id"), "id"],
                        [col("reimbursements_assist.fund_vechicle"), "fundVecicle"],
                    ],
                    include: [
                        {
                            model: subCategories,
                            as: "sub_category",
                            attributes: []
                        },
                        {
                            model: reimbursementsAssist,
                            as: "reimbursements_assist",
                            attributes: []
                        }
                    ],
                    where: whereObj,
                })
                var welfareData = {
                    ...datas,
                    user: {
                        userId: datas.userId,
                        name: datas.name,
                        position: datas.position,
                        employeeType: datas.employeeType,
                        sector: datas.sector,
                        department: datas.department,
                    },
                    requestData: JSON.parse(JSON.stringify(getRequestData))
                }
                delete welfareData.userId;
                delete welfareData.name;
                delete welfareData.position;
                delete welfareData.employeeType;
                delete welfareData.sector;
                delete welfareData.department;
                logger.info('Complete', { method, data: { id } });
                res.status(200).json({
                    datas: welfareData,
                });
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
    create = async (req, res, next) => {
        const method = 'CreateVariousWelfareFuneralFamily';
        const { id } = req.user;
        const selectedWreath = req.body.selected_wreath ?? false;
        const selectedVechicle = req.body.selected_vechicle ?? false;
        const fundEligible = req.body.fund_eligible ?? 0;
        delete req.body.selected_wreath;
        delete req.body.selected_vechicle;
        const dataCreate = {
            ...req.body,
            fund_eligible: fundEligible
        };
        try {
            const result = await sequelize.transaction(async t => {
                const newItem = await reimbursementsAssist.create(dataCreate, { transaction: t, });
                var itemsReturned = {
                    ...newItem.toJSON(),
                };
                if (selectedWreath) {
                    const newItemSub1 = await reimbursementsAssistHasSubCategories.create(
                        {
                            reimbursements_assist_id: newItem.id,
                            sub_categories_id: 7,
                        },
                        { transaction: t }
                    );
                    const newItemSub2 = await reimbursementsAssistHasSubCategories.create(
                        {
                            reimbursements_assist_id: newItem.id,
                            sub_categories_id: 8,
                        },
                        { transaction: t }
                    );
                    itemsReturned = {
                        ...itemsReturned,
                        newItemWreath1: newItemSub1,
                        newItemWreath2: newItemSub2,
                    };
                }
                if (selectedVechicle) {
                    const newItemSub = await reimbursementsAssistHasSubCategories.create(
                        {
                            reimbursements_assist_id: newItem.id,
                            sub_categories_id: 9,
                        },
                        { transaction: t, });
                    itemsReturned = {
                        ...itemsReturned,
                        newItemVechicle: newItemSub,
                    }
                }
                if (selectedWreath || selectedVechicle) return itemsReturned
                return newItem;
            });
            res.status(201).json({ newItem: result, message: "บันทึกข้อมูลสำเร็จ" });
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { id },
            });
            next(error);
        }
    }
    update = async (req, res, next) => {
        const method = 'UpdateVariousWelfareFuneralFamily';
        const { id } = req.user;
        const selectedWreath = req.body.selected_wreath ?? false;
        const selectedVechicle = req.body.selected_vechicle ?? false;
        delete req.body.selected_wreath;
        delete req.body.selected_vechicle
        const dataUpdate = req.body;
        const dataId = req.params['id'];
        var itemsReturned = null;
        try {
            const result = await sequelize.transaction(async t => {
                const [updated] = await reimbursementsAssist.update(dataUpdate, {
                    where: { id: dataId },
                    transaction: t,
                });

                let checkingEdit = false;
                let itemsReturned = { updated };

                if (selectedWreath) {
                    const existingWreath = await reimbursementsAssistHasSubCategories.count({
                        where: { reimbursements_assist_id: dataId, sub_categories_id: { [Op.in]: [7, 8] } },
                        transaction: t,
                    });

                    if (!existingWreath) {
                        const newWreathItems = await reimbursementsAssistHasSubCategories.bulkCreate([
                            { reimbursements_assist_id: dataId, sub_categories_id: 7 },
                            { reimbursements_assist_id: dataId, sub_categories_id: 8 }
                        ], { transaction: t });

                        itemsReturned = { ...itemsReturned, newItemWreath: newWreathItems };
                        checkingEdit = true;
                    }
                } else {
                    const deletedWreath = await reimbursementsAssistHasSubCategories.destroy({
                        where: { reimbursements_assist_id: dataId, sub_categories_id: { [Op.in]: [7, 8] } },
                        transaction: t,
                    });

                    if (deletedWreath) {
                        itemsReturned = { ...itemsReturned, deleteItemWreath: deletedWreath };
                        checkingEdit = true;
                    }
                }

                if (selectedVechicle) {
                    const existingVechicle = await reimbursementsAssistHasSubCategories.count({
                        where: { reimbursements_assist_id: dataId, sub_categories_id: 9 },
                        transaction: t,
                    });

                    if (!existingVechicle) {
                        const newItemSub = await reimbursementsAssistHasSubCategories.create(
                            {
                                reimbursements_assist_id: dataId,
                                sub_categories_id: 9,
                            },
                            { transaction: t }
                        );

                        itemsReturned = { ...itemsReturned, newItemVechicle: newItemSub };
                        checkingEdit = true;
                    }
                } else {
                    const deletedVechicle = await reimbursementsAssistHasSubCategories.destroy({
                        where: { reimbursements_assist_id: dataId, sub_categories_id: 9 },
                        transaction: t,
                    });

                    if (deletedVechicle) {
                        itemsReturned = { ...itemsReturned, deleteItemVechicle: deletedVechicle };
                        checkingEdit = true;
                    }
                }

                return checkingEdit || updated > 0 ? itemsReturned : null;
            });

            if (result) {
                logger.info('Complete', { method, data: { id } });
                return res.status(201).json({ newItem: result, message: "อัปเดตข้อมูลสำเร็จ" });
            }

            res.status(400).json({ message: "ไม่มีข้อมูลที่ถูกแก้ไข" });

        } catch (error) {
            logger.error(`Error ${error.message}`, { method, data: { id } });
            next(error);
        }
    }
    delete = async (req, res, next) => {
        const method = 'DeletedVariousWelfareFuneralFamily';
        const { id } = req.user;
        const dataId = req.params['id'];
        try {
            const deletedSub = await reimbursementsAssistHasSubCategories.destroy({
                where: { reimbursements_assist_id: dataId },  
            });

            const deleted = await reimbursementsAssist.destroy({
                where: { id: dataId },
            });

            if (deletedSub && deleted) {
                const updatedItem = await reimbursementsAssist.findByPk(dataId);
                logger.info('Completed', {
                    method,
                    data: { id, dataId },
                });
                res.status(201).json({ updatedItem: updatedItem, message: "สำเร็จ" });
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
}

module.exports = new Controller();