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
			"TokenContract",
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
		it("does not mint on a zero account", async () => {
			await expect(token._mint(ethers.ZeroAddress, initialSupply))
				.to.be.revertedWithCustomError(token, "ERC20InvalidReceiver")
				.withArgs(ethers.ZeroAddress);
		});

		describe("mint to non-zero account", () => {
			let tx;
			beforeEach("minting", async () => {
				tx = await token.connect(owner)._mint(user, initialSupply);
			});

			it("check total supply", async () => {
				expect(await token.totalSupply()).to.equal(initialSupply);
			});

			it("check user balance", async () => {
				await expect(tx).to.changeTokenBalance(token, user, initialSupply);
			});

			it("emits Transfer event", async () => {
				await expect(tx)
					.to.emit(token, "Transfer")
					.withArgs(ethers.ZeroAddress, user, initialSupply);
			});
		});
	});

	describe("_burn", () => {
		beforeEach("minting", async () => {
			await token.connect(owner)._mint(user, initialSupply);
		});

		it("does not burn on a zero account", async () => {
			await expect(
				token.connect(owner)._burn(ethers.ZeroAddress, initialSupply)
			)
				.to.be.revertedWithCustomError(token, "ERC20InvalidSender")
				.withArgs(ethers.ZeroAddress);
		});

		describe("burn for non-zero account", () => {
			it("burn more than on balance", async () => {
				await expect(token.connect(owner)._burn(user, initialSupply + 1n))
					.to.be.revertedWithCustomError(token, "ERC20InsufficientBalance")
					.withArgs(user, initialSupply, initialSupply + 1n);
			});

			describe("after burning", () => {
				let tx;
				beforeEach("burn", async () => {
					tx = await token.connect(owner)._burn(user, initialSupply);
				});

				it("check total supply", async () => {
					expect(await token.totalSupply()).to.equal(0);
				});

				it("check user balance", async () => {
					await expect(tx).to.changeTokenBalance(token, user, -initialSupply);
				});

				it("emits Transfer event", async () => {
					await expect(tx)
						.to.emit(token, "Transfer")
						.withArgs(user, ethers.ZeroAddress, initialSupply);
				});
			});
		});
	});

	describe("usage", () => {
		beforeEach("minting", async () => {
			await token.connect(owner)._mint(owner, initialSupply);
		});

		it("check total supply", async () => {
			expect(await token.totalSupply()).to.equal(initialSupply);
		});

		describe("balanceOf", () => {
			it("returns zero if there are no tokens on the account", async () => {
				const balance = await token.balanceOf(user);
				expect(balance).to.equal(0);
			});

			it("returns the balance if there are tokens on the account", async () => {
				const balance = await token.balanceOf(owner);
				expect(balance).to.equal(await token.totalSupply());
			});
		});

		describe("transfer", () => {
			describe("the recipient address is not zero", () => {
				it("the user sends more than his balance", async () => {
					const userBalance = await token.balanceOf(user);
					const value = userBalance + 1n;
					await expect(token.connect(user).transfer(owner, value))
						.to.be.revertedWithCustomError(token, "ERC20InsufficientBalance")
						.withArgs(user, userBalance, value);
				});

				describe("the user sends the entire balance", () => {
					let value;
					let tx;
					beforeEach(async () => {
						value = await token.balanceOf(owner);
						tx = await token.connect(owner).transfer(user, value);
					});

					it("transfers the appropriate value", async () => {
						expect(tx).to.changeTokenBalance(
							token,
							[owner, user],
							[-value, value]
						);
					});

					it("emits a transfer event", async () => {
						expect(tx).to.emit(token, "Transfer").withArgs(owner, user, value);
					});
				});

				describe("the user sends zero tokens", () => {
					let tx;
					beforeEach(async () => {
						tx = await token.connect(user).transfer(owner, 0n);
					});

					it("transfers the appropriate value", async () => {
						expect(tx).to.changeTokenBalance(token, [owner, user], [0n, 0n]);
					});

					it("emits a transfer event", async () => {
						expect(tx).to.emit(token, "Transfer").withArgs(owner, user, 0n);
					});
				});
			});

			it("the recipient address is zero", async () => {
				await expect(token.connect(owner).transfer(ethers.ZeroAddress, 0n))
					.to.be.revertedWithCustomError(token, "ERC20InvalidReceiver")
					.withArgs(ethers.ZeroAddress);
			});
		});
	});
});
