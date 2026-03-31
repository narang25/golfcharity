"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "../actions";
import { FormInput } from "@/components/auth/form-input";
import { SubmitButton } from "@/components/auth/submit-button";

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null);

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-emerald-950 mb-1">Welcome back</h3>
        <p className="text-emerald-800/60 text-sm">Please enter your details to sign in.</p>
      </div>

      <form action={formAction} className="space-y-5">
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          required
        />
        
        <div>
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
          />
          <div className="flex justify-end mt-2">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {state?.error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm mb-4">
            {state.error}
          </div>
        )}

        <SubmitButton pendingText="Signing in...">Sign In</SubmitButton>
      </form>

      <div className="mt-8">
        <p className="text-center text-sm text-emerald-800/60">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-emerald-700 hover:text-emerald-600">
            Sign up and make an impact
          </Link>
        </p>
      </div>
    </>
  );
}
