'use server'

import { createClient } from '@/lib/supabase/server'
import { buildSendNote, recordTransaction } from '@/lib/services/wallets'

const PRIMARY_SEND_CURRENCY = 'USD'

async function getSenderWallet(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: wallet, error } = await supabase
    .from('wallets')
    .select('id, balance, currency')
    .eq('user_id', userId)
    .eq('currency', PRIMARY_SEND_CURRENCY)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return wallet
}

export async function getBalance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  const wallet = await getSenderWallet(supabase, user.id)
  return { balance: Number(wallet?.balance ?? 0) }
}

export async function checkRecipient(email: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }
  if (email === user.email) return { error: 'Cannot send money to yourself' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Enter a valid recipient email' }
  }
  return { exists: true }
}

export async function sendMoney(recipientEmail: string, recipientAmount: number, note?: string, deductAmount?: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }
  if (recipientEmail === user.email) return { error: 'Cannot send money to yourself' }
  if (recipientAmount <= 0) return { error: 'Amount must be positive' }

  // If deductAmount is provided (promo applied), use it; otherwise deduct full amount
  const amountToDeduct = deductAmount !== undefined ? deductAmount : recipientAmount

  const senderWallet = await getSenderWallet(supabase, user.id)
  if (!senderWallet) {
    return { error: 'USD wallet not found. Create a USD wallet first.' }
  }
  const senderBalance = Number(senderWallet.balance)

  if (senderBalance < amountToDeduct) {
    return { error: 'Insufficient balance' }
  }

  // Deduct amount from sender wallet
  const senderNewBalance = senderBalance - amountToDeduct
  const { error: walletUpdateError } = await supabase
    .from('wallets')
    .update({ balance: senderNewBalance })
    .eq('id', senderWallet.id)
    .eq('user_id', user.id)

  if (walletUpdateError) {
    return { error: 'Failed to deduct balance' }
  }

  try {
    await recordTransaction(supabase, {
      userId: user.id,
      senderEmail: user.email ?? '',
      recipientEmail,
      amount: recipientAmount,
      type: 'send',
      note: buildSendNote(note),
    })
  } catch {
    await supabase
      .from('wallets')
      .update({ balance: senderBalance })
      .eq('id', senderWallet.id)
      .eq('user_id', user.id)
    return { error: 'Failed to record transaction' }
  }

  return { success: true, newBalance: senderNewBalance }
}

export async function getTransactions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated', transactions: [] }

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(10)

  return { 
    transactions: transactions || [],
    userId: user.id 
  }
}
