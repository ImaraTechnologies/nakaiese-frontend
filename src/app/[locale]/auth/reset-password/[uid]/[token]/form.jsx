"use client";

// 1. UPDATE IMPORT: 'useActionState' comes from 'react' now
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { resetPasswordAction } from "@/hooks/useAuth"; 
import { PasswordInput } from "@/components/ui/PasswordInput/PasswordInput"; 
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialState = {
  error: "",
  fieldErrors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#216ba5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating Password...
        </>
      ) : (
        "Reset Password"
      )}
    </button>
  );
}

export function ResetPasswordForm({ uid, token }) {
  // 2. UPDATE HOOK: Use 'useActionState' instead of 'useFormState'
  const [state, formAction] = useActionState(resetPasswordAction, initialState);
  
  // Note: useActionState also returns [state, action, isPending], 
  // but since you use useFormStatus in the button, we can just destructure the first two.
  
  const [password, setPassword] = useState("");

  if (state?.success) {
    return (
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-green-800">Password Updated!</h3>
          <p className="mt-2 text-sm text-green-700">
            You can now log in with your new password.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="w-full inline-flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {/* Hidden inputs to pass URL params to the Server Action */}
      <input type="hidden" name="uid" value={uid} />
      <input type="hidden" name="token" value={token} />
      
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <span>⚠️</span> {state.error}
        </div>
      )}

      <div className="space-y-4">
        <PasswordInput
          label="New Password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={state?.fieldErrors?.password?.[0]}
          showStrength={true}
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="••••••••"
          error={state?.fieldErrors?.confirmPassword?.[0]}
        />
      </div>

      <SubmitButton />

      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </form>
  );
}