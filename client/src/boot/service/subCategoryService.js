import { api } from "../axios";

const path = "sub-category";

export default {
  getSubCategory() {
    return api.get(`${path}/`);
  }
};