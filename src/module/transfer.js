const { ethers } = require("ethers");
const fs = require('fs');
const readline = require('readline');
const { log } = require('../logger');
const config = require('../config.json');

const RPC_URL = config.RPC_URL
const provider = new ethers.JsonRpcProvider(RPC_URL);
const RECIPIENT_ADDRESS = config.RECIPIENT_ADDRESS;

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

const checkBalancesAndTransfer = async (filePath, provider) => {
    const privateKeys = await readPrivateKeys(filePath);

    for (const [index, privateKey] of privateKeys.entries()) {
        try {
            const wallet = new ethers.Wallet(privateKey, provider);
            const balance = await provider.getBalance(wallet.address);
            const balanceInEth = ethers.formatEther(balance);
            log('INFO', `Address ${index + 1}: ${wallet.address}, Balance: ${balanceInEth} ETH`);

            const Amount = "0.0242";
            if (parseFloat(balanceInEth) >= parseFloat(Amount)) {
                const tx = {
                    to: RECIPIENT_ADDRESS,
                    value: ethers.parseEther(Amount)
                };
                await wallet.sendTransaction(tx);

                log('SUCCESS', `Sent ${Amount} ETH to ${recipientAddress}`);
            } else {
                log('ERROR', `Not enough balance to send ${Amount} ETH from ${wallet.address}`);
            }
        } catch (error) {
            log('ERROR', `Error with private key at line ${index + 1}: ${privateKey}, Error: ${error.message}`);
        }
    }
};

// Call the function to check balances and send ETH
checkBalancesAndTransfer('./src/data/privatekeys.txt', provider);