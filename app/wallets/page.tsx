import { createClient } from "@/lib/supabase/server";
import WalletsPageClient from "./WalletsPageClient";
import NotAuthClient from "@/app/components/NotAuthClient";
import { getUserGlobalBalance, getUserWallets } from "@/lib/services/wallets";

async function getTransactionHistory(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, limit = 10) {
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

export default async function WalletsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <NotAuthClient />;
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  
  const wallets = await getUserWallets(supabase, user.id);
  const transactions = await getTransactionHistory(supabase, user.id);
  const totalBalance = await getUserGlobalBalance(supabase, user.id);

  return (
    <WalletsPageClient
      userName={userName}
      userEmail={userEmail}
      wallets={wallets}
      transactions={transactions}
      totalBalance={totalBalance}
      userId={user.id}
    />
  );
}
