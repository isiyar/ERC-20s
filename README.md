# ERC-20s smart-contracts

## Description
ERC20 is a standard that describes interchangeable tokens. They have their own denomination and quantity. You can buy or sell something with them. Roughly speaking, they are tokens that behave like ether, but don't confuse them with ether, because ERC20 tokens are not cryptocurrencies, but work on the blockchain.

## Structure
### Main
```contracts/IERC20.sol``` - ERC20 smart-contract interface

```contracts/ERC20.sol``` - an abstract smart-contract from which ERC20 token contracts are inherited

```contracts/TokenContract.sol``` - example of token contract implementation inherited from ERC20.sol abstract contract

### Utils
```contracts/utils/Context.sol``` - a contract to help interact with the context of the message

```contracts/utils/IERC20Errors.sol``` - a contract that contains various types of bugs that can be raised by running an ERC20 contract

```contracts/utils/IERC20Metadata.sol``` - contract containing signatures of functions returning token metadata

### Tests
```test/ERC20.test.js``` - tests for ERC20 token contract

## Getting Started
1. ```npx hardhat compile``` - compile smart-contracts
2. ```npx hardhat test``` - test run