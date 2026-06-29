"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const [loading, setLoading] = useState(false);

  async function resetPassword() {
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setMsg({ text: error.message, type: "error" });
    } else {
      setMsg({ text: "Reset link sent! Check your email inbox.", type: "success" });
    }
  }

  return (
    <div className="auth-bg">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "380px" }}>
        <p className="auth-title">Forgot Password</p>

        <div className="auth-card" style={{ width: "100%" }}>
          {/* Avatar */}
          <div className="auth-avatar">🔓</div>

          {/* Message */}
          {msg && <div className={`auth-msg ${msg.type}`}>{msg.text}</div>}

          {/* Helper text */}
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "18px", textAlign: "center", lineHeight: 1.6 }}>
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          {/* Email */}
          <div className="auth-field">
            <span className="auth-field-icon">✉️</span>
            <input
              id="forgot-email"
              type="email"
              placeholder="Enter your Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              onKeyDown={(e) => e.key === "Enter" && resetPassword()}
            />
          </div>

          <div style={{ marginBottom: "8px" }} />

          {/* Button */}
          <button id="forgot-btn" className="auth-btn" onClick={resetPassword} disabled={loading}>
            {loading ? "Sending…" : "Send Reset Link"}
          </button>

          {/* Footer */}
          <div className="auth-footer">
            Remember your password?{" "}
            <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}