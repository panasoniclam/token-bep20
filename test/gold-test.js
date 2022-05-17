const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20-BEP20", function () {
    let [accountA, accountB, accountC] = []
    let token
    let amount = 100
    let address0 = "0x0000000000000000000000000000000000000000"
    let totalSupply = 1000000
    beforeEach(async () => {
        [accountA, accountB, accountC] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Gold");
        token = await Token.deploy()
        await token.deployed()
    })
    describe("common", function () {
        it("total supply should return right value", async function () {
            expect(await token.totalSupply()).to.be.equal(totalSupply)
        });
        it("balance of account A should return right value", async function () {
            expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply)
        });
        it("balance of account B should return right value", async function () {
            expect(await token.balanceOf(accountB.address)).to.be.equal(0)
        });
        it("allowance of account A should return right value", async function () {
            expect(await token.allowance(accountA.address, accountB.address)).to.be.equal(0)
        });

    })
    describe("transfer()", function () {
        it("transfer should revert if amount exceeds balance", async function () {
            await expect(token.transfer(accountB.address, totalSupply + 1)).to.be.revertedWith("ERC20: transfer amount exceeds balance")
        });
        it("transfer should work correctly", async function () {
            let transferTx = await token.transfer(accountB.address, amount)
            expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply - amount)
            expect(await token.balanceOf(accountB.address)).to.be.equal(amount)
            await expect(transferTx).to.emit(token, 'Transfer').withArgs(accountA.address, accountB.address, amount)
        });

    })
    describe("pause()", function(){
       it("should revert if not pauser role", async function(){
           await expect(token.connect(accountB).pause()).to.be.reverted 
       });
       it("should revert if contract has been pause" ,async function(){
           await token.pause();
           await expect(token.pause()).to.be.reverteWith("Pausable:paused");
       });
       it("should pause contract correctly", async function(){
        const pauseTx = await token.pause();
        await expect(pauseTx).to.be.emit(token,"Paused").withArgs(accountA.address)
        await expect(token.transfer(accountB.address, amount)).to.be.revertedWith("Paused:pause")
    });
    }) 
    describe("unpause()", function(){
       beforeEach(async ()=>{
        await token.pause();
       })
       it("should revert if not pauser tole", async function(){
         await expect(token.connect(accountB).unpause()).to.be.reverted
      })
       it("should revert if contract ha been unpause", async function(){
           await token.unpause()
           await expect(token.unpause()).to.be.reverteWith("Pausable: not pause")
       })
       it("should pause contract correctly", async function(){
           const unpauseTx  = await token.unpause()
           await expect(unpauseTx).to.be.emit(token,"Unpause").withArgs(accountA.address);
           let transferTx = await token.transfer(accountB.address, amount)
           await expect(transferTx).to.emit(token,"Transfer").withArgs(accountA.address, accountB.address, amount);
       })
    })

    describe("addToBlacklist()", function(){

      it("should revert in case add sender to blacklist", async function(){
          await expect(token.addToBlacklist(accountB.address)).to.be.revertedWith("Gold: must not add sender to blacklist")
      })
      it("should revert if account has been added to blacklist " ,async function(){
          await token.addToBlacklist(accountB.address);
          await expect(token.addToBlacklist(account.address)).to.be.revertedWith("Gold: account has added blacklist")
      })
      it("should revert if not admin role", async function(){
          await expect(token.connect(accountB.address).addToBlacklist(accountC.address)).to.be.reverted
      })
      it("shoule add to Blacklist correctly", async  function(){
          token.transfer(accountB.address, amount)
          token.transfer(accountC.address, amount)
          await token.addToBlacklist(accountB.address)
          await expect(token.connect(accountB).transfer(accountC.address,amount)).to.be.revertedWith("Gold")
          await expect(token.connect(accountC).transfer(accountB.address,amount)).to.be.revertedWith("Gold")
      })
    })
    describe("removeFromBlacklist()", function(){
        beforeEach(async ()=>{
            token.transfer(accountB.address, amount)
            token.transfer(accountC.address, amount)
            await token.addToBlacklist(accountB.address)
        })
        it("should revert if account has not been added to blacklist", async function(){
            await token.removeFromBlacklist(accountB.address)
            await expect(token.removeFromBlacklist(accountB.address)).to.be.revertedWith("Gold: account has not been added to blacklist")

        })
        it("should revert if not admin role", async function(){
            await expect(token.connect(accountB.address).removeFromBlacklist(accountC.address)).to.be.reverted
        })
        it("shoule  remove from Blacklist correctly", async  function(){
           
            await token.removeFromBlacklist(accountB.address)
            let transferTx  = await token.transfer(accountB.address, amount)
            await expect(transferTx).to.emit(token, 'transfer').withArgs(accountA.address, accountB.address, amount)
        })
    })
}); 