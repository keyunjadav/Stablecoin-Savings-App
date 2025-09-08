// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Hook with Compound v3 (Comet) here; left as stub for the template.
library CompoundAdapter {
    function deposit(address /*asset*/, uint256 /*amount*/) internal {
        // implement: IERC20(asset).approve(comet, amount); IComet(comet).supply(asset, amount);
    }
    function withdraw(address /*asset*/, uint256 /*amount*/) internal {
        // implement: IComet(comet).withdraw(asset, amount);
    }
}
