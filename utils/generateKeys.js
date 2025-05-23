const crypto = require('crypto');

function generatePublicPrivateKeys() {
  const {
    publicKey,
    privateKey,
  } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  

  return {
    publicKey,
    privateKey,
  };
}

module.exports = generatePublicPrivateKeys;