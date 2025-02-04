import { api } from "../axios";

const path = "role";

export default {
  list() {
    return api.get(`${path}/`);
  },
};
