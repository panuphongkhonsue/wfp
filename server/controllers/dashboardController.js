const BaseController = require('./BaseControllers');
const { viewDashboard, sequelize } = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('viewDashboardController');
const { fn, col, literal, Op } = require("sequelize");

class Controller extends BaseController {
    constructor() {
        super(viewDashboard);
    } 

    listAll = async (req, res, next) => {
        const method = 'GetAllViewDashboard';
        const { userId } = req.user;
        try {
            const { filter, page, itemPerPage } = req.query;
            var whereObj = { ...filter }
            const dashboardDataList = await viewDashboard.paginate({
                page: page && !isNaN(page) ? Number(page) : 1,
                paginate: itemPerPage && !isNaN(itemPerPage) ? Number(itemPerPage) : 10,
                where: whereObj
            });
            logger.info('Complete', { method, data: { userId } });
            res.status(200).json(dashboardDataList);
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    }

    list = async (req, res, next) => {
        const method = 'GetCustomDashboardData';
        const { userId } = req.user;
        const { startYear, endYear } = req.query;
        console.log("startYear:", startYear);
        console.log("endYear:", endYear);
        try {
            const result = await viewDashboard.findAll({
                attributes: [
                    [fn("SUM", col("fund_sum_request")), "fund_sum_request"],
                    "welfare_type",
                    [fn("YEAR", col("updated_at")), "year"] 
                ],
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('updated_at')), '>=', startYear),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('updated_at')), '<=', endYear)
                    ]
                },
                group: ["welfare_type", fn("YEAR", col("updated_at"))],
                order: [[fn("YEAR", col("updated_at")), "DESC"], ["welfare_type", "ASC"]]
            });
            res.status(200).json({
                datas: result,
                pagination: { totalPages: 1, totalItems: result.length }
            });
        } catch (error) {
            console.error("Query Error:", error.message);
            next(error);
        }
    }

    reportFundRequestPerYear = async (req, res, next) => {
        const method = 'GetAllViewDashboard';
        const { userId } = req.user;
        try {
            const { filter, page, itemPerPage, year } = req.query;
            var whereObj = { ...filter }
            const dashboardDataList = await viewDashboard.paginate({
                page: page && !isNaN(page) ? Number(page) : 1,
                paginate: itemPerPage && !isNaN(itemPerPage) ? Number(itemPerPage) : 10,
                attributes: [
                    [fn("SUM", col("fund_sum_request")), "total_fund"],
                    [fn("MONTH", col("updated_at")), "month"],
                  ],
                  where: {
                    updated_at: {
                        [Op.between]: [`${parseInt(year) - 1}-10-01`, `${year}-09-30`]
                    },
                  },
                  group: [fn("MONTH", col("updated_at"))],
                  raw: true,
            });
            logger.info('Complete', { method, data: { userId } });
            res.status(200).json(dashboardDataList);
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    }

    reportFundRequestPerYearEachType = async (req, res, next) => {
        const method = 'GetAllViewDashboard';
        const { userId } = req.user;
        try {
            const { filter, page, itemPerPage, year } = req.query;
            var whereObj = { ...filter }
            const dashboardDataList = await viewDashboard.paginate({
                page: page && !isNaN(page) ? Number(page) : 1,
                paginate: itemPerPage && !isNaN(itemPerPage) ? Number(itemPerPage) : 10,
                attributes: [
                    [fn("SUM", col("fund_sum_request")), "total_fund"],
                    "welfare_type"
                  ],
                  where: {
                    updated_at: {
                        [Op.between]: [`${parseInt(year) - 1}-10-01`, `${year}-09-30`]
                    }
                  },
                  group: ["welfare_type"],
                  order: [
                    [literal(`FIELD(welfare_type, 
                      'สวัสดิการทั่วไป', 
                      'สวัสดิการค่าสงเคราะห์ต่าง ๆ', 
                      'สวัสดิการค่าสงเคราะห์การเสียชีวิต', 
                      'สวัสดิการเกี่ยวกับการศึกษาของบุตร')`)]
                  ]
                });
            logger.info('Complete', { method, data: { userId } });
            res.status(200).json(dashboardDataList);
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    }
      
}
module.exports = new Controller();