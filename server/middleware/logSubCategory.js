const bindAdd = async (req, res, next) => {
	try {
		const { name, fundOld, fundNew, perTimesOld, perTimesNew, perYearsOld, perYearsNew, subCategoryId, perUsersNew, perUsersOld} = req.body;
		const dataBinding = {
            name: name,
            fund_old: fundOld,
            fund_new: fundNew,
            per_times_old: perTimesOld,
            per_times_new: perTimesNew,
			per_users_old: perUsersOld,
            per_users_new: perUsersNew,
            per_years_old: perYearsOld,
            per_years_new: perYearsNew,
            sub_categories_id: subCategoryId,
			created_by: req.user.id
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