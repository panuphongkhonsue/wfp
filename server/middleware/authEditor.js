require('dotenv').config();
const { initLogger } = require('../logger');
const logger = initLogger('AuthAdminMiddleware');
const Role = require('../models/mssql/Role')

module.exports = async (req, res, next) => {
    const method = 'AuthorizationAdmin';
	try {
		if (req.user && req.user.roleId) {
			const role = await Role.findByPk(req.user.roleId);
			if (role.level >= 98)
				return next();
		}
		throw Error("You don't have access to this API");
	} catch (error) {
		logger.error(`Error ${error.message}`, { method });
		res.status(401).send('Unauthorized');
	}
};