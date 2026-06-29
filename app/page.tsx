import { supabase } from "@/lib/supabase";
import AddToCart from "./components/AddToCart";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="stars">
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

export default async function Home() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  return (
    <>
      {/* ── Navbar ──────────────────────────────── */}
      <header className="navbar">
        <Link href="/" className="logo">
          Easy<span>Mart</span>
        </Link>

        <div className="search-box">
          <input
            type="text"
            list="searchlist"
            id="searchInput"
            placeholder="Search for products, brands and more…"
          />
          <datalist id="searchlist">
            <option value="T-shirt" />
            <option value="Beauty" />
            <option value="Toys" />
            <option value="Headphones" />
            <option value="Mobiles" />
            <option value="Electronics" />
            <option value="Kitchen" />
          </datalist>
          <button aria-label="Search">🔍</button>
        </div>

        <nav className="nav-links">
          <a href="/login">
            <span className="nav-icon">👤</span>
            Account
          </a>
          <a href="/orders">
            <span className="nav-icon">📦</span>
            Orders
          </a>
          <a href="/cart">
            <span className="nav-icon">🛒</span>
            Cart
          </a>
        </nav>
      </header>

      {/* ── Secondary Menu ───────────────────────── */}
      <nav className="menu">
        <a href="#">Today&#39;s Deals</a>
        <a href="#">Electronics</a>
        <a href="#">Fashion</a>
        <a href="#">Mobiles</a>
        <a href="#">Home &amp; Kitchen</a>
        <a href="#">Beauty</a>
        <a href="#">Toys</a>
        <a href="#">Sports</a>
      </nav>

      {/* ── Hero Banner ──────────────────────────── */}
      <section className="hero" aria-label="Featured banner">
        <div className="hero-content">
          <h2>Shop <span>Smarter</span>,<br />Live Better</h2>
          <p>Discover incredible deals on electronics, fashion, home essentials &amp; more.</p>
          <a href="#products" className="hero-btn">Shop Now →</a>
        </div>
      </section>

      {/* ── Products ─────────────────────────────── */}
      <h1 className="section-header" id="products">Featured Products</h1>

      {error && (
        <p style={{ padding: "20px", color: "red" }}>
          Failed to load products: {error.message}
        </p>
      )}

      <section className="products" aria-label="Product listing">
        {(products as Product[])?.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} style={{ textDecoration: "none" }}>
            <div className="card">
              <div className="card-img-wrapper">
                <img src={product.image} alt={product.name} />
              </div>

              <h2>{product.name}</h2>

              <div className="card-rating">
                <StarRating rating={product.rating} />
                <span>{product.rating}</span>
              </div>

              <div className="card-price">₹{product.price.toLocaleString()}</div>

              <div className="card-category">{product.category}</div>

              <AddToCart product={product} />
            </div>
          </Link>
        ))}
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer>
        <p>© {new Date().getFullYear()} EasyMart Clone. All rights reserved.</p>
      </footer>
    </>
  );
}
