# Tools CLaim Faucet in Blast Api

## Description
This is a simple tool to claim faucets taken from [Blast API](https://blastapi.io/faucets) using the Claim Faucet Tools. In addition, there are functions to Check ETH Balance, create wallets, and ETH Transfer Features.

## Features
- Claim Faucets ETH = Support ETH Sepolia, ETH Holesky, ETH Base Sepolia, ETH Arbitrum Sepolia, ETH Optimism Sepolia, ETH Superseed Sepolia.
- Check ETH Balance = After claiming the Faucet, please check the balance to make sure
- Generate Wallet = Create an EVM wallet that can be customized with the address configuration, for example `0x0000***` or `0x***0000` or whatever you want
- Convert Private Key to Address.
- Transfer ETH = Send ETH from `private keys` to the destination address.

## Requirements
- NodeJS 
- `npm` or `yarn` for package management

## Installation
1. Clone the repository:
```bash shell
git clone https://github.com/PrastianHD/faucet-blastapi.git
```

2. Navigate into the project directory:
```
cd faucet-blastapi
```

3. Install dependencies:
```
npm install
```

4. Configuration

- Go to path/src/config.json
```
  {
    "CAPTCHA_API_KEY": "", # This is the Captha API KEY
    "RPC_URL": "", # This is the EVM RPC URL, can be Sepolia and so on
    "RECIPIENT_ADDRESS": "", # This is the recipient address for the Transfer feature
    "WALLET_AMOUNT": 10, # This is the number of wallets you want to create
    "USE_PROXY": true # `true` to use proxy, `false` to disable it
} 
```

- Go to path/src/data
  - address.txt # this is a list of addresses to receive faucets
  - privatekey.txt # this is the pk for the transfer function
  - proxy.txt # please enter in the format username:password:host:port


# Usage
### 1. Claim Faucet
```
npm start
```
### 2. Cek Balance ETH
```
npm run cekbalance
```

### 3. Generate New Wallet
```
npm run generate
```

### 4. Convert from Private Key to Address
```
npm run convert
```

### 5. Transfer ETH to Recipient
```
npm run transfer
```

## Donations
If you would like to support the development of this project, you can make a donation using the following addresses:

- Solana: `68Xd3S6jADS52c4RMMzUHpoeoewK9kLkG6v1Qh2CNTt4` 
- ALL EVM: `0x000000DE3b4CD31742711440C1283b162035E00E`

## Contributing
Feel free to open `issues` or submit `pull requests` if you have improvements or bug fixes.
