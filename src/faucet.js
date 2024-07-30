const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { solveTurnstileCaptcha } = require('./captchaSolver');
const { log } = require('./logger');

// Headers configuration
const headers = {
  'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
  'sec-ch-ua': "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
  'content-type': "application/json",
  'sec-ch-ua-mobile': "?0",
  'sec-ch-ua-platform': "\"Windows\"",
  'sec-fetch-site': "cross-site",
  'sec-fetch-mode': "cors",
  'sec-fetch-dest': "empty",
  'referer': "https://blastapi.io/",
  'accept-language': "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ms;q=0.6",
  'cache-control': "no-cache",
  'origin': "https://blastapi.io",
  'pragma': "no-cache",
  'priority': "u=1, i",
  'accept': "application/json",
  'accept-encoding': "gzip, deflate, br, zstd"
};

// Site key function
async function getSiteKey() {
  const sitekey = "0x4AAAAAAADpPG5bkqAOfYoX";
  return sitekey;
}

// Parse proxy function
function parseProxy(proxy) {
  const parts = proxy.split(':');
  if (parts.length === 4) {
    const [username, password, host, port] = parts;
    return { username, password, host, port };
  } else {
    throw new Error(`Invalid proxy format: ${proxy}`);
  }
}

// Request funds function
async function requestFunds(address, proxy, siteKey, network) {
  try {
    if (proxy) {
      const { username, password, host, port } = parseProxy(proxy);
      const proxyUrl = `http://${username}:${password}@${host}:${port}`;
      const agent = new HttpsProxyAgent(proxyUrl);
      axios.defaults.httpAgent = agent;
      axios.defaults.httpsAgent = agent;
      log('INFO', `Proxy is connected!`);
    } else {
      log('INFO', `Proxy not connected!`);
    }

    const captchaToken = await solveTurnstileCaptcha(siteKey, "https://blastapi.io/");
    if (!captchaToken) {
      log('ERROR', `Failed to solve captcha for ${address}. Skipping to next address.`);
      return false;
    }

    //log('INFO', `Successfully solved captcha. Proceeding with request.`);

    let giveMeUrl;
    switch (network) {
      case 'ETH_SEPOLIA':
        giveMeUrl = `https://faucets-backend.eu-central-1.bwarelabs.app/transfer/ETH_SEPOLIA/${address}`;
        break;
      case 'ETH_HOLESKY':
        giveMeUrl = `https://faucets-backend.eu-central-1.bwarelabs.app/transfer/ETH_HOLESKY/${address}`;
        break;
      case 'BASE':
        giveMeUrl = `https://faucets-backend.eu-central-1.bwarelabs.app/transfer/BASE/${address}`;
        break;
      case 'SUPER_SEED':
        giveMeUrl = `https://faucets-backend.eu-central-1.bwarelabs.app/transfer/SUPER_SEED/${address}`;
        break;
      case 'ARBITRUM_SEPOLIA':
        giveMeUrl = `https://faucets-backend.eu-central-1.bwarelabs.app/transfer/ARBITRUM_SEPOLIA/${address}`;
        break;
      case 'OPTIMISM':
        giveMeUrl = `https://faucets-backend.eu-central-1.bwarelabs.app/transfer/OPTIMISM/${address}`;
        break;
      default:
        throw new Error(`Unsupported network: ${network}`);
    }

    const payload = {
      captchaCode: captchaToken
    };

    //log('INFO', `Sending request to faucet for address: ${address}`);
    const response = await axios.post(giveMeUrl, payload, { headers });
    if (response.status === 200) {
      log('SUCCESS', `Transaction successful for address: ${address}`);
      return true;
    } else {
      log('ERROR', `Transaction failed for ${address}: ${response.data.message}`);
      return false;
    }
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    log('ERROR', `Error: ${errorMessage}`);
    return false;
  }
}

module.exports = {
  getSiteKey,
  requestFunds,
  parseProxy
};