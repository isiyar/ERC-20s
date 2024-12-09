// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {IERC20} from "./IERC20.sol";
import {IERC20Metadata} from "./utils/IERC20Metadata.sol";
import {IERC20Errors} from "./utils/IERC20Errors.sol";
import {Context} from "./utils/Context.sol";

abstract contract ERC20 is Context, IERC20, IERC20Metadata, IERC20Errors {
	mapping (address account => uint256) private _balances;
	mapping (address account => mapping (address spender => uint256)) private _allowances;

	uint256 private _totalSupply;
	string private _name;
	string private _symbol;

	constructor (string memory name_, string memory symbol_) {
		_name = name_;
		_symbol = symbol_;
	}

	function name() public view virtual returns (string memory) {
		return _name;
	}

	function symbol() public view virtual returns (string memory) {
		return _symbol;
	}

	function decimals() public view virtual returns (uint8) {
  	return 18;
  }

	function totalSupply() public view virtual returns (uint256) {
		return _totalSupply;
	}

	function balanceOf(address account) public view virtual returns (uint256) {
		return _balances[account];
	}
}