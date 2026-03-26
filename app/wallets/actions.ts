"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const SUPPORTED_WALLET_CURRENCIES = ["USD", "EUR", "GBP", "CAD"] as const;

export async function createWallet(currency: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const normalizedCurrency = currency.trim().toUpperCase();
  if (!normalizedCurrency) throw new Error("Currency is required");
  if (!SUPPORTED_WALLET_CURRENCIES.includes(normalizedCurrency as (typeof SUPPORTED_WALLET_CURRENCIES)[number])) {
    throw new Error("Unsupported wallet currency");
  }

  const { data: existing, error: existingError } = await supabase
    .from("wallets")
    .select("id")
    .eq("user_id", user.id)
    .eq("currency", normalizedCurrency)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) {
    throw new Error("Wallet for this currency already exists");
  }

  const { data: insertedWallet, error } = await supabase
    .from("wallets")
    .insert({
      user_id: user.id,
      currency: normalizedCurrency,
      balance: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/wallets");

  return {
    success: true,
    wallet: insertedWallet,
  };
}
