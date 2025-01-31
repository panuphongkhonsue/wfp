const BaseController = require('./BaseControllers');
const { users, positions, sector, employeeTypes, roles, departments, children, sequelize } = require('../models/mariadb');
const { isNullOrEmpty } = require('../middleware/utility');

const { initLogger } = require('../logger');
const { where } = require('sequelize');
const logger = initLogger('UserController');

class Controller extends BaseController {
    constructor() {
        super(users);
    }

    list = async (req, res, next) => {
        const method = 'GetAllUser';
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
                ],
                where: whereObj
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
                    delete plainObj.employee_type;
                    return {
                        ...plainObj,
                        position: position,
                        employeeType: employeeType,
                        sector: sector,
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
            const userData = await users.findByPk(dataId, {
                attributes: [
                    'id',
                    'name',
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
                    position: datas.position,
                    employeeType: datas.employee_type,
                    sector: datas.sector,
                    role: datas.role,
                    department: datas.department,
                    children: childrenData,
                };
                delete user.datas.employee_type;
                logger.info('Complete', { method, data: { userId } });
                res.status(200).json(user);
            } else {
                logger.info('Data not found', {
                    method,
                    data: { userId, dataId },
                });
                res.status(404).json({
                    message: `Data not found`,
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
        const child = req.body.child;
        delete req.body.child;
        const dataCreate = req.body;
        try {
            const result = await sequelize.transaction(async t => {
                const newItemUser = await users.create(dataCreate);
                var childData = child.map((childObj) => ({
                    users_id: newItemUser.id,
                    name: childObj.name,
                    birthday: childObj.birthDay,
                }));

                const newItemChild = await children.bulkCreate(childData);
                const itemsReturned = {
                    ...newItemUser.toJSON(),
                    child: newItemChild,
                };
                return itemsReturned;
            });
            res.status(201).json({ newItem: result, message: "สำเร็จ" });
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
        const child = req.body.child;
        delete req.body.child;
        const dataUpdate = req.body;
        const dataId = req.params['id'];
        try {
            const result = await sequelize.transaction(async t => {
                const [updated] = await users.update(dataUpdate, {
                    where: {
                        id: dataId,
                    },
                });
                if (Array.isArray(child) && child.length > 0) {
                    for (const c of child) {
                        await children.update(
                            {
                                name: c.name,
                                birthDay: c.birthDay,
                            },
                            {
                                where: {
                                    users_id: dataId,
                                    name: c.name,
                                },
                            }
                        );
                    }
                }
                return updated;
            });
            logger.info('Complete', { method, data: { userId } });
            res.status(201).json({ newItem: result, message: "สำเร็จ" });
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
                res.status(200).json({ updatedItem: updatedItem, message: "สำเร็จ" });
            } else {
                logger.info('Data not found', {
                    method,
                    data: { userId, dataId },
                });
                res.status(404).json({
                    message: `Data not found`,
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