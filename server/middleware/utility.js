const { Op, literal } = require("sequelize");
const isNullOrEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};


const checkRequire = (fieldName, obj, errorObj) => {
  if (isNullOrEmpty(obj[fieldName])) errorObj[fieldName] = `${fieldName} is require`;
};

const getFiscalYear = () => {
  return {
    [Op.between]: [
      literal(`
              CASE 
                WHEN MONTH(CURDATE()) >= 10 
                THEN DATE_FORMAT(CURDATE(), '%Y-10-01') 
                ELSE DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 YEAR), '%Y-10-01') 
              END
            `),
      literal(`
              CASE 
                WHEN MONTH(CURDATE()) >= 10 
                THEN DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 YEAR), '%Y-09-30') 
                ELSE DATE_FORMAT(CURDATE(), '%Y-09-30') 
              END
            `)
    ]
  }
}
const getYear2Digits = () => {
  const getThaiYear = (year) => (year + 543).toString().slice(-2);

  const thisYear = new Date().getFullYear(); // 2025
  const thaiYearShort = getThaiYear(thisYear); // "68"
  return thaiYearShort;
}
const formatNumber = (num) => num.toString().padStart(2, "0");
const isInvalidNumber = (value) => isNaN(value) || value === "" || value === null;
module.exports = { isNullOrEmpty, checkRequire, getFiscalYear, getYear2Digits, formatNumber, isInvalidNumber };