import { api } from "../axios";

const path = "user";

export default {
  list(options) {
    return api.get(`${path}/`, {
      params: options,
    });
  },
  dataById(id) {
    return api.get(`${path}/${id}`);
  },
  create(payload) {
    try {
      return api.post(`${path}/`, payload);
    }
    catch (error) {
      Promise.reject(error);
    }
  },
  update(id, options) {
    try {
      return api.put(`${path}/${id}`, options);
    }
    catch (error) {
      Promise.reject(error);
    }
  },
};
