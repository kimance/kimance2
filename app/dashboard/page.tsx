import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";
import { getUserGlobalBalance, getUserWallets, type WalletRecord } from "@/lib/services/wallets";
import { getExchangeRates } from "@/lib/services/exchange";

async function getTransactions(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(5);
  return data || [];
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const walletBalances: WalletRecord[] = await getUserWallets(supabase, user!.id);
  const balance = await getUserGlobalBalance(supabase, user!.id);
  const transactions = await getTransactions(supabase, user!.id);
  const rates = await getExchangeRates();

  return (
    <DashboardClient 
      userName={userName}
      balance={balance}
      walletBalances={walletBalances}
      transactions={transactions}
      userId={user!.id}
      initialRates={rates}
    />
  );
}
