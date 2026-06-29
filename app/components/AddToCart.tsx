"use client";

import { supabase } from "@/lib/supabase";

export default function AddToCart({ product, className }: { product: any; className?: string }) {

  async function addCart() {

    // Step 1: Check existing item (NO .single())
    const { data: existingItem } = await supabase
      .from("cart")
      .select("*")
      .eq("product_id", product.id);

    const item = existingItem?.[0];

    if (item) {

      // Step 2: update quantity
      await supabase
        .from("cart")
        .update({
          quantity: item.quantity + 1
        })
        .eq("id", item.id);

    } else {

      // Step 3: insert new item
      await supabase
        .from("cart")
        .insert([
          {
            product_id: product.id,
            quantity: 1
          }
        ]);
    }

    alert("Added to cart");
  }

  return (
    <button className={className ?? "add-to-cart-btn"} onClick={addCart}>
      🛒 Add to Cart
    </button>
  );
}
