import { api } from "../axios";

const path = "log-sub-category";

export default {
  addLogSubCategory(addData){
    return api.post(`${path}/`, addData)
  }
};
