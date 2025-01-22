import { defineStore } from 'pinia'
import { parse, stringify } from 'zipson'
export const useMenuStore = defineStore('menu', {
  state: () => ({
    isOpenMenu: true,
  }),
  actions: {
    setState(isOpenMenu) {
      this.isOpenMenu = isOpenMenu;
    },
    getState() {
      return this.isOpenMenu;
    },
    clearState(){
      this.isOpenMenu = null;
    },
  },
  persist: {
    serializer: {
      deserialize: parse,
      serialize: stringify
    }
  }
});
