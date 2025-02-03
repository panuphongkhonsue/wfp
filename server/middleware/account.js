const { initLogger } = require('../logger');
const {  checkRequire } = require('./utility');
const logger = initLogger('AccountMiddleware');

exports.validate = async (req, res, next) => {
    const method = 'Validate'
    const user = req.body;
    try {
        const errorObj = {};
        checkRequire('username', user, errorObj);
        checkRequire('password', user, errorObj);
        if (Object.keys(errorObj).length) return res.status(400).json({ errors: errorObj });
        else return next();
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { username } });
        next(error);
    }
};