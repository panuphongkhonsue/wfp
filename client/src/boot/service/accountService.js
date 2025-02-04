import { api } from "../axios";

const path = "account";

export default {
    login(options) {
        return api.post(`${path}/login`, options);
    },
};