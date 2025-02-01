const { isNullOrEmpty } = require('../controllers/utility');

const bindFilter = async (req, res, next) => {
	const method = 'BindFilter';
	try {
		const { keyword } = req.query;
		req.query.filter = {};
		req.query.filter[Op.and] = [];
		if (!isNullOrEmpty(keyword)) {
			req.query.filter[Op.and].push({
				'$sub_categories.name$': { [Op.like]: `%${keyword}%` },
			});
		}
		if (!is)
		next();
	}
	catch (error) {
		logger.error(`Error ${error.message}`, { method });
		res.status(401).json({ error: error.message });
	}
};