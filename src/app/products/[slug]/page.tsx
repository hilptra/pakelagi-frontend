import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/services/product-service";
import { formatRupiah, getConditionLabel, getStatusBadge } from "@/lib/utils";
import { ProductGallery } from "@/components/product/ProductGallery";
import { WhatsAppButton } from "@/components/product/WhatsAppButton";
import { ProductMeasurements } from "@/components/product/ProductMeasurements";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronRight, ArrowLeft, Tag, MapPin, Truck } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    return {
      title: `${product.name} (${product.size_label})`,
      description: product.description || `Preloved ${product.name} ukuran ${product.size_label} kondisi ${getConditionLabel(product.condition)}. Beli via WhatsApp di PakeLagi.`,
    };
  } catch {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  // Fetch related products in the same category
  const relatedProductsRes = await getProducts({
    category: product.category.slug,
    per_page: 4,
  }).catch(() => null);

  const relatedProducts = relatedProductsRes?.data.filter((p) => p.slug !== product.slug) || [];
  const statusInfo = getStatusBadge(product.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-12 bg-background">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-brand-muted">
        <Link href="/products" className="hover:text-brand-primary flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Katalog</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-brand-primary capitalize font-medium"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
        <span className="text-foreground font-semibold truncate max-w-37.5 sm:max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout matching Brand Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start bg-surface p-6 md:p-8 rounded-3xl border border-brand-border shadow-xs">
        
        {/* Left Column: Vertical Thumbnails + Main Photo Gallery */}
        <div className="md:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Product Metadata & Action */}
        <div className="md:col-span-5 flex flex-col gap-5">
          
          {/* Header Info */}
          <div className="space-y-2 border-b border-brand-border pb-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            <p className="text-2xl sm:text-3xl font-bold text-brand-primary pt-1">
              {formatRupiah(product.price)}
            </p>
          </div>

          {/* Badges Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-background text-foreground text-xs font-semibold px-3.5 py-1.5 rounded-full border border-brand-border">
              {getConditionLabel(product.condition)}
            </span>
            <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">
              {product.size_label}
            </span>
            <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Tags row */}
          <div className="flex items-center gap-3 text-xs text-brand-muted">
            <span className="font-semibold text-foreground capitalize">{product.category.name}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Jakarta</span>
            </span>
          </div>

          {/* Condition Notes */}
          {product.condition_notes && (
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Catatan Kondisi Seller:
              </span>
              <p className="text-amber-900 leading-relaxed">
                {product.condition_notes}
              </p>
            </div>
          )}

          {/* Measurements */}
          <ProductMeasurements measurements={product.measurements} />

          {/* Description */}
          {product.description && (
            <div className="space-y-2 text-xs sm:text-sm text-brand-muted leading-relaxed border-t border-brand-border pt-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Deskripsi Produk
              </h3>
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* WhatsApp Primary CTA & Delivery Note */}
          <div className="space-y-3 pt-4 border-t border-brand-border">
            <WhatsAppButton product={product} />

            <div className="flex items-center justify-center gap-1.5 text-xs text-brand-muted pt-1">
              <Truck className="w-4 h-4 text-brand-primary" />
              <span>Pengiriman: Bisa diambil langsung / COD (nego)</span>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-brand-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Produk Serupa di Kategori {product.category.name}
            </h2>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-xs font-semibold text-brand-primary hover:underline"
            >
              Lihat Kategori Ini
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
