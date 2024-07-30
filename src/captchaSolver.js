const axios = require('axios');
const config = require('./config.json');

const CAPTCHA_API_KEY = config.CAPTCHA_API_KEY;

async function solveTurnstileCaptcha(siteKey, pageUrl) {
  try {
    const captchaUrl = `http://2captcha.com/in.php?key=${CAPTCHA_API_KEY}&method=turnstile&sitekey=${siteKey}&pageurl=${pageUrl}`;
    const response = await axios.get(captchaUrl);
    
    if (!response.data.startsWith('OK')) {
      console.error("Error in captcha solving request:", response.data);
      return null;
    }

    const captchaId = response.data.split('|')[1];
    const captchaResultUrl = `http://2captcha.com/res.php?key=${CAPTCHA_API_KEY}&action=get&id=${captchaId}`;

    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      const result = await axios.get(captchaResultUrl);
      
      if (result.data.startsWith('OK')) {
        return result.data.split('|')[1];
      }
      
      if (result.data !== 'CAPCHA_NOT_READY') {
        console.error("Error in captcha solving result:", result.data);
        return null;
      }
    }

    console.error("Captcha solving timed out.");
    return null;
  } catch (error) {
    console.error("Error solving captcha:", error);
    return null;
  }
}

module.exports = {
  solveTurnstileCaptcha
};