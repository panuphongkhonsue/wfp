import { defineStore } from 'pinia'
import { parse, stringify } from 'zipson'
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    name: null,
    position: null,
    roleId: null,
    email: null,
    department: null,
    roleName: null,
    id: null,
    isEditor: null,
    isStaff : null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    clearToken() {
      this.token = null;
      this.name = null;
      this.position = null;
      this.roleId = null;
      this.email = null;
      this.department = null;
      this.id = null;
      this.RoleName = null;
      this.isEditor = null;
      this.isStaff = null;
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
