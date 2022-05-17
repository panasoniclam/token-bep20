const { expect } = require("chai");
const { ethers } = require("hardhat");

// describe("Hello word", function () {
//  const message = "hello word"
//  const secondMessage  ="second message"
//  it('should return message is correctly!', async function(){
//    const Helloword = await ethers.getContractFactory('HelloWord');
//    const helloword = await Helloword.deploy(message)
//    await helloword.deployed()
//    expect(await helloword.getMessage()).to.be.equal(message)
//    await helloword.setMessage(secondMessage)
//    expect(await helloword.getMessage()).to.be.equal(secondMessage)
//  })
// });

describe('Interger', function(){
  const message = 1;
  it('should return message is correctly!', async function(){
    const Contract = await ethers.getContractFactory('myInterger')
    const contract  = await Contract.deploy(message)
    await contract.deployed()
    expect(await contract.getNumber()).to.be.equal(1);
  })
})

describe('Boolean', function(){
  const message  = false ;
  it('should return message is  correctly!', async function(){
    const Contract = await ethers.getContractFactory('MyBoolean')
    const contract  = await Contract.deploy(message);
    await contract.deployed()
    expect(await contract.getBool()).to.be.equal(message)
  })
})