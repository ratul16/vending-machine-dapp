<template>
  <div class="container user">
    <h1>User Registration</h1>
    <div class="row">
      <div class="col-md-6 mb-2">
        <div
          class="alert"
          :class="connected ? 'alert-success' : 'alert-danger'"
          role="alert"
        >
          Wallet Status :
          <strong>{{ connected ? "Connected" : "Disconnected" }}</strong>
        </div>
        <div class="col-md-12 mb-2">
          <div class="d-flex justify-content-between shadow-sm p-2">
            <h6>Number of Users</h6>
            <p class="h1">{{ userCount }}</p>
          </div>
        </div>
        <div class="col-md-12 mb-2" v-if="isUserRegistered">
          <div class="d-flex justify-content-between shadow-sm p-2">
            <h6>User Status</h6>
            <p
              class="h1"
              :class="isUserRegistered ? 'text-success' : 'text-danger'"
            >
              {{ isUserRegistered ? "Registered" : "Not registered" }}
            </p>
          </div>
        </div>
        <div class="col-md-12 mb-2" v-if="isUserRegistered">
          <div class="shadow-sm p-4">
            <h6>User Information</h6>
            <p>
              <strong>Name :</strong> {{ userInfo.name }} <br />
              <strong> Email :</strong> {{ userInfo.email }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-2">
        <div class="registration-form shadow px-4 py-5 rounded">
          <div class="mb-3">
            <div class="col-md-12 mb-2">
              <label class="form-label">Full Name</label>
              <input v-model="name" type="text" class="form-control" />
            </div>

            <div class="col-md-12 mb-2">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" />
            </div>

            <div class="col-md-12 mb-2">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" />
            </div>
          </div>
          <div class="col-12">
            <button
              type="submit"
              class="btn btn-primary px-5"
              :disabled="isUserRegistered"
              @click="registerUser"
            >
              Register
            </button>
          </div>
        </div>
        <div
          v-if="isMessageVisible"
          class="mt-4 alert"
          :class="messageStatus"
          role="alert"
        >
          User registered successfully!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
// import contractABI from "@/contractABI.json";
import lcContract from "../../blockchain/register";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      userCount: 0,
      connected: false,
      isUserRegistered: false,
      userInfo: {},
      message: "",
      messageStatus: "",
      isMessageVisible: false,
    };
  },
  created() {
    if (typeof window.ethereum !== "undefined") {
      this.checkUserRegistration();
      // this.contract = lcContract;
      this.connected = true;
    } else {
      console.error("Web3 is not available. Please install MetaMask!");
    }
  },
  methods: {
    async registerUser() {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const user = accounts[0];

        const gasEstimate = await lcContract.methods
          .registerUser(this.name, this.email, this.password)
          .estimateGas({ from: user });
        const gasLimit = Math.floor(gasEstimate * 1.2);

        await lcContract.methods
          .registerUser(this.name, this.email, this.password)
          .send({ from: user, gas: gasLimit })
          .once("receipt", (receipt) => {
            console.log(receipt);
          });

        this.toastNotification(
          "alert-success",
          "User registered successfully!"
        );
        this.checkUserRegistration();
      } catch (error) {
        console.log(error);
        this.toastNotification("alert-danger", "User Already registered!");
      }
    },
    async checkUserRegistration() {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const user = accounts[0];

        //fetching register user count from the blockchain
        this.userCount = await lcContract.methods.getUserCount().call();
        const userDetails = await lcContract.methods.getUserInfo(user).call();

        //check is the user is registered or not
        this.isUserRegistered =
          Object.keys(userDetails).length === 0 ? false : true;
        this.userInfo = {
          name: userDetails[0],
          email: userDetails[1],
        };
      } catch (error) {
        // console.error("Error checking user registration:", error);
        this.toastNotification("alert-danger", "User Already registered!");
      }
    },
    toastNotification(status, msg) {
      this.message = msg;
      this.messageStatus = status;
      this.isMessageVisible = true;
      setTimeout(() => {
        this.isMessageVisible = false;
        this.message = "";
      }, 3000);
    },
  },
};
</script>

<style lang="css" scoped>
.user {
  margin: 20px auto;
}
.user h1 {
  text-align: center;
  margin-bottom: 40px;
}
/* .registration-form {
  margin: 0 auto;
  max-width: 500px;
} */
</style>
