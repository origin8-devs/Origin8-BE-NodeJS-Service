const CryptoJS = require("crypto-js");
const { PASSWORD_DECRYPTION_KEY } = require('../config');
let password = '@@Power2me'
let encrypted = CryptoJS.AES.encrypt(password, PASSWORD_DECRYPTION_KEY).toString()
console.log({ encrypted })