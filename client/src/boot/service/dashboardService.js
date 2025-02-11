import { api } from "../axios";

const path = "dashboard";

export default {
  getDashboardData(options) {
    return api.get(`${path}/report-compare-expense`, {
      params: options,
    });
  },
};