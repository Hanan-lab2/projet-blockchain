const Rectangle = artifacts.require("Rectangle");

module.exports = function(deployer) {
    // Rectangle(x, y, longueur, largeur)
    deployer.deploy(Rectangle, 0, 0, 10, 5);
};