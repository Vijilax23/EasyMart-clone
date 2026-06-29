"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchCart() {
    const { data, error } = await supabase
      .from("cart")
      .select(`
        id,
        quantity,
        products (
          id,
          name,
          category,
          price,
          image,
          rating
        )
      `);

    if (!error && data) {
      setCart(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  async function increase(id: number, quantity: number) {
    await supabase
      .from("cart")
      .update({ quantity: quantity + 1 })
      .eq("id", id);
    fetchCart();
  }

  async function decrease(id: number, quantity: number) {
    if (quantity === 1) {
      await supabase.from("cart").delete().eq("id", id);
    } else {
      await supabase
        .from("cart")
        .update({ quantity: quantity - 1 })
        .eq("id", id);
    }
    fetchCart();
  }

  async function removeItem(id: number) {
    await supabase.from("cart").delete().eq("id", id);
    fetchCart();
  }

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.products.price,
    0
  );

  if (loading) {
    return (
      <div className="page-teal-loading">
        <span>🛒</span>
        <h2>Loading your cart…</h2>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="page-teal-loading">
        <span>🛍️</span>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <a href="/">Browse Products</a>
      </div>
    );
  }

  return (
    <div className="page-teal-bg">
      <p className="page-teal-title">My Cart</p>

      <div className="page-teal-wrap">
        {/* Cart Items */}
        {cart.map((item) => (
          <div className="cart-card" key={item.id}>
            <img
              className="cart-card-img"
              src={item.products.image}
              alt={item.products.name}
            />

            <div className="cart-card-info">
              <div className="cart-card-name">{item.products.name}</div>
              <div className="cart-card-category">{item.products.category}</div>
              <div className="cart-card-price">
                ₹{(item.products.price * item.quantity).toLocaleString()}
              </div>

              <div className="cart-qty">
                <button
                  className="cart-qty-btn"
                  onClick={() => decrease(item.id, item.quantity)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="cart-qty-num">{item.quantity}</span>
                <button
                  className="cart-qty-btn"
                  onClick={() => increase(item.id, item.quantity)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginLeft: "4px" }}>
                  × ₹{item.products.price} each
                </span>
              </div>
            </div>

            <button
              className="cart-remove-btn"
              onClick={() => removeItem(item.id)}
            >
              🗑 Remove
            </button>
          </div>
        ))}

        {/* Total */}
        <div className="cart-total">
          <div>
            <div className="cart-total-label">Total Amount</div>
            <div className="cart-total-amount">₹{total.toLocaleString()}</div>
          </div>
          <button className="cart-checkout-btn" onClick={() => router.push("/checkout")}>
            Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
