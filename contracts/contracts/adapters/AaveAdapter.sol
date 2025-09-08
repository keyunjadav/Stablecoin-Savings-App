// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Hook with Aave v3 Pool here; left as stub for the template.
library AaveAdapter {
    function deposit(address /*asset*/, uint256 /*amount*/) internal {
        // implement: approve + IPool.supply(asset, amount, address(this), 0);
    }
    function withdraw(address /*asset*/, uint256 /*amount*/) internal {
        // implement: IPool.withdraw(asset, amount, msg.sender);
    }
}
