export const revalidate = 60;

import HomePageCarousel from "@/components/frontstore/homepage/carousel";
import ProductCardThumbnails from "@/components/frontstore/product/product-card-thumbnails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumbers } from "@/lib/utils";
import { Handbag, HeartIcon, Sparkle, Truck, UserRoundCheck } from "lucide-react";
import Link from "next/link";
import { getFeaturedProducts } from "../actions/products";

export default async function Home() {

  
  const { data: featuredProducts } = await getFeaturedProducts()


  return (
    <div className="flex flex-col flex-1 items-center font-sans gap-y-12">
      <HomePageCarousel />
      <div className="w-full space-y-6">
        <h1 className="text-center text-3xl font-serif">L&apos;Art de Briller</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 align-baseline relative">
          {(featuredProducts && featuredProducts.length !== 0) && featuredProducts.map(p => {
            const { title } = p;
            const { price, promo_price, on_promo, thumbnails } = p.variants[0];
            return (
              <Link href={`/products/${p.id}`} key={p.id} className="w-full space-y-3 relative">
                <div className="flex flex-col gap-2 absolute top-1 right-1 z-999">
                  <Button className="  group" size="icon-sm" variant="ghost"><HeartIcon className="group-hover:fill-primary transition" /></Button>
                  {on_promo && <Badge className="bg-primary/50 text-white aspect-square">{(100 - ((Number(promo_price) * 100) / Number(price))).toFixed(1)}%</Badge>}
                </div>
                <ProductCardThumbnails thumbnails={thumbnails} />
                <div className="space-y-3">
                  <h2>{title}</h2>
                  <div className="flex justify-between items-center">
                    {on_promo ?
                      <div className="flex items-end gap-3 flex-1">
                        <p className="font-medium ">{formatNumbers(promo_price!, "DZ-dz")} D.A</p>
                        <p className="text-muted-foreground text-sm line-through">{formatNumbers(price, "DZ-dz")} D.A</p>
                      </div>
                      :
                      <p className="font-medium ">{formatNumbers(price, "DZ-dz")} D.A</p>
                    }
                    <Handbag size={18} className="" />
                  </div>

                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex justify-evenly flex-col md:flex-row w-full bg-accent py-6">
        <div className="w-full text-center space-y-4 p-4 border-b md:border-0 md:border-r border-primary/20">
          <div className="flex flex-row justify-center items-center gap-2">
            <Sparkle className="text-primary" />
            <h2 className="text-lg md:text-xl font-medium">Qualité Exceptionnelle</h2>
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">Des bijoux élégants, soigneusement sélectionnés pour durer.</p>
        </div>
        <div className="w-full text-center space-y-4 p-4 border-b md:border-0 md:border-r border-primary/20">
          <div className="flex flex-row justify-center items-center gap-2">
            <Truck className="text-primary" />
            <h2 className="text-lg md:text-xl font-medium">Livraison fiable</h2>
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">Livraison rapide et sécurisée dans les 69 wilayas d’Algérie.</p>
        </div>
        <div className="w-full text-center space-y-4 p-4">
          <div className="flex flex-row justify-center items-center gap-2">
            <UserRoundCheck className="text-primary" />
            <h2 className="text-lg md:text-xl font-medium">Le Client D&apos;abord</h2>
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">Nous sommes toujours là pour rendre votre expérience exceptionnelle.</p>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-serif">Contes de fées du quotidien</h2>
        <p className="text-center text-muted-foreground">Suivez-nous sur Instagram <a href="https://www.instagram.com/bjlx_dz">@bjlx_dz</a></p>
      </div>
    </div>
  );
}
