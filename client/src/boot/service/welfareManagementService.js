import { api } from "../axios";

const path = "health-check-up-welfare";

export default {
    dataFinancialById(id) {
        return api.get(`${path}/get-welfare/${id}`);
    },

    update(id, options) {
        try {
            return api.put(`${path}/update-welfare/${id}`, options);
        }
        catch (error) {
            Promise.reject(error);
        }
    },
};
