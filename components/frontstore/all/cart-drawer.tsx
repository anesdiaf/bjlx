"use client"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { formatNumbers } from "@/lib/utils"
import { useCartStore } from "@/src/context/cart-store-provider"
import { ChevronDown, ChevronUp, ImageOff, ShoppingBag, ShoppingCart, Trash2Icon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"




export default function CartDrawer() {

    const { items, isOpen, open, close, changeQty, remove } = useCartStore((state) => state)

    const [subtotal, setSubtotal] = useState<number>(0)
    const [discount, setDiscount] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)
    const [qty, setQty] = useState<number>(0)


    useEffect(() => {
        let currSubtotal = 0;
        let currDiscount = 0;
        let currTotal = 0;
        let totalQty = 0;

        items.forEach((currValue) => {
            const price = Number(currValue.price);
            const currQty = currValue.qty;

            currSubtotal += price * currQty;

            currDiscount += currValue.on_promo
                ? (price - Number(currValue.promo_price!)) * currQty
                : 0;

            currTotal += currValue.on_promo
                ? Number(currValue.promo_price!) * currQty
                : price * currQty;

            totalQty += currQty;
        });

        setSubtotal(currSubtotal)
        setDiscount(currDiscount)
        setTotal(currTotal)
        setQty(totalQty)
    }, [isOpen, items])


    return (
        <Drawer open={isOpen} onOpenChange={res => res ? open() : close()} swipeDirection="right">
            <DrawerTrigger className="relative cursor-pointer">
                <ShoppingBag strokeWidth={1.5} size={24} className="text-muted-foreground" />
                {qty !== 0 &&
                    <p className="text-[0.7rem] bg-primary/90 text-white aspect-square flex justify-center size-4 items-center absolute -top-2 -right-2">
                        {qty}
                    </p>
                }
            </DrawerTrigger>
            <DrawerContent className="w-[92vw] md:min-w-100 md:w-fit">
                <DrawerHeader>
                    <DrawerTitle>Votre panier</DrawerTitle>
                    <DrawerDescription>Votre sélection, prête à briller.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 w-full">
                    {items.length === 0 &&
                        <div className="flex flex-col items-center my-12 space-y-6">
                            <ShoppingCart size={128} className="text-primary" />
                            <div className="text-center">
                                <h1 className="text-lg font-medium text-muted-foreground">Votre panier est encore vide</h1>
                                <p className="text-muted-foreground text-sm text-justify">Découvrez nos bijoux et laissez-vous séduire par votre prochain coup de cœur. ✨</p>
                            </div>

                        </div>
                    }
                    {items.length !== 0 &&
                        <div className="flex flex-col items-center gap-4 w-full">
                            {items.map((item, index) => {
                                return (
                                    <div key={item.id} className="border-b border-dashed w-full py-3 flex items-start gap-2">
                                        <div className="aspect-square size-18 md:size-32 border flex justify-center items-center">
                                            {item.images[0].url ?
                                                <Image className="object-cover w-full h-full" src={`/api/uploads${item.images[0].url}`} width={128} height={128} alt={item.title} />
                                                :
                                                <ImageOff />
                                            }

                                        </div>
                                        <div className="w-full flex flex-col gap-2">
                                            <Link onClick={() => close()} href={`/products/${item.product_id}?variant=${item.id}`}>{item.title}</Link>
                                            <div>

                                            </div>
                                            <div className="w-full flex justify-between items-center">
                                                <div className="flex items-center w-full">
                                                    <Button
                                                        onClick={() => { item.qty > 1 && changeQty(item.id, item.qty - 1) }} variant="outline" size="icon-sm"><ChevronDown /></Button>
                                                    <p className="w-12 flex items-center justify-center border-y h-9">
                                                        {item.qty}
                                                    </p>
                                                    <Button
                                                        onClick={() => { (item.track_stock && item.qty < item.stock!) && changeQty(item.id, item.qty + 1) }} variant="outline" size="icon-sm"><ChevronUp /></Button>
                                                    <Popover>
                                                        <PopoverTrigger render={<Button
                                                            variant="destructive" size="icon-sm" className="border-red-500/12"><Trash2Icon /></Button>} />
                                                        <PopoverContent>
                                                            <PopoverHeader>
                                                                <PopoverTitle>Confirmation</PopoverTitle>
                                                            </PopoverHeader>
                                                            <Button onClick={() => { remove(item.id) }}>Confirmer</Button>
                                                        </PopoverContent>
                                                    </Popover>

                                                </div>
                                                <div>
                                                    {item.on_promo
                                                        ? <div><p className="whitespace-nowrap fontme">{formatNumbers(Number(item.promo_price) * item.qty)} D.A</p> <p className="whitespace-nowrap line-through text-xs float-right text-muted-foreground">{formatNumbers(Number(item.price) * item.qty)} D.A</p></div>
                                                        : <p className="whitespace-nowrap">{formatNumbers(Number(item.price) * item.qty)} D.A</p>}
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
                <DrawerFooter>
                    <div className="w-full border border-dashed px-2">
                        <div className="w-full flex justify-between items-center py-2 border-b border-dashed">
                            <p>Sous-total</p>
                            <p>{formatNumbers(subtotal, "US-us")} D.A</p>
                        </div>
                        <div className="w-full flex justify-between items-center py-2 border-b border-dashed">
                            <p>Remise</p>
                            <p>{formatNumbers(discount, "US-us")} D.A</p>
                        </div>
                        <div className="w-full flex justify-between items-center py-2 border-b border-dashed">
                            <p>Total</p>
                            <p>{formatNumbers(total, "US-us")} D.A</p>
                        </div>
                    </div>
                    <Link onClick={() => close()} href="/cart" className="w-full"><Button className="w-full">Voir le panier</Button></Link>
                    <DrawerClose onClick={() => close} render={<Button variant="outline" />}>Poursuivre vos achats</DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}