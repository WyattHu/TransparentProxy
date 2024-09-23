const { network, ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId == 31337) {
    log("Local network detected! Deploying ...");
    await deploy("LogicV1", {
      contract: "LogicV1",
      from: deployer,
      log: true,
      // args: [],
    });
    log(" Deployed!");
    log("------------------------------------------------");
  }
};
module.exports.tags = ["all", "LogicV1"];
