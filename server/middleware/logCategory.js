const bindAdd = async (req, res, next) => {
	try {
		const { name, fundOld, fundNew, perTimesOld, perTimesNew, perYearsOld, perYearsNew ,createdBy ,categoryId} = req.body;
		const dataBinding = {
            name: name,
            fund_old: fundOld,
            fund_new: fundNew,
            per_times_old: perTimesOld,
            per_times_new: perTimesNew,
            per_years_old: perYearsOld,
            per_years_new: perYearsNew,
            categories_id: categoryId,
			created_by : req.user.id
		}
		req.body = dataBinding;
		next();
	} catch (error) {
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
}
module.exports = { bindAdd };