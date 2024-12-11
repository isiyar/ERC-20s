const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokenName = "TOKEN";
const tokenSymbol = "TKN";
const tokenDecimals = 18n;
const initialSupply = 1000n;

describe("ERC20", () => {
	let owner;
	let user;
	let token;

	beforeEach(async () => {
		[owner, user] = await ethers.getSigners();
		const tokenContract = await ethers.getContractFactory(
			"TokenContractTokenContract",
			owner
		);
		token = await tokenContract.deploy();
		await token.waitForDeployment();
	});

	it("check name", async () => {
		expect(await token.name()).to.equal(tokenName);
	});

	it("check symbol", async () => {
		expect(await token.symbol()).to.equal(tokenSymbol);
	});

	it("check decimals", async () => {
		expect(await token.decimals()).to.equal(tokenDecimals);
	});

	describe("_mint", () => {
		it("zero-based shipping")
	});
});