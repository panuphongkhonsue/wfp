import { api } from "../axios";

const path = "reimbursement-children-education";

export default {
  list(options) {
    return api.get(`${path}/`, {
      params: options,
    });
  },
  delete(id) {
    try {
      return api.delete(`${path}/${id}`);
    }
    catch (error) {
      Promise.reject(error);
    }
  },
  create(payload) {
    try {
      return api.post(`${path}/`, payload);
    }
    catch (error) {
      Promise.reject(error);
    }
  },
  getSubCategories(options) {
    return api.get(`${path}/subCategories`, {
      params: options,
    });
  },
};