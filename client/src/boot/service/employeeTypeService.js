import { api } from "../axios";

const path = "employee-type";

export default {
  list() {
    return api.get(`${path}/`);
  },
};
