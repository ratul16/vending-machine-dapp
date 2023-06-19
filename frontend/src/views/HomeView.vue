<template>
  <div class="home">
    <h1>Connect To MetaMask</h1>
    <h4 v-if="connected">{{ contractResult }}</h4>
    <div class="metamask-container">
      <button class="metamask-btn" @click="connectWallet">Connect</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",

  data() {
    return {
      connected: false,
      contractResult: "Address of the wallet",
    };
  },
  methods: {
    connectWallet() {
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res) => {
            this.connected = true;
            console.log(res[0]);
            this.contractResult = res[0];
          });
      }
    },
  },
};
</script>

<style lang="css" scoped>
.metamask-container {
  margin: 0 auto;
}

.metamask-btn {
  background: rgb(245, 179, 12);
  color: #333;
  padding: 10px 25px;
  border-radius: 5px;
  border: none;
}
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

