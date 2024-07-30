const { ethers } = require('ethers');
const fs = require('fs');
const readline = require('readline');

// Function to read private keys from a file
const readPrivateKeys = async (filePath) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const privateKeys = [];
    for await (const line of rl) {
        privateKeys.push(line.trim());
    }
    return privateKeys;
};

// Function to derive address from a private key
const deriveAddressFromPrivateKey = (privateKey) => {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.address;
};

// Function to derive addresses from private keys and save to a file
const deriveAddressesAndSave = async (inputFilePath, outputFilePath) => {
    const privateKeys = await readPrivateKeys(inputFilePath);
    const addresses = [];

    for (const privateKey of privateKeys) {
        try {
            const address = deriveAddressFromPrivateKey(privateKey);
            addresses.push(address);
        } catch (error) {
            console.error(`Error processing private key: ${privateKey}`, error);
        }
    }

    // Save addresses to a text file
    fs.writeFileSync(outputFilePath, addresses.join('\n'), "utf8");
    console.log(`Addresses have been saved to ${outputFilePath}`);
};

// File paths
const inputFilePath = "./src/data/privatekey.txt";
const outputFilePath = "./src/data/address.txt";

// Call function to derive addresses and save to a file
deriveAddressesAndSave(inputFilePath, outputFilePath);
