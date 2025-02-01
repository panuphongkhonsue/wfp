import { defineStore } from 'pinia'
import { parse, stringify } from 'zipson'
export const useMenuStore = defineStore('menu', {
  state: () => ({
    isOpenMenu: true,
    path : null,
    pathEditor : null,
  }),
  actions: {
    setState(isOpenMenu) {
      this.isOpenMenu = isOpenMenu;
    },
    setPath(path){
      this.path = path;
    },
    setPathEditor(pathEditor){
      this.pathEditor = pathEditor;
    },
    getState() {
      return this.isOpenMenu;
    },
    clearState(){
      this.isOpenMenu = null;
      this.path = null;
      this.pathEditor = null;
    },
  },
  persist: {
    serializer: {
      deserialize: parse,
      serialize: stringify
    }
  }
});
