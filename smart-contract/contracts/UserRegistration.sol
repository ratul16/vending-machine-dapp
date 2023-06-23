// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract UserRegistration {
    struct User {
        string name;
        string email;
        string password;
        bool registered;
    }

    mapping(address => User) public users;
    address[] public userAddresses;

    event UserRegistered(address user);

    function registerUser(
        string memory name,
        string memory email,
        string memory password
    ) external {
        require(!users[msg.sender].registered, "User already registered");

        User memory newUser = User(name, email, password, true);
        users[msg.sender] = newUser;
        userAddresses.push(msg.sender);

        emit UserRegistered(msg.sender);
    }

    function getUserCount() external view returns (uint256) {
        return userAddresses.length;
    }

    function getUserInfo(
        address user
    ) external view returns (string memory, string memory, string memory) {
        require(users[user].registered, "User not registered");

        User memory userInfo = users[user];
        return (userInfo.name, userInfo.email, userInfo.password);
    }
}
