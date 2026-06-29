"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  quantity: number;
  product_id: number;
  products: {
    id: number;
    name: string;
    price: number;
    image?: string;
    category?: string;
  };
};

type Step = "review" | "details" | "placing" | "success";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("review");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Delivery details state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  async function fetchCart() {
    const { data, error } = await supabase
      .from("cart")
      .select(`
        id,
        quantity,
        product_id,
        products (
          id,
          name,
          price,
          image,
          category
        )
      `);

    setCart((data as unknown as CartItem[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * (item.products?.price || 0),
    0
  );
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  async function placeOrder() {
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      setError("Please fill in all delivery details.");
      return;
    }
    setError(null);
    setStep("placing");

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{ total_amount: total, status: "pending" }])
      .select()
      .single();

    if (orderError) {
      setError(orderError.message);
      setStep("details");
      return;
    }

    // Insert order items
    const orderItems = cart.map((item) => ({
      order_id: order.id,
      product_id: item.products?.id || item.product_id,
      quantity: item.quantity,
      price: item.products?.price || 0,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      setError(itemsError.message);
      setStep("details");
      return;
    }

    // Clear cart
    await supabase.from("cart").delete().neq("id", 0);

    setStep("success");
  }

  /* -- Loading ---- */
  if (loading) {
    return (
      <div className="page-teal-loading">
        <span>🛒</span>
        <h2>Loading checkout…</h2>
      </div>
    );
  }

  /* -- Empty cart ---- */
  if (cart.length === 0 && step !== "success") {
    return (
      <div className="page-teal-loading">
        <span>🛍️</span>
        <h2>Your cart is empty</h2>
        <p>Add products before checking out.</p>
        <a href="/">Browse Products</a>
      </div>
    );
  }

  /* -- Success ---- */
  if (step === "success") {
    return (
      <div className="checkout-bg">
        <div className="checkout-success">
          <div className="checkout-success-icon">✓</div>
          <h1 className="checkout-success-title">Order Placed!</h1>
          <p className="checkout-success-sub">
            Thank you, <strong>{name || "Customer"}</strong>! Your order is being processed.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button className="checkout-place-btn" onClick={() => router.push("/orders")}>
              View My Orders
            </button>
            <button
              className="checkout-back-btn"
              onClick={() => router.push("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -- Placing (spinner) ---- */
  if (step === "placing") {
    return (
      <div className="page-teal-loading">
        <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⚙️</span>
        <h2>Placing your order…</h2>
        <p>Please wait a moment.</p>
      </div>
    );
  }

  return (
    <div className="checkout-bg">
      {/* Blobs */}
      <div className="checkout-blob checkout-blob-1" />
      <div className="checkout-blob checkout-blob-2" />

      <div className="checkout-wrap">

        {/* -- Left: Order Summary ---- */}
        <div className="checkout-summary">
          <div className="checkout-section-title">
            🛒 Order Summary
            <span className="checkout-badge">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
          </div>

          <div className="checkout-items">
            {cart.map((item) => (
              <div className="checkout-item" key={item.id}>
                {item.products?.image && (
                  <img
                    className="checkout-item-img"
                    src={item.products.image}
                    alt={item.products.name}
                  />
                )}
                <div className="checkout-item-info">
                  <div className="checkout-item-name">{item.products?.name}</div>
                  <div className="checkout-item-meta">
                    <span>Qty: {item.quantity}</span>
                    <span>₹{item.products?.price?.toLocaleString()} each</span>
                  </div>
                </div>
                <div className="checkout-item-total">
                  ₹{(item.quantity * (item.products?.price || 0)).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="checkout-total-row">
              <span>Delivery</span>
              <span style={{ color: "#86efac" }}>FREE</span>
            </div>
            <div className="checkout-total-row checkout-total-final">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* -- Right: Delivery Details ---- */}
        <div className="checkout-form-card">
          <div className="checkout-section-title" style={{ marginBottom: "24px" }}>
            📦 Delivery Details
          </div>

          {error && (
            <div className="auth-msg error" style={{ marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <div className="checkout-form-grid">
            <div className="checkout-field-wrap">
              <label className="checkout-label">Full Name</label>
              <div className="checkout-field">
                <span className="checkout-field-icon">👤</span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="checkout-field-wrap">
              <label className="checkout-label">Phone Number</label>
              <div className="checkout-field">
                <span className="checkout-field-icon">📞</span>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="checkout-field-wrap" style={{ marginBottom: "14px" }}>
            <label className="checkout-label">Street Address</label>
            <div className="checkout-field">
              <span className="checkout-field-icon">🏠</span>
              <input
                type="text"
                placeholder="House no., Street, Locality"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="checkout-form-grid">
            <div className="checkout-field-wrap">
              <label className="checkout-label">City</label>
              <div className="checkout-field">
                <span className="checkout-field-icon">🏙️</span>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className="checkout-field-wrap">
              <label className="checkout-label">PIN Code</label>
              <div className="checkout-field">
                <span className="checkout-field-icon">📮</span>
                <input
                  type="text"
                  placeholder="6-digit PIN"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          {/* Payment note */}
          <div className="checkout-payment-note">
            <span>💳</span>
            <span>Cash on Delivery — Pay when your order arrives</span>
          </div>

          {/* CTA */}
          <button className="checkout-place-btn" onClick={placeOrder}>
            Place Order · ₹{total.toLocaleString()}
          </button>

          <button className="checkout-back-btn" onClick={() => router.push("/cart")}>
            ← Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
