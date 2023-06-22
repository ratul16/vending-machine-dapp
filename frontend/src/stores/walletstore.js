import { defineStore } from "pinia";

export const useWalletStore = defineStore({
  id: "walletStore",
  state: () => ({
    connected: false,
    account: "",
    inventory: "",
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});
