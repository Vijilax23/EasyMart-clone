"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  async function logout() {
    await supabase.auth.signOut();
    alert("Logged out successfully");
    router.push("/login");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profile</h1>

      {user ? (
        <>
          <p>
            <b>Email:</b> {user.email}
          </p>

          <p>
            <b>User ID:</b> {user.id}
          </p>

          <button
            onClick={logout}
            style={{
              padding: "10px 20px",
              background: "red",
              color: "white",
              border: "none",
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
}