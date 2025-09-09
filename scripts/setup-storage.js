/* eslint-disable @typescript-eslint/no-require-imports */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Missing SUPABASE_URL in environment.');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  console.log('Setting up profile-pictures bucket...');

  // Create the bucket
  const { error } = await supabase.storage.createBucket('profile-pictures', {
    public: true,
    fileSizeLimit: '2MB',
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  });

  if (error) {
    console.error('Failed to create bucket:', error);
    process.exit(1);
  }

  console.log('Bucket created');
}

setupStorage();