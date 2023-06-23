// This file is to export the smart contract locally for the vue app to use
import Web3 from 'web3';

const contractAddress = "0x414Fbf17C7F94df4B1196553Ae1F6402CE766ECc";

//http provider shows vue which blockchain to target
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');

// passing provider to web3
const web3 = new Web3(provider);

// abi(Application Binary Interface) connects smart contract with the vue app
const abi = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }], "name": "UserRegistered", "type": "event" }, { "inputs": [], "name": "getUserCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getUserInfo", "outputs": [{ "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "email", "type": "string" }, { "internalType": "string", "name": "password", "type": "string" }], "name": "registerUser", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "userAddresses", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "users", "outputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "email", "type": "string" }, { "internalType": "string", "name": "password", "type": "string" }, { "internalType": "bool", "name": "registered", "type": "bool" }], "stateMutability": "view", "type": "function" }];


//local copy of the contract
const lcContract = new web3.eth.Contract(abi, contractAddress);

export default lcContract;