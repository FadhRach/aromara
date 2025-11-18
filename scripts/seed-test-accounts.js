const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Environment variables - paste from .env.local
const SUPABASE_URL = 'https://wjreyhmowqydsnvbohpt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcmV5aG1vd3F5ZHNudmJvaHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDcwNTksImV4cCI6MjA2Mjg4MzA1OX0.tQRaGzaLWS5WhYOB4K-sECuWJQBZyNxsKN5UQjpIDUE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Hash password menggunakan MD5
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

async function seedTestAccounts() {
  console.log('🌱 Seeding test accounts...\n');

  const password = 'aromara123';
  const passwordHash = hashPassword(password);
  console.log(`🔐 Password hash: ${passwordHash}\n`);

  const testAccounts = [
    {
      email: 'admin@aromara.id',
      password: passwordHash,
      name: 'Admin Aromara',
      role: 'admin',
      phone: '+62812345678',
      address: 'Jakarta Office',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      is_verified: true,
      is_active: true,
    },
    {
      email: 'supplier@aromara.id',
      password: passwordHash,
      name: 'Golden Aura Fragrances',
      role: 'supplier',
      phone: '+62813456789',
      address: 'Bali Workshop',
      city: 'Denpasar',
      province: 'Bali',
      is_verified: true,
      is_active: true,
    },
    {
      email: 'buyer@aromara.id',
      password: passwordHash,
      name: 'PT Wangi Nusantara',
      role: 'buyer',
      phone: '+62814567890',
      address: 'Surabaya Office',
      city: 'Surabaya',
      province: 'Jawa Timur',
      is_verified: true,
      is_active: true,
    },
  ];

  for (const account of testAccounts) {
    console.log(`\n📧 Processing: ${account.email}`);

    // Check if account exists
    const { data: existing } = await supabase
      .from('company')
      .select('id, email')
      .eq('email', account.email)
      .single();

    if (existing) {
      // Update existing account
      console.log(`   ↻ Account exists, updating...`);
      const { error } = await supabase
        .from('company')
        .update({
          password: passwordHash,
          is_active: true,
        })
        .eq('email', account.email);

      if (error) {
        console.error(`   ❌ Error updating ${account.email}:`, error.message);
      } else {
        console.log(`   ✅ Updated ${account.email}`);
      }
    } else {
      // Insert new account
      console.log(`   ➕ Creating new account...`);
      const { data, error } = await supabase
        .from('company')
        .insert(account)
        .select()
        .single();

      if (error) {
        console.error(`   ❌ Error creating ${account.email}:`, error.message);
      } else {
        console.log(`   ✅ Created ${account.email} (ID: ${data.id})`);
      }
    }
  }

  console.log('\n\n✨ Test accounts seeding completed!\n');
  console.log('🔑 Test Credentials:');
  console.log('   • Admin: admin@aromara.id');
  console.log('   • Supplier: supplier@aromara.id');
  console.log('   • Buyer: buyer@aromara.id');
  console.log('   Password: aromara123');
  console.log('');
}

seedTestAccounts()
  .then(() => {
    console.log('👍 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
