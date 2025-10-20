require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials in .env.production');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  console.log('Setting up storage buckets in Supabase Cloud...');
  console.log('URL:', supabaseUrl);
  
  // Create profile-pictures bucket
  const { data: profileData, error: profileError } = await supabase.storage.createBucket('profile-pictures', {
    public: true,
    fileSizeLimit: 2097152, // 2MB in bytes
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  });

  if (profileError) {
    if (profileError.message.includes('already exists')) {
      console.log('✓ profile-pictures bucket already exists');
    } else {
      console.error('Error creating profile-pictures bucket:', profileError);
    }
  } else {
    console.log('✓ profile-pictures bucket created successfully');
  }

  // Create photos bucket
  const { data: photosData, error: photosError } = await supabase.storage.createBucket('photos', {
    public: true,
    fileSizeLimit: 10485760, // 10MB in bytes
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  });

  if (photosError) {
    if (photosError.message.includes('already exists')) {
      console.log('✓ photos bucket already exists');
    } else {
      console.error('Error creating photos bucket:', photosError);
    }
  } else {
    console.log('✓ photos bucket created successfully');
  }

  console.log('\nStorage setup complete!');
}

setupStorage();