import { api } from "../axios";

const path = "config-welfare";

export default {
  getConfigWelfare(configWelfare) {
    return api.get(`${path}/?configWelfare=${configWelfare.welfareId}&page=${configWelfare.page}&itemPerPage=${configWelfare.itemPerPage}`);
  }
};