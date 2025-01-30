const isNullOrEmpty = (value) => {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

const checkRequire = (fieldName, obj, errorObj) => {
    if (isNullOrEmpty(obj[fieldName])) {
        errorObj[fieldName] = `กรุณากรอก ${fieldName}`;
    }
};

const checkFilterNull = (whereObj, query) => {
    const whereObjCopy = { ...whereObj };

    for (const key in whereObjCopy) {
        if (isNullOrEmpty(query[key])) {
            delete whereObjCopy[key];
        }
    }

    return whereObjCopy;
};

module.exports = { isNullOrEmpty, checkFilterNull, checkRequire };