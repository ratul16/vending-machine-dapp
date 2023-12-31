<template>
  <div class="container vending-machine">
    <div class="header">
      <h1>Vending Machine</h1>
      <div class="metamask-container">
        <button type="button" class="btn btn-success" @click="connectWallet">
          {{ connected ? "Connected" : "Connect Wallet" }}
        </button>
      </div>
    </div>
    <div class="body">
      <div class="row">
        <div class="col-md-6 mb-2">
          <div class="info-box shadow-sm">
            <h6>Account</h6>
            <p>{{ connected ? account : "Wallet not connected !" }}</p>
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
      <hr />
      <div class="transaction-history" v-if="transactionList.length">
        <table class="table table-striped table-hover">
          <thead class="sticky-header">
            <tr>
              <th>Block No.</th>
              <th>Hash</th>
              <th>From</th>
              <th>Ether</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in transactionList.slice().reverse()" :key="tx.hash">
              <td>{{ tx.blockNumber }}</td>
              <td>{{ tx.hash }}</td>
              <td>{{ tx.from }}</td>
              <td>{{ tx.value }}</td>
            </tr>
          </tbody>
        </table>
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
      account: "",
      inventory: "",
      userInventory: "",
      donutAmount: 0,
      transactionList: [],
    };
  },
  mounted() {
    // this.getInventory();
    // this.getTransactionHistory();
  },
  methods: {
    connectWallet() {
      if (window.ethereum) {
        //meta mask installed
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res) => {
            this.connected = true;
            this.account = res[0];
            this.getUserInventory();
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
    async getUserInventory() {
      this.userInventory = await lcContract.methods
        .donutBalances(this.account)
        .call();
    },
    async purchaseDonut() {
      await lcContract.methods
        .purchase(this.donutAmount)
        .send({
          from: this.account,
          value: Web3.utils.toWei("2", "ether") * this.donutAmount,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          this.donutAmount = 0;
          this.getUserInventory();
          this.getInventory();
          this.getTransactionHistory();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getTransactionHistory() {
      try {
        const web3 = new Web3(
          new Web3.providers.HttpProvider("http://127.0.0.1:7545")
        );
        const latestBlockNumber = await web3.eth.getBlockNumber();
        const transactionHistory = [];

        // Iterate through the blocks to get the transactions
        for (let i = 0; i <= latestBlockNumber; i++) {
          const block = await web3.eth.getBlock(i, true);

          if (block && block.transactions) {
            block.transactions.forEach((tx) => {
              const transaction = {
                blockNumber: block.number,
                hash: tx.hash,
                from: tx.from,
                value: web3.utils.fromWei(tx.value, "ether"),
              };

              transactionHistory.push(transaction);
            });
          }
        }
        this.transactionList = transactionHistory;
      } catch (error) {
        console.error("Error getting transaction history:", error);
      }
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

.transaction-history {
  max-height: 400px;
  overflow-y: auto;
}

.transaction-history .sticky-header {
  position: sticky;
  top: 0;
  background-color: #cae5ff;
  z-index: 1;
}
</style>
