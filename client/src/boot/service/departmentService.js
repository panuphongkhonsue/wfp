import { api } from "../axios";

const path = "department";

export default {
  list() {
    return api.get(`${path}/`);
  },
};
