import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/authStore';
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const baseURL = process.env.PRODUCTION
  ? "http://localhost:3000/"
  : "http://localhost:3000/";

const api = axios.create({ baseURL });

export default defineBoot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  // for use inside Vue files (Options API) through this.$axios and this.$api
  //config.headers["Authorization"] = `Bearer ${authStore.token}`;
  api.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      if (authStore.token)
        config.headers["Authorization"] = `Bearer ${authStore.token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      const authStore = useAuthStore();
      if (error?.response?.status === 401 || error?.response?.status === 440) {
        authStore.clearToken();
        router.push({
          name: "login",
        });
      }
      else {
        return Promise.reject(error);
      }
    }
  );
  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
