import { api } from "../axios";

const path = "category";

export default {
  getCategory() {
    return api.get(`${path}/`);
  }
  ,
  updateCategory(id, updateData){
    return api.put(`${path}/${id}`, updateData);
  }
};