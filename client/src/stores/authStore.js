import { defineStore } from 'pinia'
import { parse, stringify } from 'zipson'
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    isAdmin: false,
    redirectTo: null,
    name: null,
    position: null,
    externalEmail : null,
    roleId : null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    clearToken() {
      this.token = null;
      this.isAdmin = false;
      this.redirectTo = null;
      this.name = null;
      this.position = null;
      this.externalEmail = null;
      this.roleId = null;
    },
  },
  getters: {
    isLoggedIn: (state) => state.token != null,
  },
  persist: {
    serializer: {
      deserialize: parse,
      serialize: stringify
    }
  }
});
