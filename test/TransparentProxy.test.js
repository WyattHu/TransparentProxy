const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../hardhat-config-helper");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("TransparentProxy", function () {
      let proxyContract;
      let LogicV1;
      let LogicV2;
      let deployer;
      let proxyContractAddress;
      let proxyAdminContract;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        proxyContract = await ethers.getContract(
          "TransparentUpgradeableProxy",
          deployer
        );
        proxyContractAddress = await proxyContract.getAddress();
        LogicV1 = await ethers.getContractAt("LogicV1", proxyContractAddress);
        LogicV2 = await ethers.getContract("LogicV2", deployer);
        proxyAdminContract = await ethers.getContract("ProxyAdmin", deployer);
      });

      describe("ProxyContract", function () {
        it("Set", async () => {
          let ABI = [
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_key",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "_value",
                  type: "uint256",
                },
              ],
              name: "SetUint256Param",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ];
          let iface = new ethers.Interface(ABI);
          let data = iface.encodeFunctionData("SetUint256Param", ["a", 1]);
          //   console.log("data:", data);
          const signer = await ethers.getSigner(deployer);

          let tx = await signer.sendTransaction({
            to: proxyContractAddress,
            data: data,
          });
          const res = await tx.wait();

          const ret = await LogicV1.GetUint256Param("a");
          console.log(ret);

          assert.equal(ret, 1);
        });
        it("set1", async () => {
          let ABI = [
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_key",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "_value",
                  type: "uint256",
                },
              ],
              name: "SetUint256Param",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ];
          let iface = new ethers.Interface(ABI);
          let data = iface.encodeFunctionData("SetUint256Param", ["a", 1]);
          //   console.log("data:", data);
          const signer = await ethers.getSigner(deployer);

          let tx = await signer.sendTransaction({
            to: proxyContractAddress,
            data: data,
          });
          const res = await tx.wait();
          const ret = await LogicV1.GetUint256Param("a");
          console.log(ret);

          const logicV2Address = await LogicV2.getAddress();
          let tx2 = await proxyAdminContract.upgrade(
            proxyContractAddress,
            logicV2Address
          );
          let receipt = await tx2.wait();
          LogicV2 = await ethers.getContractAt("LogicV2", proxyContractAddress);

          const ret2 = await LogicV2.GetUint256Param("a");
          console.log(ret2);
          assert.equal(ret2, 2);
        });
      });
    });
