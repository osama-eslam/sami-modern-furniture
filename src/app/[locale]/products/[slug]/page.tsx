import { notFound } from "next/navigation";
import { categoryBySlug } from "@/data/categories";
import { isLocale, localePath, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { allProducts, completeTheLook, productBySlug, similarProducts, youMayLike } from "@/lib/catalog";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { ProductRail } from "@/components/product/ProductRail";
import { ProductView } from "@/components/product/ProductView";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { Breadcrumbs, JsonLd, SectionHeading } from "@/components/ui/primitives";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => allProducts().map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/products/[slug]">) {
  const { locale, slug } = await params;
  const product = productBySlug(slug);
  if (!isLocale(locale) || !product) return {};
  return buildMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.name[locale],
    description: `${product.shortDescription[locale]} ${product.description[locale]}`.slice(0, 158),
    image: product.images[0].src.replace("w=2400", "w=1200&h=630"),
  });
}

export default async function ProductPage({ params }: PageProps<"/[locale]/products/[slug]">) {
  const { locale, slug } = await params;
  const product = productBySlug(slug);
  if (!isLocale(locale) || !product) notFound();
  const dict = getDictionary(locale);
  const h = (p: string) => localePath(locale, p);
  const category = categoryBySlug(product.category);
  const look = completeTheLook(product);
  const similar = similarProducts(product);
  const like = youMayLike(product);

  return (
    <>
      <JsonLd data={productJsonLd(product, locale)} />
      <div className="container-x pt-[calc(var(--header-h)+var(--notice-h)+1.5rem)] pb-20 md:pb-28">
        <Breadcrumbs
          className="mb-8"
          items={[
            { name: dict.nav.home, href: h("/") },
            { name: dict.nav.shop, href: h("/shop") },
            ...(category ? [{ name: category.name[locale], href: h(`/categories/${category.slug}`) }] : []),
            { name: product.name[locale], href: h(`/products/${product.slug}`) },
          ]}
        />
        <ProductView product={product} categoryName={category?.name[locale] ?? ""} />
      </div>

      {look.length > 0 && (
        <section className="section bg-paper">
          <div className="container-x">
            <SectionHeading eyebrow="SAMY MODERN / STYLING" title={dict.product.completeLook} />
            <div className="mt-12">
              <ProductRail products={look} label={dict.product.completeLook} />
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="SAMY MODERN / SIMILAR"
            title={dict.product.similar}
            action={category ? { href: h(`/categories/${category.slug}`), label: category.name[locale] } : undefined}
          />
          <div className="mt-12">
            <ProductRail products={similar} label={dict.product.similar} />
          </div>
        </div>
      </section>

      {like.length > 0 && (
        <section className="section !pt-0">
          <div className="container-x">
            <SectionHeading eyebrow="SAMY MODERN / FOR YOU" title={dict.product.youMayLike} />
            <div className="mt-12">
              <ProductRail products={like} label={dict.product.youMayLike} />
            </div>
          </div>
        </section>
      )}

      <RecentlyViewed excludeId={product.id} className="section !pt-0" />
    </>
  );
}
