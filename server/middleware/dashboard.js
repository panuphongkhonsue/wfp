const { initLogger } = require('../logger');
const logger = initLogger('DashboardValidator');
const { Op } = require('sequelize')
const permissionType = require('../enum/permission');
const { permissionsHasRoles } = require('../models/mariadb');
const role = require('../enum/role');
const { getFiscalYear, betweenFiscalByYear } = require('../middleware/utility');

const authPermission = async (req, res, next) => {
	const method = 'AuthPermission';
	const { roleId } = req.user;
	try {
		const isAccess = await permissionsHasRoles.count({
			where: {
				[Op.and]: [
					{ roles_id: roleId }, 
					{ permissions_id: permissionType.report},
				],
			},
		});
		if (!isAccess) {
			throw Error("You don't have access to this API");
		}
		next();
	}
	catch (error) {
		logger.error(`Error ${error.message}`, { method });
		res.status(401).json({ message: error.message });
	}
};

const bindGetDataDashboard = async (req, res, next) => {
	try {
		const {startYear, endYear} = req.query;
		req.query.filter = {};
        req.query.filter[Op.and] = [];
        const getFiscalYearWhere = betweenFiscalByYear(startYear, endYear);
        req.query.filter[Op.and].push(
            { '$viewDashboard.updated_at$': getFiscalYearWhere, },
        );
        next();
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { method });
        res.status(400).json({ message: error.message });
    }
};

module.exports = { authPermission, bindGetDataDashboard };