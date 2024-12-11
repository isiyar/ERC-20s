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
	address owner;

	constructor (string memory name_, string memory symbol_) {
		_name = name_;
		_symbol = symbol_;
		owner = _msgSender();
	}

	modifier onlyOwner() {
		require(_msgSender() == owner, "not an owner!");
		_;
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

	function _update(address from, address to, uint256 value) internal virtual {
		if (from == _zeroAddress) {
			_totalSupply += value;
		} else {
			uint256 fromBalance = balanceOf(from);
			if (fromBalance < value) {
				revert ERC20InsufficientBalance(from, fromBalance, value);
			}
			unchecked {
				_balances[from] = fromBalance - value;
			}
		}

		if (to == _zeroAddress) {
			unchecked {
				_totalSupply -= value;
			}
		} else {
			unchecked {
				_balances[to] += value;
			}
		}

		emit Transfer(from, to, value);
	}

	function _mint(address account, uint256 value) public onlyOwner {
		if (account == _zeroAddress) {
			revert ERC20InvalidReceiver(_zeroAddress);
		}
		_update(_zeroAddress, account, value);
	}

	function transfer(address to, uint256 value) public virtual returns (bool) {
		address from = _msgSender();
		_transfer(from, to, value);
		return true;
	}

	function _transfer(address from, address to, uint256 value) internal {
		if (from == _zeroAddress) {
			revert ERC20InvalidSender(_zeroAddress);
		}
		if (to == _zeroAddress) {
			revert ERC20InvalidReceiver(_zeroAddress);
		}
		_update(from, to, value);
	}

	function allowance(address owner_, address spender) public view virtual returns (uint256) {
		return _allowances[owner_][spender];
	}

	function approve(address spender, uint256 value) public virtual returns (bool) {
		_approve(_msgSender(), spender, value, true);
		return true;
	}

	function _approve(address owner_, address spender, uint256 value, bool emitEvent) internal virtual {
		if (owner_ == _zeroAddress) {
			revert ERC20InvalidApprover(_zeroAddress);
		}
		if (spender == _zeroAddress) {
			revert ERC20InvalidSpender(_zeroAddress);
		}
		_allowances[owner_][spender] = value;
		if (emitEvent) {
			emit Approval(owner_, spender, value);
		}
	}

	function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
		_spendAllowance(from, _msgSender(), value);
		_transfer(from, to, value);
		return true;
	}

	function _spendAllowance(address owner_, address spender, uint256 value) internal virtual {
		uint256 currentAllowance = allowance(owner_, spender);
		if (currentAllowance < type(uint256).max) {
			if (currentAllowance < value) {
				revert ERC20InsufficientAllowance(spender, currentAllowance, value);
			}
			unchecked {
      	_approve(owner, spender, currentAllowance - value, false);
      }
		}
	}

	function _burn(address account, uint256 value) public onlyOwner() {
  	if (account == _zeroAddress) {
    	revert ERC20InvalidSender(_zeroAddress);
    }
    _update(account, _zeroAddress, value);
  }
}