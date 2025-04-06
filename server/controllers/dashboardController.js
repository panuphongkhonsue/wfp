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
        try {
            const result = await sequelize.query(`
                SELECT 
                  welfare_type, 
                  SUM(fund_sum_request) AS fund_sum_request,
                  YEAR(updated_at) AS year
                FROM (
                  SELECT DISTINCT id, welfare_type, fund_sum_request, updated_at
                  FROM wfpdb.view_dashboard
                  WHERE updated_at BETWEEN :startDate AND :endDate
                ) AS distinct_view
                GROUP BY welfare_type, YEAR(updated_at)
                ORDER BY YEAR(updated_at) DESC, welfare_type ASC
              `, {
                replacements: {
                  startDate: `${startYear}-01-01`,
                  endDate: `${endYear}-12-31`
                },
                type: sequelize.QueryTypes.SELECT
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
            const dashboardDataList = await sequelize.query(`
                SELECT 
                    SUM(fund_sum_request) AS total_fund,
                    MONTH(updated_at) AS month
                FROM (
                    SELECT DISTINCT id, fund_sum_request, updated_at
                    FROM wfpdb.view_dashboard
                    WHERE 
                        updated_at BETWEEN :startDate AND :endDate
                ) AS distinct_view
                GROUP BY 
                    MONTH(updated_at);
            `, {
                replacements: {
                    startDate: `${parseInt(year) - 1}-10-01`,
                    endDate: `${year}-09-30`,
                },
                type: sequelize.QueryTypes.SELECT,
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
            const dashboardDataList = await sequelize.query(`
                SELECT 
                    welfare_type, 
                    SUM(fund_sum_request) AS total_fund
                FROM (
                    SELECT DISTINCT id, welfare_type, fund_sum_request
                    FROM wfpdb.view_dashboard
                    WHERE 
                        updated_at BETWEEN :startDate AND :endDate
                ) AS distinct_view
                GROUP BY welfare_type
                ORDER BY 
                    FIELD(welfare_type, 
                        'สวัสดิการทั่วไป', 
                        'สวัสดิการค่าสงเคราะห์ต่าง ๆ', 
                        'สวัสดิการค่าสงเคราะห์การเสียชีวิต', 
                        'สวัสดิการเกี่ยวกับการศึกษาของบุตร'
                    );
            `, {
                replacements: {
                    startDate: `${parseInt(year) - 1}-10-01`,
                    endDate: `${year}-09-30`,
                },
                type: sequelize.QueryTypes.SELECT,
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