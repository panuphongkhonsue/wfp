const { permissionsHasRoles} = require('../models/mariadb')
const permissionType = require('../enum/permission')
const { Op } = require('sequelize')
const { initLogger } = require('../logger');
const logger = initLogger('ChildrenEducationValidator');
const { isNullOrEmpty } = require('../controllers/utility');

const authPermission = async (req, res, next) => {
	const method = 'AuthPermission';
	const { roleId } = req.user;
	try {
		const isAccess = await permissionsHasRoles.count({
			where: {
				[Op.and]: [{ roles_id: roleId }, { permissions_id: permissionType.childrenEdWelfare }],
			},
		});
		if (!isAccess) {
			throw Error("You don't have access to this API");
		}
		next();
	}
	catch (error) {
		logger.error(`Error ${error.message}`, { method });
		res.status(401).json({ error: error.message });
	}
};

const bindFilter = async (req, res, next) => {
	const method = 'BindFilter';
	try {
		const { keyword, from, to, statusReim } = req.query; 
		req.query.filter = {};
		req.query.filter[Op.and] = [];


		if (!isNullOrEmpty(keyword)) {
			req.query.filter[Op.and].push({
				'$reimbursementsChildrenEducation.reim_number$': { [Op.like]: `%${keyword}%` },
			});
		}

		if (!isNullOrEmpty(from) && !isNullOrEmpty(to)) {
			req.query.filter[Op.and].push({
				'$reimbursementsChildrenEducation.request_date$': { [Op.between]: [from,to] }
			});
		}

		if (!isNullOrEmpty(statusReim)) {
			req.query.filter[Op.and].push({
				'$reimbursementsChildrenEducation`.status$': { [Op.eq]: statusReim }
			});
		}

		next(); 
	} catch (error) {
		logger.error(`Error ${error.message}`, { method });
		res.status(400).json({ error: error.message });
	}
};



module.exports = { authPermission, bindFilter };