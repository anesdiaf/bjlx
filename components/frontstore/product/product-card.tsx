import { Button } from "@/components/ui/button";
import ProductCardThumbnails from "./product-card-thumbnails";
import Link from "next/link";
import { Handbag, HeartIcon } from "lucide-react";
import { formatNumbers } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProductWithVariantDataType } from "@/types"
import { getTranslations } from "next-intl/server";
export default async function ProductCard({ p }: { p: ProductWithVariantDataType }) {

  const { title } = p;
  const { price, promo_price, on_promo, thumbnails } = p.variants[0];

  const t = await getTranslations("All")

  return (
    <Link href={`/products/${p.id}`} key={p.id} className="w-full h-full space-y-3 relative ">
      <div className="flex flex-col gap-2 absolute top-1 right-1 z-50">
        <Button className="  group" size="icon-sm" variant="ghost"><HeartIcon className="group-hover:fill-primary transition" /></Button>
        {on_promo && <Badge className="bg-primary/50 text-white aspect-square">{(100 - ((Number(promo_price) * 100) / Number(price))).toFixed(1)}%</Badge>}
      </div>
      <ProductCardThumbnails thumbnails={thumbnails} />
      <div className="space-y-3">
        <h2>{title}</h2>
        <div className="flex justify-between items-center">
          {on_promo ?
            <div className="flex items-end gap-3 flex-1">
              <p className="font-medium ">{formatNumbers(promo_price!, "DZ-dz")} {t("currency_symbol")}</p>
              <p className="text-muted-foreground text-sm line-through">{formatNumbers(price, "DZ-dz")} {t("currency_symbol")}</p>
            </div>
            :
            <p className="font-medium ">{formatNumbers(price, "DZ-dz")} {t("currency_symbol")}</p>
          }
          <Handbag size={18} className="" />
        </div>

      </div>
    </Link>
  )
}