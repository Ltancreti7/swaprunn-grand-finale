import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "your-supabase-url",
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "your-supabase-key",
);

async function addTradeColumns() {
  

  const alterStatements = [
    "ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS trade_make text",
    "ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS trade_model text",
    "ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS trade_year integer",
    "ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS trade_vin text",
    "ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS trade_transmission text",
  ];

  for (const sql of alterStatements) {
    try {
      
      // Use a raw SQL query via edge function if available, or try direct
      const { error } = await supabase.rpc("sql", { query: sql });
      if (error && !error.message.includes("already exists")) {
        
      } else {
        
      }
    } catch (err) {
      console.log("Trying alternative approach...");
    }
  }

  // Test the updated table
  
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
    
  } else {
    
    // Clean up
    if (data?.[0]) {
      await supabase.from("jobs").delete().eq("id", data[0].id);
    }
  }
}

addTradeColumns();
