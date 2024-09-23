const { network, ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let logic;
  let admin;

  if (chainId == 31337) {
    logic = await (await ethers.getContract("LogicV1", deployer)).getAddress();
    admin = await (
      await ethers.getContract("ProxyAdmin", deployer)
    ).getAddress();
    log("Local network detected! Deploying ...");
    log(logic);
    log(admin);
    await deploy("TransparentUpgradeableProxy", {
      contract: "TransparentUpgradeableProxy",
      from: deployer,
      log: true,
      args: [logic, admin, "0x"],
    });
    log(" Deployed!");
    log("------------------------------------------------");
  }
};
module.exports.tags = ["all", "TransparentUpgradeableProxy"];
