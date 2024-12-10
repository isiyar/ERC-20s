// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

abstract contract Context {
	address _zeroAddress = address(0);

	function _msgSender() internal view virtual returns (address) {
		return msg.sender;
	}

	function _msgData() internal view virtual returns (bytes calldata) {
		return msg.data;
	}

	function _contextSuffixLength() internal view virtual returns (uint256) {
  	return 0;
  }
}