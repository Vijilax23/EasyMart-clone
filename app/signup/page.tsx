"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const [loading, setLoading] = useState(false);

  async function signup() {
    setMsg(null);

    if (password !== confirm) {
      setMsg({ text: "Passwords do not match.", type: "error" });
      return;
    }

    if (password.length < 6) {
      setMsg({ text: "Password must be at least 6 characters.", type: "error" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setMsg({ text: error.message, type: "error" });
      return;
    }

    setMsg({ text: "Account created! Please check your email to confirm.", type: "success" });
    setTimeout(() => router.push("/login"), 2500);
  }

  return (
    <div className="auth-bg">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "380px" }}>
        <p className="auth-title">Create Account</p>

        <div className="auth-card" style={{ width: "100%" }}>
          {/* Avatar */}
          <div className="auth-avatar">🧑</div>

          {/* Message */}
          {msg && <div className={`auth-msg ${msg.type}`}>{msg.text}</div>}

          {/* Email */}
          <div className="auth-field">
            <span className="auth-field-icon">✉️</span>
            <input
              id="signup-email"
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <span className="auth-field-icon">🔒</span>
            <input
              id="signup-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <span className="auth-field-icon">🔑</span>
            <input
              id="signup-confirm"
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              onKeyDown={(e) => e.key === "Enter" && signup()}
            />
          </div>

          <div style={{ marginBottom: "6px" }} />

          {/* Button */}
          <button id="signup-btn" className="auth-btn" onClick={signup} disabled={loading}>
            {loading ? "Creating Account…" : "Create Account"}
          </button>

          {/* Footer */}
          <div className="auth-footer">
            Already have an account?{" "}
            <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
