export const revalidate = 60;

import HomePageCarousel from "@/components/frontstore/homepage/carousel";
import { getFeaturedProducts } from "../actions/products";
import ProductCard from "@/components/frontstore/product/product-card";
import { Sparkle, Truck, UserRoundCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Home() {

  
  const { data: featuredProducts } = await getFeaturedProducts()
  
  const t = await getTranslations('HomePage');

  return (
    <div className="flex flex-col flex-1 items-center font-sans gap-6 lg:gap-y-12">
      <HomePageCarousel />
      <div className="w-full space-y-6">
        <h1 className="text-center text-3xl font-serif">{t("featured_title")}</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 relative">
          {(featuredProducts && featuredProducts.length !== 0) && featuredProducts.map(p => {
            return (
              <ProductCard key={p.id} p={p}/>
            )
          })}
        </div>
      </div>

      <div className="flex justify-evenly flex-col md:flex-row w-full bg-accent py-6">
        <div className="w-full text-center space-y-4 p-4 border-b md:border-0 md:border-r border-primary/20">
          <div className="flex flex-row justify-center items-center gap-2">
            <Sparkle className="text-primary" />
            <h2 className="text-lg md:text-xl font-medium">{t("trust_strip_quality")}</h2>
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">{t("trust_strip_quality_desc")}</p>
        </div>
        <div className="w-full text-center space-y-4 p-4 border-b md:border-0 md:border-r border-primary/20">
          <div className="flex flex-row justify-center items-center gap-2">
            <Truck className="text-primary" />
            <h2 className="text-lg md:text-xl font-medium">{t("trust_strip_delivery")}</h2>
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">{t("trust_strip_delivery_desc")}</p>
        </div>
        <div className="w-full text-center space-y-4 p-4">
          <div className="flex flex-row justify-center items-center gap-2">
            <UserRoundCheck className="text-primary" />
            <h2 className="text-lg md:text-xl font-medium">{t("trust_strip_customer")}</h2>
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">{t("trust_strip_customer_desc")}</p>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-serif">{t("ig_news")}</h2>
        <p className="text-center text-muted-foreground">{t("ig_news_desc")} <a href="https://www.instagram.com/bjlx_dz">@bjlx_dz</a></p>
      </div>
    </div>
  );
}
