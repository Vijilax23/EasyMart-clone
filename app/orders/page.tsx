"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function statusClass(status: string) {
  const s = status?.toLowerCase();
  if (s === "delivered") return "delivered";
  if (s === "pending") return "pending";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  return "default";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        total_amount,
        status,
        created_at,
        order_items (
          quantity,
          price,
          products (
            name,
            image
          )
        )
      `)
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
    }

    setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="page-teal-loading">
        <span>📦</span>
        <h2>Loading your orders…</h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="page-teal-loading">
        <span>🛒</span>
        <h2>No orders yet</h2>
        <p>You haven&apos;t placed any orders. Start shopping!</p>
        <a href="/">Browse Products</a>
      </div>
    );
  }

  return (
    <div className="page-teal-bg">
      <p className="page-teal-title">My Orders</p>

      <div className="page-teal-wrap">
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            {/* Header */}
            <div className="order-card-header">
              <div>
                <div className="order-id">
                  Order <span>#{order.id}</span>
                </div>
                <div className="order-date">
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>

              <span className={`order-status ${statusClass(order.status)}`}>
                {order.status}
              </span>

              <div className="order-total-line">
                Total: <strong>₹{order.total_amount?.toLocaleString()}</strong>
              </div>
            </div>

            {/* Items */}
            <div className="order-card-body">
              {order.order_items.map((item: any, index: number) => (
                <div className="order-item-row" key={index}>
                  <img
                    className="order-item-img"
                    src={item.products.image}
                    alt={item.products.name}
                  />
                  <div>
                    <div className="order-item-name">{item.products.name}</div>
                    <div className="order-item-meta">
                      <span>📦 Qty: {item.quantity}</span>
                      <span>₹{item.price?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
