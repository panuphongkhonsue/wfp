import { api } from "../axios";

const path = "sector";

export default {
  list() {
    return api.get(`${path}/`);
  },
};
