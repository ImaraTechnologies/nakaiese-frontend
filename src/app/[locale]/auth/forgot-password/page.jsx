import { ForgotPasswordForm } from "./form";
import { KeyRound } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
            <KeyRound className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            No worries, we will send you reset instructions.
          </p>
        </div>

        {/* Form Component */}
        <ForgotPasswordForm />

      </div>
    </div>
  );
}