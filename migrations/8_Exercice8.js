const Payment = artifacts.require("Payment");

module.exports = function(deployer) {
    // Utilise l'adresse du premier compte Ganache 
    deployer.deploy(Payment, "0x25Ba413E355A8E9Bc33125BC86cC073Cd461De7F");
};