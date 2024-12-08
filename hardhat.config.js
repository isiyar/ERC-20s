require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.27",
	networks: {
		[process.env.NETWORK]: {
			url: process.env.INFURA_URL,
			accounts: [process.env.PRIVATE_KEY],
		},
	},
};