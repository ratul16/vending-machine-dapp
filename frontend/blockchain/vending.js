// This file is to export the smart contract locally for the vue app to use
import Web3 from 'web3';

const contractAddress = "0x3D464a596860De4ea21Ce1602bD6820C660Cc3Db";

//http provider shows vue which blockchain to target
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');

// passing provider to web3
const web3 = new Web3(provider);

// abi(Application Binary Interface) connects smart contract with the vue app
const abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "donutBalances", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getVendingMachineBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "purchase", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "restock", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];


//local copy of the contract
const lcContract = new web3.eth.Contract(abi, contractAddress);

export default lcContract;