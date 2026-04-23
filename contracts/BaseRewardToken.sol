// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract BaseRewardToken is ERC20, Ownable, ReentrancyGuard {
    mapping(address => uint256) public rewards;
    mapping(address => bool) public claimed;

    event RewardAssigned(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(uint256 initialSupply) ERC20('Base Reward Token', 'BRT') {
        _mint(msg.sender, initialSupply);
    }

    function setReward(address user, uint256 amount) external onlyOwner {
        rewards[user] = amount;
        claimed[user] = false;
        emit RewardAssigned(user, amount);
    }

    function claimReward() external nonReentrant {
        uint256 amount = rewards[msg.sender];
        require(amount > 0, 'No reward available');
        require(!claimed[msg.sender], 'Reward already claimed');

        claimed[msg.sender] = true;
        rewards[msg.sender] = 0;
        _mint(msg.sender, amount);
        emit RewardClaimed(msg.sender, amount);
    }

    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        require(token != address(0), 'Invalid token');
        IERC20(token).transfer(msg.sender, amount);
    }
}
