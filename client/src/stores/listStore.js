import { defineStore } from 'pinia'
import { parse, stringify } from 'zipson'
export const useListStore = defineStore('list', {
  state: () => ({
    itemPerPage: 10,
  }),
  actions: {
    setState(itemPerPage) {
      this.itemPerPage = itemPerPage;
    },
    getState() {
      return this.itemPerPage;
    },
  },
  persist: {
    serializer: {
      deserialize: parse,
      serialize: stringify
    }
  }
});
