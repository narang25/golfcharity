"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPassword } from "../actions";
import { FormInput } from "@/components/auth/form-input";
import { SubmitButton } from "@/components/auth/submit-button";

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(forgotPassword, null);

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-emerald-950 mb-1">Reset your password</h3>
        <p className="text-emerald-800/60 text-sm">Enter your email and we'll send you a link to get back into your account.</p>
      </div>

      {state?.success ? (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <h4 className="font-medium text-emerald-800 mb-1">Check your inbox</h4>
          <p className="text-sm text-emerald-700/80">{state.success}</p>
          <div className="mt-4">
            <Link
              href="/login"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              &larr; Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <form action={formAction} className="space-y-5">
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            autoComplete="email"
            required
          />

          {state?.error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm mb-4">
              {state.error}
            </div>
          )}

          <SubmitButton pendingText="Sending connection link...">Send Reset Link</SubmitButton>
        </form>
      )}

      {!state?.success && (
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-medium text-emerald-700 hover:text-emerald-600">
            &larr; Back to sign in
          </Link>
        </div>
      )}
    </>
  );
}
