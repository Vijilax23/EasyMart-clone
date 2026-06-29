"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updatePassword() {
    setMsg(null);

    if (password.length < 6) {
      setMsg({ text: "Password must be at least 6 characters.", type: "error" });
      return;
    }

    if (password !== confirm) {
      setMsg({ text: "Passwords do not match.", type: "error" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMsg({ text: error.message, type: "error" });
    } else {
      setMsg({ text: "Password updated successfully!", type: "success" });
      setTimeout(() => router.push("/login"), 1500);
    }
  }

  return (
    <div className="auth-bg">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "380px" }}>
        <p className="auth-title">Reset Password</p>

        <div className="auth-card" style={{ width: "100%" }}>
          {/* Avatar */}
          <div className="auth-avatar">🛡️</div>

          {/* Message */}
          {msg && <div className={`auth-msg ${msg.type}`}>{msg.text}</div>}

          {/* Helper text */}
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "18px", textAlign: "center", lineHeight: 1.6 }}>
            Choose a strong new password for your account.
          </p>

          {/* New Password */}
          <div className="auth-field">
            <span className="auth-field-icon">🔒</span>
            <input
              id="reset-password"
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <span className="auth-field-icon">🔑</span>
            <input
              id="reset-confirm"
              type="password"
              placeholder="Confirm New Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              onKeyDown={(e) => e.key === "Enter" && updatePassword()}
            />
          </div>

          <div style={{ marginBottom: "6px" }} />

          {/* Button */}
          <button id="reset-btn" className="auth-btn" onClick={updatePassword} disabled={loading}>
            {loading ? "Updating…" : "Update Password"}
          </button>

          {/* Footer */}
          <div className="auth-footer">
            Back to{" "}
            <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}