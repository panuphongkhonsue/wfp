const BaseController = require('./BaseControllers');
const {reimbursementsChildrenEducation, childrenInfomation, subCategories } = require('../models/mariadb');
const { initLogger } = require('../logger');
const { where } = require('sequelize');
const logger = initLogger('UserController');

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
    

    
}
module.exports = new Controller();
