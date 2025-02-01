import { api } from "../axios";

const path = "config-welfare";

export default {
  getConfigWelfare(configWelfare) {
    console.log(`${path}/?configWelfare=${configWelfare.welfareId}&page=${configWelfare.page}&itemPerPage=${configWelfare.itemPerPage}`)
    return api.get(`${path}/?configWelfare=${configWelfare.welfareId}&page=${configWelfare.page}&itemPerPage=${configWelfare.itemPerPage}`);
  }
};