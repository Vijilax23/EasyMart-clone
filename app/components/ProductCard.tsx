"use client";

type Product = {
  id:number;
  name:string;
  price:number;
  image:string;
  category:string;
};

export default function ProductCard({product}:{product:Product}) {
  return (
    <div className="card">

      <img src={product.image} width="200" />

      <h2>{product.name}</h2>

      <h3>₹{product.price}</h3>

      <p>{product.category}</p>

      <button>
        Add To Cart
      </button>

    </div>
  );
}