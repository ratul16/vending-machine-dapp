const VendingMachine = artifacts.require("VendingMachine");

contract('VendingMachine', function (accounts) {
  before(async () => {
    instance = await VendingMachine.deployed();
  });

  it("Should start with 100 donuts in the machine", async () => {
    let balance = await instance.getVendingMachineBalance();
    assert.equal(balance, 100, 'The initial amount should be 100 donuts');
  });

  it("ensures balance of the vending machine can be updated", async () => {
    await instance.restock(100);
    let balance = await instance.getVendingMachineBalance();
    assert.equal(balance, 200, 'The amount should be 200 donuts after restocking');
  });


  it("allows donuts to be purchased", async () => {
    await instance.purchase(1, { from: accounts[0], value: web3.utils.toWei('3', 'ether') });
    let balance = await instance.getVendingMachineBalance();
    assert.equal(balance, 199, 'The amount should be 199 donuts after purchase');
  });

});
