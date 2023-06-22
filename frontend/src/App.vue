<template>
  <div id="app">
    <!-- <header>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/vending-machine">Vending Machine</router-link>
      </nav>
    </header> -->
    <router-view />
  </div>
</template>

<script setup>
// import Web3 from "web3";
</script>

<style lang="css" scoped>
header {
  border: 1px solid white;
}
nav {
  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 16px;
  text-align: center;
  margin: 15px auto;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
