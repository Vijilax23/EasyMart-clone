"use client";

import { supabase } from "@/lib/supabase";

export default function RemoveFromCart({ id }: any) {

  async function removeItem() {

    await supabase
      .from("cart")
      .delete()
      .eq("id", id);

    location.reload();
  }

  return (
    <button onClick={removeItem}>
      Remove</button>
  );
}