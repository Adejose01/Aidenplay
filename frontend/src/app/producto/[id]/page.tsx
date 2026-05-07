import { pb, getSiteSettings } from "@/lib/pocketbase";
import type { Product } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetails from "./ProductDetails";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  let baseProduct: Product;
  let variants: Product[] = [];
  
  try {
    // 1. Obtener el producto base por ID
    baseProduct = await pb.collection("products").getOne<Product>(resolvedParams.id, {
      cache: 'no-store'
    });
    
    // 2. Obtener TODOS los productos que tengan exactamente el mismo título
    const records = await pb.collection("products").getList<Product>(1, 50, {
      filter: `title = "${baseProduct.title}" && is_active = true`,
      cache: 'no-store'
    });
    variants = records.items;
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }

  const settings = await getSiteSettings();
  const rates = {
    ars: settings?.exchange_rate_ars || 1415,
    rd: settings?.exchange_rate_rd || 58
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark pt-24 pb-20">
        <ProductDetails variants={variants} rates={rates} baseProduct={baseProduct} />
      </main>
      <Footer />
    </>
  );
}
