import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { applyWalletFunding } from "@/lib/services/wallets";

type AddFundsPayload = {
  walletId?: string;
  amount?: number;
  method?: "bank_transfer" | "card" | "crypto_transfer";
  note?: string;
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as AddFundsPayload;
    const walletId = body.walletId?.trim();
    const amount = Number(body.amount);
    const method = body.method;

    if (!walletId) {
      return NextResponse.json({ error: "Wallet is required" }, { status: 400 });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    if (!method) {
      return NextResponse.json({ error: "Funding method is required" }, { status: 400 });
    }

    const result = await applyWalletFunding(supabase, {
      userId: user.id,
      email: user.email ?? "",
      walletId,
      amount,
      method,
      note: body.note,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to add funds",
      },
      { status: 500 }
    );
  }
}
