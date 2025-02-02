const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const { initLogger } = require('./logger');
const logger = initLogger('App');

// middleware
const auth = require('./middleware/auth');

// router
const indexRouter = require('./routes/index');
const accountRouter = require('./routes/account');
const userRouter = require('./routes/user');
const subCategoryRouter = require('./routes/subCategory');
const categoryRouter = require('./routes/category');
const configWelfareRouter = require('./routes/configWelfare');
const logCategoryRouter = require('./routes/logCategory');
const logSubCategoryRouter = require('./routes/logSubCategory');
const departmentRouter = require('./routes/department');
const employeeTypeRouter = require('./routes/employeeType');
const postitionRouter = require('./routes/position');
const sectorRouter = require('./routes/sector');
const roleRouter = require('./routes/role');

var app = express();
app.set('trust proxy', true);
app.use(
    cors({
        origin: '*',
        exposedHeaders: ['Content-Disposition'],
    }),
);
app.use(
    morgan(
        (tokens, req, res) => {
            return [
                tokens['remote-addr'](req, res),
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, 'content-length'),
                '-',
                tokens['response-time'](req, res),
                'ms',
            ].join(' ');
        },
        { stream: { write: (message) => logger.info(message.trim()) } },
    ),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --- Map router ---
app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/user', auth, userRouter);
app.use('/sub-category', auth, subCategoryRouter)
app.use('/category', auth, categoryRouter)
app.use('/config-welfare', auth, configWelfareRouter)
app.use('/log-category', auth, logCategoryRouter)
app.use('/log-sub-category', auth, logSubCategoryRouter)
app.use('/sub-category', auth, subCategoryRouter);
app.use('/category', auth, categoryRouter);
app.use('/config-welfare', auth, configWelfareRouter);
app.use('/department', auth, departmentRouter);
app.use('/employee-type', auth, employeeTypeRouter);
app.use('/position', auth, postitionRouter);
app.use('/sector', auth, sectorRouter);
app.use('/role', auth, roleRouter);

// error handling
app.use((error, req, res, next) => {
    logger.error(`Internal Server Error: ${error.message}`);
    res.status(500).send('Internal Server Error');
});
app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});