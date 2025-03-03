import { api } from "../axios";

const path = "export";

export default {
  async healthCheckup(id) {
    try {
      const response = await api.get(`${path}/health-check-up/${id}`, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async medical(id) {
    try {
      const response = await api.get(`${path}/medical/${id}`, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async dental(id) {
    try {
      const response = await api.get(`${path}/dental/${id}`, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async various(id) {
    try {
      const response = await api.get(`${path}/various/${id}`, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async variousFuneralFamily(id) {
    try {
      const response = await api.get(`${path}/various-Funeral-Family/${id}`, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async funeralDeceaseEmployee(id) {
    try {
      const response = await api.get(`${path}/funeral-Decease-Employee/${id}`, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
