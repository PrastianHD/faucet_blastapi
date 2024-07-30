const fs = require('fs');
const prompt = require('prompt-sync')();
const chalk = require('chalk');
const config = require('./config.json');
const { getSiteKey, requestFunds, parseProxy } = require('./faucet');
const { log } = require('./logger');

// Display menu
console.log(chalk.yellow('Available Networks:'));
console.log('1. Sepolia');
console.log('2. Holesky');
console.log('3. Base Sepolia');
console.log('4. Superseed Sepolia');
console.log('5. Arbitrum Sepolia');
console.log('6. Optimism Sepolia');

const choice = prompt('Please select a network: ');

let network;
switch (choice) {
  case '1':
    network = 'ETH_SEPOLIA';
    break;
  case '2':
    network = 'ETH_HOLESKY';
    break;
  case '3':
    network = 'BASE';
    break;
  case '4':
    network = 'SUPER_SEED';
    break;
  case '5':
    network = 'ARBITRUM_SEPOLIA';
    break;
  case '6':
    network = 'OPTIMISM';
    break;
  default:
    console.log('Invalid choice. Exiting program...');
    process.exit(1);
}

const USE_PROXY = config.USE_PROXY;

// Read addresses and proxies from files
const addresses = fs.readFileSync('./src/data/address_testnet.txt', 'utf-8').trim().split('\n');
const proxies = fs.readFileSync('./src/data/proxy.txt', 'utf-8').trim().split('\n');


(async () => {
  try {
    const siteKey = await getSiteKey();

    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i].trim();
      const proxy = USE_PROXY ? proxies[i % proxies.length].trim() : null;

      try {
        // Validate and parse proxy if needed
        if (proxy) {
          parseProxy(proxy);
        }

        // Attempt to request funds for the address
        const success = await requestFunds(address, proxy, siteKey, network);
        if (!success) {
          log('ERROR', `Failed to process address: ${address}`);
        }
      } catch (error) {
        log('ERROR', `Error processing address: ${address} - ${error.message}`);
      }
    }
  } catch (error) {
    log('ERROR', `An unexpected error occurred: ${error.message}`);
  }
})();
