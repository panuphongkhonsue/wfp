const { isNullOrEmpty } = require('../middleware/utility');
const { initLogger } = require('../logger');
const logger = initLogger('UserValidator');
const { Op } = require('sequelize')
const permissionType = require('../enum/permission')
const roleType = require('../enum/role')
const { permissionsHasRoles, sequelize, users } = require('../models/mariadb')

const authPermission = async (req, res, next) => {
	const method = 'AuthPermission';
	const { roleId } = req.user;
	try {
		const isAccess = await permissionsHasRoles.count({
			where: {
				[Op.and]: [{ roles_id: roleId }, { permissions_id: permissionType.userManagement }],
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

const bindCreate = async (req, res, next) => {
	try {
		const { username, name, positionId, employeeTypeId, departmentId, sectorId, firstWorkingDate, roleId } = req.body;
		const errorObj = {};
		if (isNullOrEmpty(username)) errorObj['username'] = 'กรุณากรอกบัญชึผู้ใช้งาน';
		if (isNullOrEmpty(name)) errorObj['name'] = 'กรุณากรอกชื่อ - นามสกุล';
		if (isNullOrEmpty(positionId)) errorObj['positionId'] = 'กรุณากรอกตำแหน่ง';
		if (isNullOrEmpty(employeeTypeId)) errorObj['employeeTypeId'] = 'กรุณากรอกประเภทบุคลากร';
		if (isNullOrEmpty(departmentId)) errorObj['departmentId'] = 'กรุณากรอกส่วนงาน';
		if (isNullOrEmpty(sectorId)) errorObj['sectorId'] = 'กรุณากรอกภาควิชา';
		if (isNullOrEmpty(firstWorkingDate)) errorObj['firstWorkingDate'] = 'กรุณากรอกวันที่เริ่มเข้าปฏิบัติงาน';
		if (isNullOrEmpty(roleId)) errorObj['roleId'] = 'กรุณาเลือกบทบาท';
		if (Object.keys(errorObj).length) return res.status(400).json({ errors: errorObj });
		const { id } = req.user;
		const dataBinding = {
			username: username,
			name: name,
			email: username + "@buu.ac.th",
			positions_id: positionId,
			employee_types_id: employeeTypeId,
			departments_id: departmentId,
			sector_id: sectorId,
			first_working_date: firstWorkingDate,
			roles_id: roleId,
			child: req.body.child,
			created_by: id,
			updated_by: id,
		}
		if (isNullOrEmpty(req.body.child)) {
			delete dataBinding.child;
		}
		else {
			if (!isNullOrEmpty(dataBinding.child)) {
				dataBinding.child = dataBinding.child.filter(item =>
					!Object.values(item).some(value => value === null || value === "")
				);
				if (dataBinding.child.length === 0) {
					delete dataBinding.child;
				}
			}
		}
		req.body = dataBinding;
		next();
	} catch (error) {
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};
const bindUpdate = async (req, res, next) => {
	try {
		const { username, name, positionId, employeeTypeId, departmentId, sectorId, firstWorkingDate, roleId, deleteChild } = req.body;
		const errorObj = {};
		if (isNullOrEmpty(username)) errorObj['username'] = 'กรุณากรอกบัญชึผู้ใช้งาน';
		if (isNullOrEmpty(name)) errorObj['name'] = 'กรุณากรอกชื่อ - นามสกุล';
		if (isNullOrEmpty(positionId)) errorObj['positionId'] = 'กรุณากรอกตำแหน่ง';
		if (isNullOrEmpty(employeeTypeId)) errorObj['employeeTypeId'] = 'กรุณากรอกประเภทบุคลากร';
		if (isNullOrEmpty(departmentId)) errorObj['departmentId'] = 'กรุณากรอกส่วนงาน';
		if (isNullOrEmpty(sectorId)) errorObj['sectorId'] = 'กรุณากรอกภาควิชา';
		if (isNullOrEmpty(firstWorkingDate)) errorObj['firstWorkingDate'] = 'กรุณากรอกวันที่เริ่มเข้าปฏิบัติงาน';
		if (isNullOrEmpty(roleId)) errorObj['roleId'] = 'กรุณาเลือกบทบาท';
		if (Object.keys(errorObj).length) return res.status(400).json({ errors: errorObj });
		const { id } = req.user;
		const dataBinding = {
			username: username,
			name: name,
			email: username + "@buu.ac.th",
			positions_id: positionId,
			employee_types_id: employeeTypeId,
			departments_id: departmentId,
			sector_id: sectorId,
			first_working_date: firstWorkingDate,
			roles_id: roleId,
			child: req.body.child,
			updated_by: id,
		}
		if (isNullOrEmpty(req.body.child)) {
			delete dataBinding.child;
		}
		if (!isNullOrEmpty(deleteChild)) {
			req.deleteChild = deleteChild;
		}
		else {
			var hasNull = false;
			if (!isNullOrEmpty(dataBinding.child)) {
				hasNull = req.body.child.some(item =>
					Object.values(item).some(value => value.name === null || value.name === "" || value.birthday === null || value.birthday === "")
				);
			}
			if (hasNull) delete dataBinding.child;
		}
		req.body = dataBinding;
		next();
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const validateDuplicate = async (req, res, next) => {
	try {
		const { username } = req.body;
		const dataId = req.params['id'];
		var filter = {};
		if (!isNullOrEmpty(dataId)) {
			filter[Op.and] = [
				{ '$users.username$': { [Op.eq]: username } },
				{ '$users.id$': { [Op.ne]: dataId } }
			];
		} else {
			filter = {
				'$users.username$': { [Op.eq]: username }
			};
		}
		const isDuplicate = await users.count({ where: filter });

		if (isDuplicate) res.status(400).json({ message: "บัญชีผู้ใช้นี้มีอยู่แล้ว" });
		next();
	} catch (error) {
		logger.error(error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const bindFilter = async (req, res, next) => {
	const method = 'BindFilter';
	try {
		const { keyword } = req.query;
		req.query.filter = {};
		req.query.filter[Op.and] = [];
		if (!isNullOrEmpty(keyword)) {
			req.query.filter[Op.and].push({
				'$users.name$': { [Op.like]: `%${keyword}%` },
			});
		}
		req.query.filter[Op.and].push(
			{
				'$users.deleted_at$': { [Op.is]: null }
			},
			{
				'$users.roles_id$': { [Op.ne]: roleType.adminUser }
			},
		);
		next();
	}
	catch (error) {
		logger.error(`Error ${error.message}`, { method });
		res.status(400).json({ message: error.message });
	}
};


module.exports = { authPermission, bindCreate, bindUpdate, validateDuplicate, bindFilter };