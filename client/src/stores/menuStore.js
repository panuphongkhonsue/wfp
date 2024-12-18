import { defineStore } from 'pinia'
import { parse, stringify } from 'zipson'
export const useMenuStore = defineStore('menu', {
  state: () => ({
    menu: true,
  }),
  actions: {
    setState(menu) {
      this.menu = menu;
    },
    getState() {
      return this.menu;
    },
  },
  persist: {
    serializer: {
      deserialize: parse,
      serialize: stringify
    }
  }
});
