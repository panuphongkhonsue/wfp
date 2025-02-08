import { api } from "../axios";

const path = "reimbursement-welfare";

export default {
  getReimbursementWelfare(reimbursementWelfare) {
    console.log("reimbursementWelfare.welfareName : ", reimbursementWelfare.welfareName);
    return api.get(`${path}/?keyword=${reimbursementWelfare.keyword}&welfareName=${reimbursementWelfare.welfareName}
      &statusName=${reimbursementWelfare.statusName}&page=${reimbursementWelfare.page}&itemPerPage=${reimbursementWelfare.itemPerPage}`);
  }
};