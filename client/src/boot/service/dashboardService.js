import { api } from "../axios";

const path = "dashboard";

export default {
  getDashboardData(options) {
    return api.get(`${path}/report/report-compare-expense`, {
      params: options,
    });
  },
  getDashboardDataPersonal(options) {
    return api.get(`${path}/report/report-personal`, {
      params: options,
    });
  },
  getDashboardDataFundRequestPerYear(options) {
    return api.get(`${path}/report/report-fund-request-per-year`, {
      params: options,
    });
  },
  getDashboardDataFundRequestPerYearEachType(options) {
    return api.get(`${path}/report/report-fund-request-per-year-each-type`, {
      params: options,
    });
  },
};