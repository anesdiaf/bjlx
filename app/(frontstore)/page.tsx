import HomePageCarousel from "@/components/frontstore/homepage/carousel";
import ProductCardThumbnails from "@/components/frontstore/product/product-card-thumbnails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatNumbers } from "@/lib/utils";
import { db } from "@/src";
import { Handbag, HeartIcon, ShoppingBag, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface productCardType {
  id: number;
  title: string;
  desc: string | null;
  status: boolean | null;
  meta_url_key: string;
  meta_title: string;
  meta_desc: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  category_id: number | null;
  collection_id: number | null;
  featured: boolean | null;
}

export default async function Home() {

  const featuredProducts = await db.query.product.findMany({
    where: {
      featured: true,
    },
    with: {
      variants: {
        where: {
          default: true
        },
        with: {
          thumbnails: true
        }
      }
    }
  })

  return (
    <div className="flex flex-col flex-1 items-center font-sans gap-y-12">
      <HomePageCarousel />
      <div className="w-full space-y-6">
        <h1 className="text-center text-3xl font-serif">L&apos;Art de Briller</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 items-center relative">
          {featuredProducts.map(p => {
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
                      <p className="font-medium ">{formatNumbers(price, "DZ-dz")} D.A</p>}
                    <Handbag size={18} className="" />
                  </div>

                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-serif">Contes de fées du quotidien</h2>
        <p className="text-center text-muted-foreground">Suivez-nous sur Instagram <a href="https://">@bjluxe</a></p>
      </div>
      <div className="flex justify-evenly w-full">
        <div className="w-full text-center">
          <h2 className="text-xl">Livraison fiable</h2>
          <p className="text-muted-foreground">Lorem ipsum</p>
        </div>
        <Separator orientation="vertical" />
        <div className="w-full text-center">
          <h2 className="text-xl">Livraison fiable</h2>
          <p className="text-muted-foreground">Lorem ipsum</p>
        </div>
        <Separator orientation="vertical" />
        <div className="w-full text-center">
          <h2 className="text-xl">Livraison fiable</h2>
          <p className="text-muted-foreground">Lorem ipsum</p>
        </div>
      </div>
    </div>
  );
}
