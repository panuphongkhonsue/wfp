const { initLogger } = require('../../logger');
const logger = initLogger('ExportHealthCreate');
var htmlToPdf = require("html-pdf-node");
const ejs = require("ejs");
const path = require('path');
require('dotenv').config();
const createPdfGeneral = async (req, res, next) => {
    const method = 'CreateGeneralData';
    const { id } = req.user;
    try {
        const cssData = await ejs.renderFile('./templateExport/template.css.ejs', {
            fontName: 'sarabun',
            fontBoldName: 'sarabun-bold',
            fontMediumName: 'sarabun-medium',
            fontSize: 14,
            textColor: '#333',
        });


        let options = { format: "A4", waitUntil: "networkidle0" , displayHeaderFooter : true };
        const html = await ejs.renderFile('./templateExport/generalExport.html.ejs',
            {
                body: req.body.datas,
                async: true,
                cssStyles: `<style>${cssData}</style>`,
            }
        )
        let file = { content: html };
        htmlToPdf.generatePdf(file, options).then((pdfBuffer) => {
            res.writeHead(200, {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="welfare_${req.body?.datas?.reimNumber}.pdf"`,
            }).end(pdfBuffer);
        })
        logger.info('Complete', { method, data: { id } });
    }
    catch (error) {
        logger.error(`Error ${error.message}`, {
            method,
            data: { id },
        });
        next(error);
    }
};

const createReceiptGeneral = async (req, res, next) => {
    const method = 'CreateReceiptData';
    const { id } = req.user;
    try {
        const cssData = await ejs.renderFile('./templateExport/template.css.ejs', {
            fontName: 'sarabun',
            fontBoldName: 'sarabun-bold',
            fontMediumName: 'sarabun-medium',
            fontSize: 14,
            textColor: '#333',
        });
        console.log("base : ", process.env.fileAccess + '/asset/fonts/Sarabun-Regular.ttf');
        let options = { format: "A4", waitUntil: "networkidle0" };
        const html = await ejs.renderFile('./templateExport/receiptExport.html.ejs',
            {
                body: req.body.datas,
                async: true,
                path: process.env.fileAccess,
                cssStyles: `<style>${cssData}</style>`,
            }
        )
        let file = { content: html };
        htmlToPdf.generatePdf(file, options).then((pdfBuffer) => {
            res.writeHead(200, {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${req.body.categoryId}_receipt_${req.body.reimNumber}.pdf"`,
            }).end(pdfBuffer);
        })
        logger.info('Complete', { method, data: { id } });
    }
    catch (error) {
        logger.error(`Error ${error.message}`, {
            method,
            data: { id },
        });
        next(error);
    }
};
module.exports = {
    createPdfGeneral,
    createReceiptGeneral
};