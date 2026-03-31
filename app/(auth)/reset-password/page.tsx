"use client";

import { useActionState } from "react";
import { resetPassword } from "../actions";
import { FormInput } from "@/components/auth/form-input";
import { SubmitButton } from "@/components/auth/submit-button";

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState(resetPassword, null);

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-emerald-950 mb-1">Set a new password</h3>
        <p className="text-emerald-800/60 text-sm">Please type and confirm your new password to secure your account.</p>
      </div>

      <form action={formAction} className="space-y-4">
        <FormInput
          id="password"
          name="password"
          type="password"
          label="New password"
          autoComplete="new-password"
          required
        />

        <FormInput
          id="confirm_password"
          name="confirm_password"
          type="password"
          label="Confirm new password"
          autoComplete="new-password"
          required
        />

        {state?.error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm mb-4">
            {state.error}
          </div>
        )}

        <div className="pt-2">
          <SubmitButton pendingText="Saving password...">Update Password</SubmitButton>
        </div>
      </form>
    </>
  );
}
