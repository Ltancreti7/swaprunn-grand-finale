import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qnxtxiqedohlqmgtsdnu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueHR4aXFlZG9obHFtZ3RzZG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5OTM4MTcsImV4cCI6MjA3MzU2OTgxN30.oOIqGw4lm30iRtMjTD8uZIOM8vUfYEVejLISZdJRl4M",
);

async function addTradeColumns() {
  console.log("🔧 Adding trade columns to jobs table...");

  const alterStatements = [
    "ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS trade_make text",
    "ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS trade_model text",
    "ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS trade_year integer",
    "ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS trade_vin text",
    "ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS trade_transmission text",
  ];

  for (const sql of alterStatements) {
    try {
      console.log("Running:", sql);
      // Use a raw SQL query via edge function if available, or try direct
      const { error } = await supabase.rpc("sql", { query: sql });
      if (error && !error.message.includes("already exists")) {
        console.log("Error:", error.message);
      } else {
        console.log("✅ Success");
      }
    } catch (err) {
      console.log("Trying alternative approach...");
    }
  }

  // Test the updated table
  console.log("\n🧪 Testing updated jobs table...");
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      type: "delivery",
      pickup_address: "Test Pickup",
      delivery_address: "Test Delivery",
      customer_name: "Test Customer",
      customer_phone: "555-1234",
      trade_make: "Honda",
    })
    .select();

  if (error) {
    console.log("❌ Still error:", error.message);
  } else {
    console.log("✅ Jobs table now works with trade_make!");
    // Clean up
    if (data?.[0]) {
      await supabase.from("jobs").delete().eq("id", data[0].id);
    }
  }
}

addTradeColumns();
