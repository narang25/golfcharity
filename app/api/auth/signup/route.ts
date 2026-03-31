import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message , code: 'BAD_REQUEST' }, { status: 400 });
    }

    // Fire welcome email asynchronously
    sendEmail('welcome', email, { name: fullName }).catch(err => 
      console.error("Welcome email failed:", err)
    );

    return NextResponse.json({ user: data.user }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
