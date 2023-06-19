<template>
  <div class="container vending-machine">
    <div class="header">
      <h1>Vending Machine</h1>
      <!-- <h4 v-if="connected">{{ contractResult }}</h4> -->
      <div class="metamask-container">
        <button type="button" class="btn btn-success" @click="connectWallet">
          {{ connected ? "Wallet Connected" : "Connect Wallet" }}
        </button>
      </div>
    </div>
    <div class="body">
      <p>Account: {{ connected ? accountAddress : "Wallet not Connected" }}</p>

      <p>Vending Machine Balance: {{ inventory }}</p>
      <p>
        User Donut Balance:
        {{ connected ? userInventory : "Wallet not Connected" }}
      </p>
    </div>
    <div class="mb-3 d-inline">
      <label for="amount" class="form-label">Amount of Donuts</label>
      <input
        v-model="purchaseAmount"
        type="amount"
        class="form-control"
        id="amount"
      />
      <button type="button" class="btn btn-warning mt-2" @click="purchaseDonut">
        Purchase
      </button>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import lcContract from "../../blockchain/vending";

export default {
  name: "VendingMachine",
  data() {
    return {
      connected: false,
      accountAddress: "",
      inventory: "",
      userInventory: "",
      purchaseAmount: 0,
      // web3: new Web3(window.ethereum),
    };
  },
  mounted() {
    this.getInventory();
  },
  methods: {
    connectWallet() {
      if (window.ethereum) {
        //meta mask installed
        let web3 = new Web3(window.ethereum);
        this.getUserInventory(web3);
        this.purchaseDonut(web3);
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res) => {
            this.connected = true;
            this.accountAddress = res[0];
          })
          .catch((err) => {
            alert(err.message);
          });
      } else {
        alert("Install Metamask");
      }
    },
    async getInventory() {
      const inventoryBalance = await lcContract.methods
        .getVendingMachineBalance()
        .call();
      this.inventory = inventoryBalance;
    },
    async getUserInventory(state) {
      const accounts = await state.eth.getAccounts();
      this.userInventory = await lcContract.methods
        .donutBalances(accounts[0])
        .call();
    },
    async purchaseDonut(state) {
      const accounts = await state.eth.getAccounts();
      const buy = await lcContract.methods.purchase(this.purchaseAmount).send({
        from: accounts[0],
      });
    },
  },
};
</script>

<style lang="css" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  margin: 0 0 10px 0;
  border-bottom: 1px solid white;
}
</style>
