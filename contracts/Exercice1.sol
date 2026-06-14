// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercice1 {
    uint256 public nombre1 = 10;
    uint256 public nombre2 = 20;

    // Fonction view - utilise les variables d'état
    function addition1() public view returns (uint256) {
        return nombre1 + nombre2;
    }

    // Fonction pure - ne dépend que des paramètres
    function addition2(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
}