import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "your-supabase-url",
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "your-supabase-key",
);

(async () => {
  // Test inserting a job with trade_make
  const testJob = {
    type: "delivery",
    pickup_address: "Test Pickup",
    delivery_address: "Test Delivery",
    customer_name: "Test Customer",
    customer_phone: "555-1234",
    year: 2023,
    make: "Toyota",
    model: "Camry",
    trade_make: "Honda",
    trade_model: "Civic",
    trade_year: 2020,
  };

  const { data, error } = await supabase.from("jobs").insert(testJob).select();

  if (error) {
  } else {
    // Clean up test job
    if (data?.[0]) {
      await supabase.from("jobs").delete().eq("id", data[0].id);
    }
  }
})();
