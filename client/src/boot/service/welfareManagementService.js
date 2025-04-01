import { api } from "../axios";


export default {
    dataHealthCheckUpById(id) {
        return api.get(`health-check-up-welfare/get-welfare/${id}`);
    },

    updateHealthCheckUp(id, options) {
        try {
            return api.put(`health-check-up-welfare/update-welfare/${id}`, options);
        }
        catch (error) {
            Promise.reject(error);
        }
    },
    dataMedicalById(id) {
        return api.get(`medical-welfare/get-welfare/${id}`);
    },
    updateMedical(id, options) {
        try {
            return api.put(`medical-welfare/update-welfare/${id}`, options);
        }
        catch (error) {
            Promise.reject(error);
        }
    },
    dataDentalById(id) {
        return api.get(`dental-welfare/get-welfare/${id}`);
    },
    updateDental(id, options) {
        try {
            return api.put(`dental-welfare/update-welfare/${id}`, options);
        }
        catch (error) {
            Promise.reject(error);
        }
    },
    dataFuneralById(id) {
        return api.get(`funeral-welfare/get-welfare/${id}`);
    },
    updateFuneral(id, options) {
        try {
            return api.put(`funeral-welfare/update-welfare/${id}`, options);
        }
        catch (error) {
            Promise.reject(error);
        }
    },
    dataFamilyFuneralById(id) {
        return api.get(`various-welfare-funeral-family/get-welfare/${id}`);
    },
    updateFamilyFuneral(id, options) {
        try {
            return api.put(`various-welfare-funeral-family/update-welfare/${id}`, options);
        }
        catch (error) {
            Promise.reject(error);
        }
    },
    dataVariousById(id) {
        return api.get(`various-welfare/get-welfare/${id}`);
    },
    updateVarious(id, options) {
        try {
            return api.put(`various-welfare/update-welfare/${id}`, options);
        }
        catch (error) {
            Promise.reject(error);
        }
    },

    dataChildrenById(id) {
        return api.get(`reimbursement-children-education/get-welfare/${id}`);
    },
    updateChildren(id, options) {
        try {
            return api.put(`reimbursement-children-education/update-welfare/${id}`, options);
        }
        catch (error) {
            Promise.reject(error);
        }
    },
    getLastShcoolNameEditor(options) {
        return api.get(`reimbursement-children-education/get-latest-school/latest-school`, {
          params: options,
        });
    },
};
