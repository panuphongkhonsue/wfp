const BaseController = require('./BaseControllers');
const { users, positions, sector, employeeTypes, roles, departments, children, sequelize } = require('../models/mariadb');
const { Op } = require('sequelize')
const { initLogger } = require('../logger');
const logger = initLogger('UserController');
const { isNullOrEmpty } = require('../controllers/utility');

class Controller extends BaseController {
    constructor() {
        super(users);
    }

    list = async (req, res, next) => {
        const method = 'GetListUser';
        const { userId } = req.user;
        try {
            const { filter, page, itemPerPage } = req.query;
            var whereObj = { ...filter }
            const userDataList = await users.paginate({
                attributes: [
                    'id',
                    'name',
                ],
                page: page && !isNaN(page) ? Number(page) : 1,
                paginate: itemPerPage && !isNaN(itemPerPage) ? Number(itemPerPage) : 0,
                include: [
                    {
                        model: positions, as: 'position',
                        attributes: ['name'], required: false
                    },
                    {
                        model: employeeTypes, as: 'employee_type',
                        attributes: ['name'], required: false
                    },
                    {
                        model: sector, as: 'sector',
                        attributes: ['name'], required: false
                    },
                    {
                        model: departments, as: 'department',
                        attributes: ['name'], required: false
                    },
                ],
                where: whereObj,
                order: [['id', 'ASC']]
            });

            if (userDataList) {
                var userList = {};
                userList.pagination = {
                    page: page && !isNaN(page) ? Number(page) : 1,
                    total: userDataList.total
                }
                userList.datas = userDataList.docs.map((listObj) => {
                    const plainObj = listObj.toJSON();
                    var position = plainObj.position?.name;
                    var employeeType = plainObj.employee_type?.name;
                    var sector = plainObj.sector?.name;
                    var department = plainObj.department?.name;
                    delete plainObj.employee_type;
                    return {
                        ...plainObj,
                        position: position,
                        employeeType: employeeType,
                        sector: sector,
                        department: department,
                    }
                });
                logger.info('Complete', { method, data: { userId } });
                res.status(200).json(userList);
            }
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    }
    getById = async (req, res, next) => {
        const method = 'GetUserbyId';
        const { userId } = req.user;
        const dataId = req.params['id'];
        try {
            const userData = await users.findOne({
                where: {
                    id: dataId,
                    deleted_at: { [Op.is]: null }
                },
                attributes: [
                    'id',
                    'name',
                    'username',
                    'first_working_date',
                ],
                include: [
                    {
                        model: positions, as: 'position',
                        attributes: ['id', 'name'], required: false
                    },
                    {
                        model: employeeTypes, as: 'employee_type',
                        attributes: ['id', 'name'], required: false
                    },
                    {
                        model: roles, as: 'role',
                        attributes: ['id', 'name'], required: false
                    },
                    {
                        model: departments, as: 'department',
                        attributes: ['id', 'name'], required: false
                    },
                    {
                        model: sector, as: 'sector',
                        attributes: ['id', 'name'], required: false
                    },
                ],
            });
            const childrenData = await children.findAll({
                attributes: [
                    'id',
                    'name',
                    'birthday',
                ],
                where: {
                    users_id: dataId,
                }
            })
            if (userData) {
                const datas = JSON.parse(JSON.stringify(userData));
                var user = {};
                user.datas = {
                    ...datas,
                    firstWorkingDate: datas.first_working_date,
                    position: datas.position,
                    employeeType: datas.employee_type,
                    sector: datas.sector,
                    role: datas.role,
                    department: datas.department,
                    children: childrenData,
                };
                delete user.datas.employee_type;
                delete user.datas.first_working_date;
                logger.info('Complete', { method, data: { userId } });
                res.status(200).json(user);
            } else {
                logger.info('Data not found', {
                    method,
                    data: { userId, dataId },
                });
                res.status(404).json({
                    message: `ไม่พบข้อมูล`,
                });
            }
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    }
    create = async (req, res, next) => {
        const method = 'CreateUser';
        const { userId } = req.user;
        const child = req.body.child ?? null;
        delete req.body.child;
        const dataCreate = req.body;
        try {
            const result = await sequelize.transaction(async t => {
                const newItemUser = await users.create(dataCreate, { transaction: t, });

                if (!isNullOrEmpty(child)) {
                    var childData = child.map((childObj) => ({
                        users_id: newItemUser.id,
                        name: childObj.name,
                        birthday: childObj.birthday,
                        created_by: dataCreate.created_by,
                        updated_by: dataCreate.updated_by,
                    }));
                    const newItemChild = await children.bulkCreate(childData, {
                        fields: ['name', "birthday", 'users_id'],
                        transaction: t,
                    });
                    var itemsReturned = {
                        ...newItemUser.toJSON(),
                        child: newItemChild,
                    };
                }
                if (!isNullOrEmpty(child)) return itemsReturned
                return newItemUser;
            });
            res.status(201).json({ newItem: result, message: "บันทึกข้อมูลสำเร็จ" });
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    }
    update = async (req, res, next) => {
        const method = 'UpdateUser';
        const { userId } = req.user;
        const child = req.body.child ?? null;
        delete req.body.child;
        const dataUpdate = req.body;
        const dataId = req.params['id'];
        var itemsReturned = null;
        try {
            const result = await sequelize.transaction(async t => {
                const [updated] = await users.update(dataUpdate, {
                    where: {
                        id: dataId,
                    },
                    transaction: t,
                });
                if (!isNullOrEmpty(child)) {
                    var childData = child.map((childObj) => ({
                        id: childObj.id,
                        users_id: dataId,
                        name: childObj.name,
                        birthday: childObj.birthDay,
                        created_by: dataUpdate.updated_by,
                        updated_by: dataUpdate.updated_by,
                    }));
                    // Fetch existing child data before update
                    const existingChildren = await children.findAll({
                        where: { users_id: dataId },
                        attributes: ["id", "name", "birthday"],
                        raw: true,
                        transaction: t,
                    });
                    var updateItemChild = await children.bulkCreate(childData, {
                        updateOnDuplicate: ["name", "birthday", "users_id"],
                        transaction: t,
                    });
                    // Fetch updated child data after bulkCreate
                    const updatedChildren = await children.findAll({
                        where: { users_id: dataId },
                        attributes: ["id", "name", "birthday"],
                        raw: true,
                        transaction: t,
                    });
                    var hasChildUpdated = JSON.stringify(existingChildren) !== JSON.stringify(updatedChildren);
                }
                if (updated > 0 || hasChildUpdated) {
                    itemsReturned = {
                        ...updated,
                        child: updateItemChild,
                    };
                }
                else {
                    itemsReturned = null;
                }
                return itemsReturned;
            });
            if (result) {
                logger.info('Complete', { method, data: { userId } });
                return res.status(201).json({ newItem: result, message: "บันทึกข้อมูลสำเร็จ" });
            }
            res.status(400).json({ newItem: result, message: "ไม่มีข้อมูลที่ถูกแก้ไข" });
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    }
    delete = async (req, res, next) => {
        const method = 'DeletedUser';
        const { userId } = req.user;
        const dataId = req.params['id'];
        const dataUpdate = new Date();
        try {
            const [updated] = await users.update({ deleted_at: dataUpdate }, {
                where: {
                    'id': dataId,
                },
            });
            if (updated) {
                const updatedItem = await users.findByPk(dataId);
                logger.info('Completed', {
                    method,
                    data: { userId, dataId },
                });
                res.status(201).json({ updatedItem: updatedItem, message: "สำเร็จ" });
            } else {
                logger.info('Data not found', {
                    method,
                    data: { userId, dataId },
                });
                res.status(404).json({
                    message: `ไม่พบข้อมูล`,
                });
            }
        }
        catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    }
}

module.exports = new Controller();