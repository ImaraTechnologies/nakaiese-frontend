import { ResetPasswordForm } from "./form"; 
import { LockKeyhole } from "lucide-react";
import Link from "next/link";

// 1. Make the component async
export default async function ResetPasswordPage({ params }) {
  // 2. Await the params object before destructuring
  const { uid, token } = await params;

  if (!uid || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="bg-red-100 p-3 rounded-full w-fit mx-auto">
            <LockKeyhole className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Invalid Link</h1>
          <p className="text-slate-600">
            This link appears to be incomplete. Please check your email again.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
            <LockKeyhole className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your new password below to access your account.
          </p>
        </div>

        {/* Pass params to the Client Component Form */}
        <ResetPasswordForm uid={uid} token={token} />
      </div>
    </div>
  );
}