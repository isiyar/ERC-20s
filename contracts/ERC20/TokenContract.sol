// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20} from "./ERC20.sol";

contract TokenContract is ERC20 {
	constructor() ERC20("TOKEN", "TKN") {}
}