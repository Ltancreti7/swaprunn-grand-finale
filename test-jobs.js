import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qnxtxiqedohlqmgtsdnu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueHR4aXFlZG9obHFtZ3RzZG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5OTM4MTcsImV4cCI6MjA3MzU2OTgxN30.oOIqGw4lm30iRtMjTD8uZIOM8vUfYEVejLISZdJRl4M"
);

(async () => {
  console.log("🧪 Testing jobs table with trade_make column...");
  
  // Test inserting a job with trade_make
  const testJob = {
    type: 'delivery',
    pickup_address: 'Test Pickup',
    delivery_address: 'Test Delivery', 
    customer_name: 'Test Customer',
    customer_phone: '555-1234',
    year: 2023,
    make: 'Toyota',
    model: 'Camry',
    trade_make: 'Honda',
    trade_model: 'Civic',
    trade_year: 2020
  };
  
  const { data, error } = await supabase
    .from('jobs')
    .insert(testJob)
    .select();
    
  if (error) {
    console.log("❌ Error inserting test job:", error.message);
  } else {
    console.log("✅ Successfully created job with trade_make!");
    console.log("Job data:", data);
    
    // Clean up test job
    if (data?.[0]) {
      await supabase.from('jobs').delete().eq('id', data[0].id);
      console.log("🧹 Cleaned up test job");
    }
  }
})();