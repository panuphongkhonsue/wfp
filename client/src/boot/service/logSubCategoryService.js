import { api } from "../axios";

const path = "log-sub-category";

export default {
  addLogSubCategory(addData){
    console.log(addData)
    return api.post(`${path}/`, addData)
  } 
};