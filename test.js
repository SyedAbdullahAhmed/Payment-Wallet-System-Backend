// const crypto = require('asymmetric-crypto')

// Generate a key pair
// -> {
//   secretKey: 'KOy7fMWMkRc+QX8dzpfX9VwJKlc/+Zkyw5C7RGTXT920IjiKUdOSe/3sNnrETw7ej9TBFzsPyRfkWGMsGLAufQ==',
//   publicKey: 'tCI4ilHTknv97DZ6xE8O3o/UwRc7D8kX5FhjLBiwLn0='
// }

// Regenerate a key pair from the secret key
// const newKeyPair = crypto.fromSecretKey(keyPair.secretKey)
// -> {
//   secretKey: 'KOy7fMWMkRc+QX8dzpfX9VwJKlc/+Zkyw5C7RGTXT920IjiKUdOSe/3sNnrETw7ej9TBFzsPyRfkWGMsGLAufQ==',
//   publicKey: 'tCI4ilHTknv97DZ6xE8O3o/UwRc7D8kX5FhjLBiwLn0='
// }

// const myKeyPair = crypto.keyPair()
// const theirKeyPair = crypto.keyPair()

// console.log("myKeyPair")
// console.log(myKeyPair)
// console.log("\ntheirKeyPair")
// console.log(theirKeyPair)


// const data = {
//   name: 'John',
//   age: 30
// }
// // Encrypt data
// const encrypted = crypto.encrypt(JSON.stringify(data), theirKeyPair.publicKey, myKeyPair.secretKey)
// console.log("\nencrypted")
// console.log(encrypted)
// -> {
//   data: '63tP2r8WQuJ+k+jzsd8pbT6WYPHMTafpeg==',
//   nonce: 'BDHALdoeBiGg7wJbVdfJhVQQyvpxrBSo'
// }

// Decrypt data
// const decrypted = crypto.decrypt(encrypted.data, encrypted.nonce, myKeyPair.publicKey, theirKeyPair.secretKey)

// console.log("\ndecrypted")
// console.log(JSON.parse(decrypted))



const crypto = require('crypto');

// === Step 1: Generate RSA Key Pair ===
// const { publicKeyA, privateKeyA } = crypto.generateKeyPairSync('rsa', {
//   modulusLength: 2048,
//   publicKeyEncoding: {
//     type: 'pkcs1',
//     format: 'pem'
//   },
//   privateKeyEncoding: {
//     type: 'pkcs1',
//     format: 'pem'
//   }
// });
// const {
//   publicKey,
//   privateKey,
// } = crypto.generateKeyPairSync('rsa', {
//   modulusLength: 4096,
//   publicKeyEncoding: {
//     type: 'spki',
//     format: 'pem',
//   },
//   privateKeyEncoding: {
//     type: 'pkcs8',
//     format: 'pem',
//   },
// });

// console.log(publicKey, privateKey)

// console.log('✅ Public and Private Keys generated.');


// // === Step 2: Encrypt and Decrypt a Message ===
// const message = {
//   name: "Abdullah", age: 12
// };



// Message to encrypt

// Encrypt using public key
// const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(JSON.stringify(message)));
// console.log("\n🔐 Encrypted (base64):", encrypted.toString('base64'));

// // Decrypt using private key
// const decrypted = crypto.privateDecrypt(privateKey, encrypted);
// console.log("\n🔓 Decrypted:", decrypted.toString());




//   const {
//     publicKey,
//     privateKey,
//   } = crypto.generateKeyPairSync('rsa', {
//     modulusLength: 4096,
//     publicKeyEncoding: {
//       type: 'spki',
//       format: 'pem',
//     },
//     privateKeyEncoding: {
//       type: 'pkcs8',
//       format: 'pem',
//     },
//   });

//   return {
//     publicKey,
//     privateKey,
//   };
// }
// const a = generatePublicPrivateKeys()
// console.log(a)