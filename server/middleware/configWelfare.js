const { isNullOrEmpty } = require('../controllers/utility');
const { initLogger } = require('../logger');
const logger = initLogger('ConfigWelfareValidator');
const { Op } = require('sequelize')

const bindFilter = async (req, res, next) => {
	const method = 'BindFilter';
	try {
		const { configWelfare } = req.query;
		req.query.filter = {};
		req.query.filter[Op.and] = [];
		if (!isNullOrEmpty(configWelfare)) {
			req.query.filter[Op.and].push({
				'$welfare_id$': { [Op.like]: `%${configWelfare}%` },
			});
		}
		next();
	}
	catch (error) {
		logger.error(`Error ${error.message}`, { method });
		res.status(401).json({ error: error.message });
	}
};
module.exports = { bindFilter };