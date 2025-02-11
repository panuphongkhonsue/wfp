const BaseController = require('./BaseControllers');
const {reimbursementsChildrenEducation, childrenInfomation, subCategories, reimbursementsChildrenEducationHasChildrenInfomation } = require('../models/mariadb');
const { initLogger } = require('../logger');
const { Op, fn, col, literal } = require("sequelize");
const logger = initLogger('reimbursementChildrenEducationController');

class Controller extends BaseController{
    constructor() {
        super(reimbursementsChildrenEducation);
    }

    list = async (req, res, next) =>{
        const method = 'GetAllReimbursementsChildrenEducation'
        const { userId } = req.user;
        try {
            const { filter, page, itemPerPage } = req.query;
            var whereObj = { ...filter }
            const reimbursChildEdiDataList  = await reimbursementsChildrenEducation.paginate({
                attributes: [
                    'reim_number',
                    'created_at',
                    'updated_at',
                    'fund_receipt',
                    'fund_sum_request'
                ],
                page: page && !isNaN(page) ? Number(page) : 1,
                paginate: itemPerPage && !isNaN(itemPerPage) ? Number(itemPerPage) : 10,
                where: whereObj,
                order: [['created_at', 'DESC']]
            });
            console.log('Paginate Result:', reimbursChildEdiDataList);

            if(reimbursChildEdiDataList){
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
        catch (error){
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);

        }
    }

    getById = async (req, res, next) => {
        const method = 'GetUserRemainingChildbyId';
        const { userId } = req.user;
        const dataId = req.params['id'];
        console.log(`Request Param ID: ${dataId}`);

    
        try {
            // ดึงข้อมูลของ user
            const UserRemainingData = await reimbursementsChildrenEducation.findAll({
                where: { created_by: dataId },
                include: [{ model: subCategories, as: 'sub_category' }]

            });
            console.log("Database Query Result:", UserRemainingData);
    
            let totalRequested = UserRemainingData.reduce((sum, reimbursement) => sum + reimbursement.fund_sum_request, 0);
            const maxFund = UserRemainingData[0]?.sub_category?.fund || 0;
            console.log("Database Query Result:", totalRequested);
            console.log("Database Query Result:", maxFund);
    
            let isFullyClaimed = totalRequested > maxFund;
    
            logger.info('Complete', { method, data: { userId, isFullyClaimed } });
    
            res.status(isFullyClaimed ? 400 : 200).json({
                message: isFullyClaimed
                    ? "บุตรแต่ละคนเบิกครบตามเพดานแล้ว"
                    : "ยังสามารถเบิกได้อยู่"
            });
    
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    };


    getRemainingChildFund = async (req, res, next) => {
        const method = 'getChildFundSummary';
        const userId = req.user?.id;
    
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
    
    

    

    
}
module.exports = new Controller();
