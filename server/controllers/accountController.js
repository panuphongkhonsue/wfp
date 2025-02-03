const { users, positions, departments, roles, sector, sequelize, permissionsHasRoles } = require('../models/mariadb');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ActiveDirectory = require('activedirectory');

const { initLogger } = require('../logger');
const logger = initLogger('AccountController');
const { getpathMenu, getpathMenuEditor } = require('../enum/format');

exports.login = async (req, res, next) => {
    const method = 'Login';
    const { username, password } = req.body;
    try {
        const userData = await users.findOne({
            where: { username },
            attributes: [
                'id',
                'name',
                'password',
                'email',

            ],
            include: [
                {
                    model: positions, as: 'position',
                    attributes: ['name'], required: false
                },
                {
                    model: departments, as: 'department',
                    attributes: ['name'], required: false
                },
                {
                    model: roles, as: 'role',
                    attributes: ['id', 'name'], required: false
                },
                {
                    model: sector, as: 'sector',
                    attributes: ['name'], required: false
                },
            ]
        });
        if (userData) {
            var user = userData.get();
            let passwordIsValid = false;
            if (user.password === null) {
                try {
                    passwordIsValid = await this.loginLdap(username, password);
                } catch (error) {
                    logger.info('Login Ldap is not completed', { method, data: { username } });
                    return res.status(400).send({
                        message: error,
                    });
                }
            }
            else {
                passwordIsValid = await bcrypt.compare(
                    password,
                    user.password
                );
            }
            if (passwordIsValid) {
                delete user.password;
                const role = user?.role;
                const positions = user?.position?.name;
                const department = user?.department?.name;
                const sector = user?.sector.name;
                user.roleId = role?.id ? role.id : null;
                user.position = positions;
                user.department = department;
                user.sector = sector;
                delete user.role;
                const token = jwt.sign(
                    {
                        user,
                        role: role?.get(),
                    },
                    process.env.secretKey,
                    {
                        expiresIn: '1d',
                    }
                );
                const userPermission = await permissionsHasRoles.findAll(
                    {
                        where: { roles_id: user.roleId },
                        attributes: ['permissions_id'],
                    }
                );
                const path = [
                    {
                        title: "หน้าหลัก",
                        icon: "outlinedHome",
                        to: "home",
                    },
                    ...userPermission.map((userObj) => getpathMenu(userObj)).filter((result) => result !== null && result !== undefined)
                ];
                const pathEditor = userPermission.map((userObj) => getpathMenuEditor(userObj)).filter((result) => result !== null && result !== undefined);
                user.path = path;
                if (pathEditor) user.pathEditor = pathEditor;
                logger.info('Complete', { method, data: { username } });
                return res.status(200).send({ user, accessToken: token });
            }
            logger.info('Password is Incorrect', {
                method,
                data: { username },
            });
        }
        logger.info('User not found', { method, data: { username } });
        return res.status(400).send({
            message: 'กรุณากรอกบัญชีผู้ใช้งานและรหัสผ่านให้ถูกต้อง',
        });
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { username } });
        next(error);
    }
};

exports.loginLdap = (username, password) => {
    return new Promise((resolve, reject) => {
        const config = {
            url: process.env.adUrl,
            baseDN: process.env.baseDN,
        };
        const ad = new ActiveDirectory(config);

        ad.authenticate(`${username}@buu.ac.th`, password, (error, auth) => {
            if (error) reject(error.message);
            if (auth) resolve(true);
        });
    });
}