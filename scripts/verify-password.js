// Test script to verify password hashing with MD5
const crypto = require('crypto')

const password = 'aromara123'
const expectedHash = 'ad2aab3d23fe89dd43eed3368d03e0e2'

console.log('🔐 Password Hash Verification (MD5)\n')
console.log('Password:', password)
console.log('Expected Hash:', expectedHash)

// Generate MD5 hash
const actualHash = crypto.createHash('md5').update(password).digest('hex')
console.log('Generated Hash:', actualHash)

console.log('\nVerifying...')

if (actualHash === expectedHash) {
  console.log('✅ Password verification SUCCESS!')
  console.log('   The password "aromara123" correctly hashes to:', expectedHash)
} else {
  console.log('❌ Password verification FAILED!')
  console.log('   Expected:', expectedHash)
  console.log('   Got:', actualHash)
}

console.log('\n📝 You can use this in your login logic:')
console.log('   const crypto = require("crypto")')
console.log('   const hash = crypto.createHash("md5").update(password).digest("hex")')
console.log('   const isValid = (hash === storedHash)')

