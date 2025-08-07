
// c:/MERN/server/check-db-connection.js

// Load environment variables from .env file
require('dotenv').config();

// Import the Supabase client library
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Check if the credentials are provided
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_KEY must be defined in your .env file');
  process.exit(1);
}

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Define an async function to test the connection
async function testConnection() {
  console.log('Attempting to connect to Supabase and fetch data...');

  try {
    // Attempt to fetch the first todo item from the 'todos' table
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .limit(1);

    // If there was an error during the query, throw it
    if (error) {
      throw error;
    }

    // If successful, print a success message
    console.log('✅ Success! Database connection is working.');
    console.log('Fetched data:', data);

  } catch (error) {
    // If there was an error, print a failure message and the error details
    console.error('❌ Error: Failed to connect to the database or fetch data.');
    console.error('Supabase error details:', error.message);
    console.log('\nTroubleshooting Tips:');
    console.log('1. Verify that SUPABASE_URL in your .env file is correct.');
    console.log("2. Ensure SUPABASE_KEY is the correct 'service_role' key, not the 'anon' key.");
    console.log('3. Check your internet connection.');
    console.log("4. Make sure the 'todos' table exists in your Supabase project.");
  }
}

// Run the test
testConnection();
