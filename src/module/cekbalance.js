const { ethers } = require("ethers");
const fs = require("fs");
const readline = require("readline");
const config = require('../config.json');

// Function to read addresses from a file
const readAddresses = async (filePath) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const addresses = [];
    for await (const line of rl) {
        addresses.push(line.trim());
    }
    return addresses;
};

// Function to check balances of addresses
const checkAddressesAndBalances = async (filePath, provider) => {
    const addresses = await readAddresses(filePath);
    const results = [];

    for (const [index, address] of addresses.entries()) {
        try {
            const balance = await provider.getBalance(address);
            const balanceInEth = ethers.formatEther(balance);
            results.push({
                address: address,
                balance: balanceInEth
            });
            console.log(`Address ${index + 1} | ${address} | Balance: ${balanceInEth} ETH`);
        } catch (error) {
            console.error(`Error processing address at index ${index + 1}: ${address}`, error);
        }
    }
};

// Initialize provider 
const RPC_URL = config.RPC_URL
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Call function to check addresses and balances
checkAddressesAndBalances("./src/data/address.txt", provider);