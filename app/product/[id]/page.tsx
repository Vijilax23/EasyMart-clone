import { createClient } from "@supabase/supabase-js";
import AddToCart from "@/app/components/AddToCart";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="stars" style={{ fontSize: "18px", letterSpacing: "2px" }}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!product) {
    return (
      <div className="product-not-found">
        <span style={{ fontSize: "56px" }}>🔍</span>
        <h1>Product Not Found</h1>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/" className="hero-btn" style={{ marginTop: "8px", padding: "10px 28px", textDecoration: "none", display: "inline-block" }}>
          ← Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail-bg">
      {/* Breadcrumb */}
      <div style={{ maxWidth: "900px", margin: "0 auto 20px", fontSize: "13px", color: "#6b7280", display: "flex", gap: "6px", alignItems: "center" }}>
        <Link href="/" style={{ color: "#f97316", textDecoration: "none", fontWeight: 600 }}>Home</Link>
        <span>/</span>
        <span style={{ color: "#9ca3af" }}>{product.category}</span>
        <span>/</span>
        <span style={{ color: "#374151", fontWeight: 500 }}>{product.name}</span>
      </div>

      {/* Product Card */}
      <div className="product-detail-card">
        {/* Image */}
        <div className="product-detail-img">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Info */}
        <div className="product-detail-info">
          <span className="product-detail-category">{product.category}</span>

          <h1 className="product-detail-name">{product.name}</h1>

          {/* Rating */}
          <div className="product-detail-rating">
            <StarRating rating={product.rating} />
            <span>{product.rating} / 5</span>
          </div>

          <div className="product-detail-divider" />

          {/* Price */}
          <div className="product-detail-price">₹{product.price.toLocaleString()}</div>

          {/* In-stock badge */}
          <div className="product-detail-badge">
            <span>✓</span> In Stock — Free Delivery Available
          </div>

          <div className="product-detail-divider" />

          {/* Add to Cart */}
          <AddToCart product={product} className="product-detail-cart-btn" />

          {/* Back link */}
          <Link href="/" style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none", fontWeight: 500, marginTop: "4px" }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
