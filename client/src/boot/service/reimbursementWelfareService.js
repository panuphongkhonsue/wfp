import { api } from "../axios";

const path = "reimbursement-welfare";

export default {
  getReimbursementWelfare(reimbursementWelfare) {
    return api.get(`${path}/`, {
          params: reimbursementWelfare,
        });
  }
};