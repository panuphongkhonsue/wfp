const BaseController = require('./BaseControllers');
const { viewDashboard } = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('viewDashboardController');
const { Op, fn, col } = require("sequelize");

class Controller extends BaseController {
    constructor() {
        super(viewDashboard);
    } 

    list = async (req, res, next) => {
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
                    "welfare_type",
                  ],
                  where: {
                    updated_at: {
                        [Op.between]: [`${parseInt(year) - 1}-10-01`, `${year}-09-30`]
                    },
                  },
                  group: ["welfare_type"],
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
      
}
module.exports = new Controller();