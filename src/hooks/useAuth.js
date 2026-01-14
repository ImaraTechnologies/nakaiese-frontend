"use server";

import { z } from "zod";

// 1. Zod Validation for the Form
const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  uid: z.string(),   // Captured from URL
  token: z.string(), // Captured from URL
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function resetPasswordAction(prevState, formData) {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const uid = formData.get("uid");
  const token = formData.get("token");

  // 2. Validate Form Data
  const validatedFields = ResetPasswordSchema.safeParse({
    password,
    confirmPassword,
    uid,
    token,
  });

  if (!validatedFields.success) {
    return {
      error: "Validation failed",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 3. Send Request to Django Backend
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
    
    const response = await fetch(`${API_URL}/auth/password/reset/confirm/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Matches PasswordResetConfirmSerializer fields:
        uidb64: validatedFields.data.uid, 
        token: validatedFields.data.token,
        new_password: validatedFields.data.password, 
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle Django field errors (e.g. { token: ["Invalid link"], new_password: ["Too common"] })
      const errorMessage = 
        data.token?.[0] || 
        data.new_password?.[0] || 
        data.detail || 
        "Failed to reset password.";
      return { error: errorMessage };
    }

    return { success: true };

  } catch (error) {
    console.error("Reset Password Error:", error);
    return { error: "Network error. Please try again." };
  }
}

const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export async function requestPasswordResetAction(prevState, formData) {
  const email = formData.get("email");

  // 2. Validate Email
  const validatedFields = ForgotPasswordSchema.safeParse({ email });

  if (!validatedFields.success) {
    return {
      error: "Validation failed",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 3. Call Django Backend
  try {
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
    
    // Calls your PasswordResetRequestView
    const response = await fetch(`${API_URL}/auth/password/reset/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: validatedFields.data.email,
      }),
      cache: "no-store",
    });

    // Note: Your backend returns 200 OK even if the user doesn't exist (security best practice)
    if (!response.ok) {
      return { error: "Unable to process request. Please try again later." };
    }

    return { success: true, email: validatedFields.data.email };

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return { error: "Network error. Please check your connection." };
  }
}