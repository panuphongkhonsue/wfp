import { api } from "../axios";

const path = "dashboard";

export default {
  getDashboardData() {
    return api.get(`${path}/`);
  }
};