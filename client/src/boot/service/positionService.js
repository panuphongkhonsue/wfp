import { api } from "../axios";

const path = "position";

export default {
  list() {
    return api.get(`${path}/`);
  },
};
