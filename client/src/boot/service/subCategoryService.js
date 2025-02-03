import { api } from "../axios";

const path = "sub-category";

export default {
  getSubCategory() {
    return api.get(`${path}/`);
  }
  ,
  updateSubCategory(subCategoryId, updateData){
    return api.put(`${path}/${subCategoryId}`, updateData)
  }
};