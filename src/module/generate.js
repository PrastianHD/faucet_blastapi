const { ethers } = require('ethers');
const fs = require('fs');
const config = require('../config.json');

const regex = /^0x.*$/;
//const regex = /^0x0000.*0000$/;
const WALLET_AMOUNT = config.WALLET_AMOUNT;
const vanityWallets = [];

const generateVanityAddresses = () => {
    while (vanityWallets.length < WALLET_AMOUNT) {
        const wallet = ethers.Wallet.createRandom();
        if (regex.test(wallet.address)) {
            vanityWallets.push({
                address: wallet.address,
                privateKey: wallet.privateKey
            });
        }
    }
};

generateVanityAddresses();

const PK = vanityWallets.map(wallet => `${wallet.privateKey}`).join('\n');
fs.writeFileSync('./src/data/privatekeys.txt', PK, 'utf8');

const ADD = vanityWallets.map(wallet => `${wallet.address}`).join('\n');
fs.writeFileSync('./src/data/addresses.txt', ADD, 'utf8');

console.log('Generate addresses have been saved');
