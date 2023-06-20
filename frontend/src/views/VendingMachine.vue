<template>
  <div class="container vending-machine">
    <div class="header">
      <h1>Vending Machine</h1>
      <div class="metamask-container">
        <button type="button" class="btn btn-success" @click="connectWallet">
          {{ connected ? "Wallet Connected" : "Connect Wallet" }}
        </button>
      </div>
    </div>
    <div class="body">
      <div class="row">
        <div class="col-md-6 mb-2">
          <div class="info-box shadow-sm">
            <h6>Account</h6>
            <p>{{ connected ? account[0] : "Wallet not connected !" }}</p>
          </div>
        </div>
        <div class="col-md-3 mb-2">
          <div class="info-box shadow-sm d-flex justify-content-between">
            <h6>Available Donut</h6>
            <span>{{ inventory }}</span>
          </div>
        </div>
        <div class="col-md-3 mb-2">
          <div class="info-box shadow-sm d-flex justify-content-between">
            <h6>User Donut</h6>
            <span>{{ connected ? userInventory : 0 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <div class="info-box shadow-sm justify-content-between">
        <h6>Buy Donut</h6>
        <label for="amount" class="form-label">Amount of Donuts</label>
        <div class="input-group">
          <input
            v-model="donutAmount"
            type="number"
            class="form-control"
            placeholder="Enter amount of donuts to buy"
          />
          <button
            class="btn btn-outline-primary"
            type="button"
            id="button-addon2"
            @click="purchaseDonut"
          >
            Buy Donuts
          </button>
        </div>
      </div>
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
      account: [],
      inventory: "",
      userInventory: "",
      donutAmount: 0,
      web3: null,
    };
  },
  mounted() {
    this.getInventory();
  },
  methods: {
    async connectWallet() {
      if (window.ethereum) {
        //meta mask is installed
        //set web3 instance
        this.web3 = new Web3(
          new Web3.providers.HttpProvider("http://127.0.0.1:7545")
        );

        //set account address
        this.account = await this.web3.eth.getAccounts();

        // connecting with metamask
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then(() => {
            this.connected = true;
            this.getUserInventory();
          })
          .catch((err) => {
            alert(err.message);
          });
      } else {
        //meta mask is not installed
        alert("Install Metamask");
      }
    },
    async getInventory() {
      const inventoryBalance = await lcContract.methods
        .getVendingMachineBalance()
        .call();
      this.inventory = inventoryBalance;
    },
    async getUserInventory() {
      this.userInventory = await lcContract.methods
        .donutBalances(this.account[0])
        .call();
    },
    async purchaseDonut() {
      await lcContract.methods
        .purchase(this.donutAmount)
        .send({
          from: this.account[0],
          value: this.web3.utils.toWei("2", "ether") * this.donutAmount,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          this.donutAmount = 0;
          this.getUserInventory();
          this.getInventory();
        })
        .catch((err) => {
          console.log(err);
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

.info-box {
  width: 100%;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #c5c5c5;
  /* box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15); */
}

.info-box p {
  margin: 0;
}

.info-box span {
  font-size: 32px;
  font-weight: 500;
}
</style>
