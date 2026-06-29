"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setMsg({ text: error.message, type: "error" });
      return;
    }

    setMsg({ text: "Login successful! Redirecting…", type: "success" });
    setTimeout(() => router.push("/"), 1000);
  }

  return (
    <div className="auth-bg">
      {/* Page title above card (matches reference image) */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "380px" }}>
        <p className="auth-title">User Login</p>

        <div className="auth-card" style={{ width: "100%" }}>
          {/* Avatar */}
          <div className="auth-avatar">👤</div>

          {/* Message */}
          {msg && <div className={`auth-msg ${msg.type}`}>{msg.text}</div>}

          {/* Email */}
          <div className="auth-field">
            <span className="auth-field-icon">✉️</span>
            <input
              id="login-email"
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
              id="login-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>

          {/* Remember me / Forgot */}
          <div className="auth-row">
            <label className="auth-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a href="/forgot-password" className="auth-forgot">
              Forgot Password?
            </a>
          </div>

          {/* Button */}
          <button id="login-btn" className="auth-btn" onClick={login} disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>

          {/* Footer */}
          <div className="auth-footer">
            Don&apos;t have an account?{" "}
            <a href="/signup">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
}
