const { checkRequire, isNullOrEmpty } = require('../controllers/utility');
const bcrypt = require('bcryptjs');
const { initLogger } = require('../logger');
const logger = initLogger('UserValidator');
const { Op } = require('sequelize')
const permissionType = require('../enum/permission')
const { permissionsHasRoles, sequelize, users } = require('../models/mariadb')

const authPermission = async (req, res, next) => {
	const method = 'AuthPermission';
	const { roleID } = req.user;
	try {
		const isAccess = await permissionsHasRoles.count({
			where: {
				[Op.and]: [{ roles_id: roleID }, { permissions_id: permissionType.userManagement }],
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

const bindCreate = async (req, res, next) => {
	try {
		const { username, name, positionsId, employeeTypesId, departmentId, sectorId, firstWorkingDate, roleId, child } = req.body;
		const errorObj = {};
		if (isNullOrEmpty(username)) errorObj['username'] = 'กรุณากรอกบัญชึผู้ใช้งาน';
		if (isNullOrEmpty(name)) errorObj['name'] = 'กรุณากรอกชื่อ - นามสกุล';
		if (isNullOrEmpty(positionsId)) errorObj['positionsId'] = 'กรุณากรอกตำแหน่ง';
		if (isNullOrEmpty(employeeTypesId)) errorObj['employeeTypesId'] = 'กรุณากรอกประเภทบุคลากร';
		if (isNullOrEmpty(departmentId)) errorObj['departmentId'] = 'กรุณากรอกส่วนงาน';
		if (isNullOrEmpty(sectorId)) errorObj['sectorId'] = 'กรุณากรอกภาควิชา';
		if (isNullOrEmpty(firstWorkingDate)) errorObj['firstWorkingDate'] = 'กรุณากรอกวันที่เริ่มเข้าปฏิบัติงาน';
		if (isNullOrEmpty(roleId)) errorObj['roleId'] = 'กรุณาเลือกบทบาท';
		if (Object.keys(errorObj).length) res.status(400).json({ errors: errorObj });
		const dataBinding = {
			username: username,
			name: name,
			email: username + "@buu.ac.th",
			positions_id: positionsId,
			employee_types_id: employeeTypesId,
			departments_id: departmentId,
			sector_id: sectorId,
			first_working_date: firstWorkingDate,
			roles_id: roleId,
			child: !isNullOrEmpty(child) ? child : null,
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
		const { username, name, positionsId, employeeTypesId, departmentId, sectorId, firstWorkingDate, roleId } = req.body;
		const errorObj = {};
		if (isNullOrEmpty(username)) errorObj['username'] = 'กรุณากรอกบัญชึผู้ใช้งาน';
		if (isNullOrEmpty(name)) errorObj['name'] = 'กรุณากรอกชื่อ - นามสกุล';
		if (isNullOrEmpty(positionsId)) errorObj['positionsId'] = 'กรุณากรอกตำแหน่ง';
		if (isNullOrEmpty(employeeTypesId)) errorObj['employeeTypesId'] = 'กรุณากรอกประเภทบุคลากร';
		if (isNullOrEmpty(departmentId)) errorObj['departmentId'] = 'กรุณากรอกส่วนงาน';
		if (isNullOrEmpty(sectorId)) errorObj['sectorId'] = 'กรุณากรอกภาควิชา';
		if (isNullOrEmpty(firstWorkingDate)) errorObj['firstWorkingDate'] = 'กรุณากรอกวันที่เริ่มเข้าปฏิบัติงาน';
		if (isNullOrEmpty(roleId)) errorObj['roleId'] = 'กรุณาเลือกบทบาท';
		if (Object.keys(errorObj).length) res.status(400).json({ errors: errorObj });
		const dataBinding = {
			username: username,
			name: name,
			email: username + "@buu.ac.th",
			positions_id: positionsId,
			employee_types_id: employeeTypesId,
			departments_id: departmentId,
			sector_id: sectorId,
			first_working_date: firstWorkingDate,
			roles_id: roleId
		}
		req.body = dataBinding;
		next();
	} catch (error) {
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const validateDuplicate = async (req, res, next) => {
	try {
		const { username } = req.body;
		const isDuplicate = await users.count({
			where: {
				username: { [Op.eq]: username },
			},
		});
		if (isDuplicate) res.status(400).json({ errors: "บัญชีผู้ใช้นี้มีอยู่แล้ว" });
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
		req.query.filter[Op.and].push({
			'$users.deleted_at$': { [Op.is]: null }
		});
		next();
	}
	catch (error) {
		logger.error(`Error ${error.message}`, { method });
		res.status(401).json({ error: error.message });
	}
};

module.exports = { authPermission, bindCreate, bindUpdate, validateDuplicate, bindFilter };