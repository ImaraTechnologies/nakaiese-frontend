"use client";

import { useActionState } from "react"; 
import { useFormStatus } from "react-dom";
import { requestPasswordResetAction } from "@/hooks/useAuth";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn"; 

// Initial state for the form action
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
      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#216ba5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending Link...
        </>
      ) : (
        "Send Reset Link"
      )}
    </button>
  );
}

export function ForgotPasswordForm() {
  // 2. UPDATE HOOK USAGE: useActionState instead of useFormState
  const [state, formAction] = useActionState(requestPasswordResetAction, initialState);

  // Success View
  if (state?.success) {
    return (
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-green-800">Check your email</h3>
          <p className="mt-2 text-sm text-green-700">
            We sent a password reset link to <span className="font-semibold">{state.email}</span>
          </p>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Try another email
          </button>
          
          <Link
            href="/auth/login"
            className="block text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // Input Form View
  return (
    <form action={formAction} className="mt-8 space-y-6">
      
      {/* Global Error Message */}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <span>⚠️</span> {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            className={cn(
              "appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all",
              state?.fieldErrors?.email && "border-red-500 focus:ring-red-500"
            )}
          />
        </div>
        {/* Field Level Error */}
        {state?.fieldErrors?.email && (
          <p className="mt-1 text-sm text-red-600 font-medium">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <SubmitButton />

      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>
      </div>
    </form>
  );
}