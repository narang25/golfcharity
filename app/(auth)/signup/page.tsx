"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "../actions";
import { FormInput } from "@/components/auth/form-input";
import { SubmitButton } from "@/components/auth/submit-button";

export default function SignUpPage() {
  const [state, formAction] = useActionState(signup, null);

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-emerald-950 mb-1">Create an account</h3>
        <p className="text-emerald-800/60 text-sm">Join us to make a difference with every swing.</p>
      </div>

      <form action={formAction} className="space-y-4 text-left">
        <FormInput
          id="full_name"
          name="full_name"
          type="text"
          label="Full name"
          autoComplete="name"
          required
        />

        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          required
        />
        
        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          required
        />

        <FormInput
          id="confirm_password"
          name="confirm_password"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          required
        />

        {state?.error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm mb-4">
            {state.error}
          </div>
        )}

        <div className="pt-2">
          <SubmitButton pendingText="Creating account...">Join the Club</SubmitButton>
        </div>
      </form>

      <div className="mt-8">
        <p className="text-center text-sm text-emerald-800/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-600">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
