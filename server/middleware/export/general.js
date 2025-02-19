const { initLogger } = require('../../logger');
const logger = initLogger('ExportHealthFetchData');
const { Op, col } = require('sequelize');
const statusText = require('../../enum/statusText');
const category = require('../../enum/category');
const { reimbursementsGeneral, users, positions, categories, sector, employeeTypes, departments, sequelize } = require('../../models/mariadb');

const fetchDataHealthCheckup = async (req, res, next) => {
    const method = 'FetchHealthCheckupData';
    const { id } = req.user;
    const dataId = req.params['id'];
    try {
        const requestData = await reimbursementsGeneral.findOne({
            attributes: [
                'id',
                [col("reim_number"), "reimNumber"],
                [col("fund_receipt"), "fundReceipt"],
                [col("fund_eligible"), "fundEligible"],
                [col("fund_sum_request"), "fundSumRequest"],
                [col("fund_decree"), "fundDecree"],
                [col("fund_university"), "fundUniversity"],
                [col("fund_eligible_name"), "fundEligibleName"],
                [col("fund_eligible_sum"), "fundEligibleSum"],
                [col("request_date"), "requestDate"],
                [col("status"), "status"],
                [col("created_by_user.id"), "userId"],
                [col("created_by_user.name"), "name"],
                [col("created_by_user.position.id"), "positionId"],
                [col("created_by_user.position.name"), "position"],
                [col("created_by_user.employee_type.id"), "employeeTypeId"],
                [col("created_by_user.employee_type.name"), "employeeType"],
                [col("created_by_user.sector.name"), "sector"],
                [col("created_by_user.department.name"), "department"],
                [col("category.id"), "categoryId"],
                [col("category.name"), "categoryName"],
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
                {
                    model: categories,
                    as: "category",
                    attributes: []
                }
            ],
            where: { id: dataId, status: statusText.waitApprove, categories_id: category.healthCheckup },
        });
        if (!requestData) {
            logger.info('Data not Found', { method, data: { id } });
            return res.status(200).json({
                message: "ไม่พบข้อมูล"
            });
        }
        const datas = JSON.parse(JSON.stringify(requestData));
        var welfareData = {
            ...datas,
            user: {
                employeeTypeId: datas.employeeTypeId,
                userId: datas.userId,
                name: datas.name,
                position: datas.position,
                employeeType: datas.employeeType,
                sector: datas.sector,
                department: datas.department,
            },
            receiptInfo: [
                {
                    categoryName: datas.categoryName,
                    fundSumRequest: datas.fundSumRequest,
                },
            ],
            total: datas.fundSumRequest,
        }
        delete welfareData.categoryName;
        delete welfareData.userId;
        delete welfareData.name;
        delete welfareData.position;
        delete welfareData.employeeType;
        delete welfareData.sector;
        delete welfareData.department;
        delete welfareData.employeeTypeId;
        req.body.datas = welfareData;
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, {
            method,
            data: { id },
        });
        next(error);
    }
};
module.exports = {
    fetchDataHealthCheckup
};