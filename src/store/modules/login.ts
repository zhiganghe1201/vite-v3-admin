import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
    doublePlusOne() {
      return this.doubleCount + 1;
    },
  },
});
