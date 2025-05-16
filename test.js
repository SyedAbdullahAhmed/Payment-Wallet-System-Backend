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
 