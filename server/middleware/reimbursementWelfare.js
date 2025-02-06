const { isNullOrEmpty, checkValueMinus } = require('../controllers/utility');
const { initLogger } = require('../logger');
const logger = initLogger('ReimbursementWelfareValidator');
const { Op } = require('sequelize')
const permissionType = require('../enum/permission')
const { permissionsHasRoles } = require('../models/mariadb');

const authPermission = async (req, res, next) => {
    const method = 'AuthPermission';
    const { roleId } = req.user;
    try {
        console.log("reg: " , req)
        const isAccess = await permissionsHasRoles.count({
            where: {
                [Op.and]: [{ roles_id: roleId }, { permissions_id: permissionType.welfareManagement }],
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
		const { keyword, welfareName } = req.query;
		req.query.filter = {};
		req.query.filter[Op.and] = [];

        // Check for 'keyword' and add to the filter if it's not empty
        if (!isNullOrEmpty(keyword)) {
            req.query.filter[Op.and].push({
				'$reim_number$': { [Op.like]: `%${keyword}%` },
			});    
        }
        
        // Check for 'welfareName' and add to the filter only if it's not empty
        if (!isNullOrEmpty(welfareName)) {
            req.query.filter[Op.and].push({
                '$welfare_type$': { [Op.eq]: welfareName } // Exact match for welfare_name
            });
        }

		next();
	}
	catch (error) {
		logger.error(`Error ${error.message}`, { method });
		res.status(401).json({ error: error.message });
	}
};



module.exports = { authPermission, bindFilter };