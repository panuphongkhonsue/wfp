const { initLogger } = require('../logger');
const logger = initLogger('DashboardValidator');
const { permissionsHasRoles } = require('../models/mariadb');
const permissionType = require('../enum/permission');
const { Op } = require('sequelize')

authPermission = async (req, res, next) => {
	const method = 'AuthPermission';
	const { roleId } = req.user;
	try {
		const isAccess = await permissionsHasRoles.count({
			where: {
				[Op.and]: [{ roles_id: roleId }, { permissions_id: permissionType.report }],
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



module.exports = { authPermission };