import { api } from "../axios";

const path = "log-category";

export default {
  addLogCategory(addData){
    return api.post(`${path}/`, addData)
  } 
};