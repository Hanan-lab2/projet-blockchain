// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract Forme {
    uint256 public x;
    uint256 public y;

    constructor(uint256 _x, uint256 _y) {
        x = _x;
        y = _y;
    }

    function deplacerForme(uint256 dx, uint256 dy) public {
        x += dx;
        y += dy;
    }

    function afficheXY() public view returns (uint256, uint256) {
        return (x, y);
    }

    function afficheInfos() public pure virtual returns (string memory) {
        return "Je suis une forme";
    }

    function surface() public view virtual returns (uint256);
}

contract Rectangle is Forme {
    uint256 public lo;
    uint256 public la;

    constructor(uint256 _x, uint256 _y, uint256 _lo, uint256 _la) Forme(_x, _y) {
        lo = _lo;
        la = _la;
    }

    function surface() public view override returns (uint256) {
        return lo * la;
    }

    function afficheInfos() public pure override returns (string memory) {
        return "Je suis Rectangle";
    }

    function afficheLoLa() public view returns (uint256, uint256) {
        return (lo, la);
    }
}