const BaseController = require('./BaseControllers');
const { reimbursementsEmployeeDeceased, categories, subCategories, reimbursementsEmployeeDeceasedHasCategories, users, positions, sector, employeeTypes, departments, sequelize } = require('../models/mariadb');
const { Op, fn, col, literal } = require("sequelize");
const { initLogger } = require('../logger');
const category = require('../enum/category');
const logger = initLogger('funeralWelfareController');
const { getFiscalYearDynamic, getFiscalYear } = require('../middleware/utility');
const { isNullOrEmpty } = require('./utility');

class Controller extends BaseController {
    constructor() {
        super(reimbursementsEmployeeDeceased);
    }

    list = async (req, res, next) => {
        const method = 'GetListFuneralWelfare';
        const { id } = req.user;
        try {
            const { filter, page, itemPerPage } = req.query;
            var whereObj = { ...filter }
            const listData = await reimbursementsEmployeeDeceased.paginate({
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
        const method = 'GetRemainingFuneralWelfare';
        const { id } = req.user;
        try {
            const { filter } = req.query;
            var whereObj = { ...filter }
            whereObj[Op.and].push(
                { '$category.id$':  9 }
            );
            const decreaseRemaining = await reimbursementsEmployeeDeceasedHasCategories.findAll({
                attributes: [
                    [col("category.id"), "categoriesId"],
                    [col("category.name"), "categoriesName"],
                    [fn("SUM", col("reimbursements_employee_deceased.fund_request")), "totalSumRequested"],
                    [col("category.fund"), "fund"],
                    [
                        literal("category.fund - SUM(reimbursements_employee_deceased.fund_request)"),
                        "fundRemaining"
                    ],
                    [fn("COUNT", col("reimbursements_employee_deceased.fund_request")), "totalCountRequested"],
                    [col("category.per_years"), "perYears"],
                    [
                        literal("category.per_years - COUNT(reimbursements_employee_deceased.fund_request)"),
                        "requestsRemaining"
                    ],
                    [col("category.per_times"), "perTimesRemaining"],
                ],
                include: [
                    {
                        model: categories,
                        as: "category",
                        attributes: []
                    },
                    {
                        model: reimbursementsEmployeeDeceased,
                        as: "reimbursements_employee_deceased",
                        attributes: []
                    }
                ],
                where: whereObj,
                group: ["category.id"],
            });
            whereObj[Op.and].push(
                { '$sub_category.id$': { [Op.in]: [10, 11] } }
            );
            const wreathRemaining = await reimbursementsEmployeeDeceasedHasCategories.findAll({
                attributes: [
                    [col("category.id"), "categoriesId"],
                    [col("category.name"), "categoriesName"],
                    [col("category.fund"), "fund"],
                    [col("category.per_years"), "perYears"],
                    [col("category.per_times"), "perTimesRemaining"],

                    // fund_wreath_arrange
                    [
                        fn("SUM", literal("CASE WHEN category.id = 10 THEN reimbursements_employee_deceased.fund_wreath_arrange ELSE 0 END")),
                        "totalSumRequestedArrange"
                    ],
                    [
                        fn("SUM", literal("CASE WHEN category.id = 10 THEN reimbursements_employee_deceased.fund_wreath_arrange ELSE 0 END")),
                        "fundRemainingArrange"
                    ],
                    [
                        fn("COUNT", literal("CASE WHEN category.id = 10 THEN reimbursements_employee_deceased.fund_wreath_arrange ELSE NULL END")),
                        "totalCountRequestedArrange"
                    ],
                    [
                        fn("category.per_years - COUNT", literal("CASE WHEN category.id = 10 THEN reimbursements_employee_deceased.fund_wreath_arrange ELSE NULL END")),
                        "requestsRemainingArrange"
                    ],

                    // fund_wreath_university
                    [
                        fn("SUM", literal("CASE WHEN category.id = 11 THEN reimbursements_employee_deceased.fund_wreath_university ELSE 0 END")),
                        "totalSumRequestedUniversity"
                    ],
                    [
                        fn("SUM", literal("CASE WHEN category.id = 11 THEN reimbursements_employee_deceased.fund_wreath_university ELSE 0 END")),
                        "fundRemainingUniversity"
                    ],
                    [
                        fn("COUNT", literal("CASE WHEN category.id = 11 THEN reimbursements_employee_deceased.fund_wreath_university ELSE NULL END")),
                        "totalCountRequestedUniversity"
                    ],
                    [
                        fn("category.per_years - COUNT", literal("CASE WHEN category.id = 11 THEN reimbursements_employee_deceased.fund_wreath_university ELSE NULL END")),
                        "requestsRemainingUniversity"
                    ],
                ],
                include: [
                    {
                        model: categories,
                        as: "category",
                        attributes: []
                    },
                    {
                        model: reimbursementsEmployeeDeceased,
                        as: "reimbursements_employee_deceased",
                        attributes: []
                    }
                ],
                where: whereObj,
                group: ["category.id"],
            });
            whereObj[Op.and] = whereObj[Op.and].filter(item => [10, 11].includes(item['$category.id$']));
            whereObj[Op.and].push(
                { '$category.id$': 12 }
            );
            const vechicleRemaining = await reimbursementsEmployeeDeceasedHasCategories.findAll({
                attributes: [
                    [col("category.id"), "categoriesId"],
                    [col("category.name"), "categoriesName"],
                    [fn("SUM", col("reimbursements_employee_deceased.fund_vechicle")), "totalSumRequested"],
                    [col("category.fund"), "fund"],
                    [
                        literal("category.fund - SUM(reimbursements_employee_deceased.fund_vechicle)"),
                        "fundRemaining"
                    ],
                    [fn("COUNT", col("reimbursements_employee_deceased.fund_vechicle")), "totalCountRequested"],
                    [col("category.per_years"), "perYears"],
                    [
                        literal("category.per_years - COUNT(reimbursements_employee_deceased.fund_vechicle)"),
                        "requestsRemaining"
                    ],
                    [col("category.per_times"), "perTimesRemaining"],
                ],
                include: [
                    {
                        model: categories,
                        as: "category",
                        attributes: []
                    },
                    {
                        model: reimbursementsEmployeeDeceased,
                        as: "reimbursements_employee_deceased",
                        attributes: []
                    }
                ],
                where: whereObj,
                group: ["category.id"],
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
                    const getFund = await categories.findAll({
                        attributes: [
                            [col("id"), "categoriesId"],
                            [col("name"), "categoriesName"],
                            [col("fund"), "fundRemaining"],
                            [col("per_years"), "requestsRemaining"],
                            [col("per_times"), "perTimesRemaining"],
                        ],
                        where: { id: 9 }
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
                    const getFund = await categories.findAll({
                        attributes: [
                            [col("id"), "categoriesId"],
                            [col("name"), "categoriesName"],
                            [col("fund"), "fundRemaining"],
                            [col("per_years"), "requestsRemaining"],
                            [col("per_times"), "perTimesRemaining"],
                        ],
                        where: { id: [10, 11] }
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
                    const getFund = await categories.findAll({
                        attributes: [
                            [col("id"), "categoriesId"],
                            [col("name"), "categoriesName"],
                            [col("fund"), "fundRemaining"],
                            [col("per_years"), "requestsRemaining"],
                            [col("per_times"), "perTimesRemaining"],
                        ],
                        where: { id: 12 }
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
            const getFund = await categories.findAll({
                attributes: [
                    [col("id"), "categoriesId"],
                    [col("name"), "categoriesName"],
                    [col("fund"), "fundRemaining"],
                    [col("per_years"), "requestsRemaining"],
                    [col("per_times"), "perTimesRemaining"],
                ],
                where: {
                    id: {
                        [Op.in]: [9, 10, 11, 12]
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
        const method = 'GetFuneralWelfarebyId';
        const { id } = req.user;
        const dataId = req.params['id'];
        try {
            const { filter } = req.query;
            var whereObj = { ...filter }
            const requestData = await reimbursementsEmployeeDeceased.findByPk(dataId, {
                attributes: [
                    [col("reim_number"), "reimNumber"],
                    [col("fund_receipt"), "fundReceipt"],
                    [col("fund_request"), "fundRequest"],
                    [col("deceased"), "decease"],
                    [col("organizer"), "organizer"],
                    [col("fund_receipt_wreath"), "fundReceiptWreath"],
                    [col("fund_wreath_university"), "fundWreathUniversity"],
                    [col("fund_wreath_arrange"), "fundWreathArrange"],
                    [col("fund_receipt_vechicle"), "fundReceiptVechicle"],
                    [col("fund_vechicle"), "fundVechicle"],
                    [col("fund_sum_receipt"), "fundSumReceipt"],
                    [col("fund_sum_request"), "fundSumRequest"],
                    [col("request_date"), "requestDate"],
                    [col("status"), "status"],
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
                    { '$reimbursements_employee_deceased.request_date$': getFiscalYearWhere },
                    { '$reimbursements_employee_deceased.categories_id$': category.funeralWelfare },
                    { '$reimbursements_employee_deceased.created_by$': datas.userId },
                    { '$reimbursements_employee_deceased.id$': { [Op.lte]: datas.id } },
                    { '$category.id$': { [Op.in]: [10,11,12] } },
                );
                const getRequestData = await reimbursementsEmployeeDeceasedHasCategories.findAll({
                    attributes: [
                        [col("reimbursements_employee_deceased.id"), "id"],
                        [col("reimbursements_employee_deceased.fund_vechicle"), "fundVecicle"],
                    ],
                    include: [
                        {
                            model: categories,
                            as: "category",
                            attributes: []
                        },
                        {
                            model: reimbursementsEmployeeDeceased,
                            as: "reimbursements_employee_deceased",
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
        const method = 'CreateFuneralWelfare';
        const { id } = req.user;
        const selectedWreath = req.body.selected_wreath ?? false;
        const selectedVechicle = req.body.selected_vechicle ?? false;
        const deceased = req.body.deceased ?? null;
        delete req.body.selected_wreath;
        delete req.body.selected_vechicle;
        delete req.body.deceased;
        try {
            const result = await sequelize.transaction(async t => {
                const newItem = await reimbursementsAssist.create(dataCreate, { transaction: t, });
                var itemsReturned = {
                    ...newItem.toJSON(),
                };
                if (selectedWreath) {
                    const newItemSub1 = await reimbursementsEmployeeDeceasedHasCategories.create(
                        {
                            reimbursements_employee_deceased_id: newItem.id,
                            categories_id: 10,
                        },
                        { transaction: t }
                    );
                    const newItemSub2 = await reimbursementsEmployeeDeceasedHasCategories.create(
                        {
                            reimbursements_employee_deceased_id: newItem.id,
                            categories_id: 11,
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
                    const newItemSub = await reimbursementsEmployeeDeceasedHasCategories.create(
                        {
                            reimbursements_employee_deceased_id: newItem.id,
                            categories_id: 12,
                        },
                        { transaction: t, });
                    itemsReturned = {
                        ...itemsReturned,
                        newItemVechicle: newItemSub,
                    }
                }

                if (deceased) {
                    console.log("Selected Deceased:", deceased);
                    const newItemSub = await reimbursementsEmployeeDeceasedHasCategories.create(
                        {
                            reimbursements_employee_deceased_id: newItem.id,
                            categories_id: 9,
                        },
                        { transaction: t }
                    );
                    itemsReturned = {
                        ...itemsReturned,
                        newItemDecease: newItemSub,
                    };
                } 

                if (selectedWreath || selectedVechicle || deceased) {
                    return itemsReturned;
                }
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
        const method = 'UpdateFuneralWelfare';
        const { id } = req.user;
        const selectedWreath = req.body.selected_wreath ?? false;
        const selectedVechicle = req.body.selected_vechicle ?? false;
        const deceased = req.body.deceased ?? null;
        delete req.body.selected_wreath;
        delete req.body.selected_vechicle;
        delete req.body.deceased;
        const dataUpdate = req.body;
        const dataId = req.params['id'];
        var itemsReturned = null;
        try {
            const result = await sequelize.transaction(async t => {
                const [updated] = await reimbursementsEmployeeDeceased.update(dataUpdate, {
                    where: { id: dataId },
                    transaction: t,
                });

                let checkingEdit = false;
                let itemsReturned = { updated };

                if (selectedWreath) {
                    const existingWreath = await reimbursementsEmployeeDeceasedHasCategories.count({
                        where: { reimbursements_employee_deceased_id: dataId, categories_id: { [Op.in]: [10,11] } },
                        transaction: t,
                    });

                    if (!existingWreath) {
                        const newWreathItems = await reimbursementsEmployeeDeceasedHasCategories.bulkCreate([
                            { reimbursements_employee_deceased_id: dataId, categories_id: 10 },
                            { reimbursements_employee_deceased_id: dataId, ategories_id: 11 }
                        ], { transaction: t });

                        itemsReturned = { ...itemsReturned, newItemWreath: newWreathItems };
                        checkingEdit = true;
                    }
                } else {
                    const deletedWreath = await reimbursementsEmployeeDeceasedHasCategories.destroy({
                        where: { reimbursements_employee_deceased_id: dataId, categories_id: { [Op.in]: [10, 11] } },
                        transaction: t,
                    });

                    if (deletedWreath) {
                        itemsReturned = { ...itemsReturned, deleteItemWreath: deletedWreath };
                        checkingEdit = true;
                    }
                }

                if (selectedVechicle) {
                    const existingVechicle = await reimbursementsEmployeeDeceasedHasCategories.count({
                        where: { reimbursements_employee_deceased_id: dataId, categories_id: 12 },
                        transaction: t,
                    });

                    if (!existingVechicle) {
                        const newItemSub = await reimbursementsEmployeeDeceasedHasCategories.create(
                            {
                                reimbursements_employee_deceased_id: dataId,
                                categories_id: 12,
                            },
                            { transaction: t }
                        );

                        itemsReturned = { ...itemsReturned, newItemVechicle: newItemSub };
                        checkingEdit = true;
                    }
                } else {
                    const deletedVechicle = await reimbursementsEmployeeDeceasedHasCategories.destroy({
                        where: { reimbursements_employee_deceased_id: dataId, categories_id: 12 },
                        transaction: t,
                    });

                    if (deletedVechicle) {
                        itemsReturned = { ...itemsReturned, deleteItemVechicle: deletedVechicle };
                        checkingEdit = true;
                    }
                }
                if (deceased) {
                    const deletedDeceased = await reimbursementsEmployeeDeceasedHasCategories.destroy({
                        where: { reimbursements_employee_deceased_id: dataId, categories_id:  9 },
                        transaction: t,
                    });
    
                    if (deletedDeceased) {
                        console.log("Deleted old Deceased:", deletedDeceased);  
                        itemsReturned = { ...itemsReturned, deleteItemDeceased: deletedDeceased };
                        checkingEdit = true;
                    }
    
                    const existingDeceased = await reimbursementsEmployeeDeceasedHasCategories.count({
                        where: { reimbursements_employee_deceased_id: dataId, categories_id: 9 },
                        transaction: t,
                    });
    
                    if (!existingDeceased) {
                        const newDeceasedSub = await reimbursementsEmployeeDeceasedHasCategories.create(
                            {
                                reimbursements_employee_deceased_id: dataId,
                                categories_id: 9,
                            },
                            { transaction: t }
                        );
    
                        itemsReturned = { ...itemsReturned, newItemDeceased: newDeceasedSub };
                        checkingEdit = true;
                    }
                } else if (deceased) {
                    const deletedDeceased = await reimbursementsEmployeeDeceasedHasCategories.destroy({
                        where: { reimbursements_employee_deceased_id: dataId, categories_id: 9 },
                        transaction: t,
                    });
    
                    if (deletedDeceased) {
                        itemsReturned = { ...itemsReturned, deleteItemDeceased: deletedDeceased };
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
        const method = 'DeletedFuneralWelfare';
        const { id } = req.user;
        const dataId = req.params['id'];
        try {
            const deletedSub = await reimbursementsEmployeeDeceasedHasCategories.destroy({
                where: { reimbursements_employee_deceased_id: dataId },
            });

            const deleted = await reimbursementsEmployeeDeceased.destroy({
                where: { id: dataId },
            });

            if (deletedSub && deleted) {
                const updatedItem = await reimbursementsEmployeeDeceased.findByPk(dataId);
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