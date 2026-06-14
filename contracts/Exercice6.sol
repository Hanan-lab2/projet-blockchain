// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercice6 {
    uint256[] public nombres;

    constructor() {
        nombres = [1, 2, 3, 4, 5];
    }

    function ajouterNombre(uint256 nombre) public {
        nombres.push(nombre);
    }

    function getElement(uint256 index) public view returns (uint256) {
        require(index < nombres.length, "Index n'existe pas");
        return nombres[index];
    }

    function afficheTableau() public view returns (uint256[] memory) {
        return nombres;
    }

    function calculerSomme() public view returns (uint256) {
        uint256 somme = 0;
        for (uint256 i = 0; i < nombres.length; i++) {
            somme += nombres[i];
        }
        return somme;
    }
}