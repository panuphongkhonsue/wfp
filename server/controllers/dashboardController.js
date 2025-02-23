const BaseController = require('./BaseControllers');
const { viewDashboard, sequelize } = require('../models/mariadb');
const { initLogger } = require('../logger');
const logger = initLogger('viewDashboardController');
const { fn, col, literal, Op } = require("sequelize");

class Controller extends BaseController {
    constructor() {
        super(viewDashboard);
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
    };
    
}
module.exports = new Controller();