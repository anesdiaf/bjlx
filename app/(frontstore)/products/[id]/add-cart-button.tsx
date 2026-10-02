"use client"

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/src/context/cart-store-provider";
import { SingleCartItemType, VariantWithValuesImagesType } from "@/types";
import { useTranslations } from "next-intl";

export default function AddItemToCartButton({ title, variant }: { title: string, variant: VariantWithValuesImagesType }) {

    const { open, add, changeQty, items } = useCartStore(state => state)


    const addItemToCart = () => {
        // Check if item already added
        const itemExists = items.find(i => i.id === variant.id);

        if (itemExists) {
            // Increase qty
            
           (itemExists.track_stock && (itemExists.qty < itemExists.stock!)) && changeQty(itemExists.id, itemExists.qty + 1)
        } else {
            // Add item
            let cartItem: SingleCartItemType = { title, qty: 1, ...variant }
            add(cartItem);
        }

        // Open Cart Drawer
        open()
    }
    const t = useTranslations("All")
    return (
        <Button onClick={() => addItemToCart()} className="w-full">{t("add_to_cart")}</Button>
    )
}