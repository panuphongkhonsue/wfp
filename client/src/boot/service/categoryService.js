import { api } from "../axios";

const path = "category";

export default {
  getCategory() {
    return api.get(`${path}/`);
  }
};