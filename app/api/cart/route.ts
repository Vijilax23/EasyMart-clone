import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
  .from("cart")
  .select(`
    id,
    quantity,
    products (
      id,
      name,
      image,
      price
    )
  `);
  if (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }

  return NextResponse.json({
    success: true,
    cart: data,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { product_id } = body;

  const { data, error } = await supabase
    .from("cart")
    .insert([
      {
        product_id,
        quantity: 1,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }

  return NextResponse.json({
    success: true,
    cart: data,
  });
}
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }

  return NextResponse.json({
    success: true,
  });
}