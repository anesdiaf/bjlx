"use client"

import { getAttributes } from "@/app/actions/attributes"
import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { formatNumbers } from "@/lib/utils"
import { useCartStore } from "@/src/context/cart-store-provider"
import { AttributeWithValuesType } from "@/types"
import { ChevronDown, ChevronUp, ImageOff, ShoppingCart, Trash2Icon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function CartItems() {
    const { items, itemsLoaded, close, changeQty, remove, reset } = useCartStore((state) => state)


    const [subtotal, setSubtotal] = useState<number>(0)
    const [discount, setDiscount] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)
    const [qty, setQty] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)

    const [variantAttributes, setVariantAttributes] = useState<AttributeWithValuesType[]>([])

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


        if (variantAttributes.length === 0) {
            getAttributes()
                .then(res => {
                    if (res.success) {
                        setVariantAttributes(res.data!)
                    }
                })
        }

    }, [items])


    return (
        <div className="gap-6 flex flex-col md:flex-row md:items-start h-full flex-1">
            {itemsLoaded ?
                <div className="w-full">
                    {items.length === 0 &&
                        <div className="flex flex-col items-center my-12 space-y-6">
                            <ShoppingCart size={128} className="text-primary" />
                            <div className="text-center">
                                <h1 className="font-medium text-muted-foreground mb-3">Votre panier est encore vide</h1>
                                <p className="text-muted-foreground text-justify md:w-2/3 mx-auto text-xs">Découvrez nos bijoux et laissez-vous séduire par votre prochain coup de cœur. ✨</p>
                            </div>
                            <Link href="/"><Button>Découvrir nos bijoux</Button></Link>
                        </div>
                    }
                    {items.length !== 0 &&
                        <div className="gap-6 flex flex-col md:flex-row md:items-start h-full flex-1">
                            <div className="w-full flex-1">
                                <div className="w-full flex items-center justify-between pb-3 border-b border-dashed">
                                    <h2 className="text-xs font-semibold tracking-wide uppercase">Articles du panier</h2>
                                    <Popover>
                                        <PopoverTrigger render={
                                            <Button size="sm" variant="destructive">
                                                <span className="hidden md:block ">Vider le panier</span>
                                                <Trash2Icon className="md:hidden" />
                                            </Button>} />
                                        <PopoverContent>
                                            <PopoverHeader>
                                                <PopoverTitle>Vider le panier ?</PopoverTitle>
                                            </PopoverHeader>
                                            <Button onClick={() => reset()}>Confirmer</Button>
                                        </PopoverContent>
                                    </Popover>

                                </div>

                                <div className="flex flex-col items-center gap-4 w-full py-4">
                                    {items.map((item, index) => {
                                        return (
                                            <div key={item.id} className="flex flex-col w-full">
                                                <Link onClick={() => close()} href={`/products/${item.product_id}?variant=${item.id}`}>{item.title}</Link>
                                                <div key={item.id} className="border-b border-dashed w-full py-3 flex items-end gap-2">
                                                    <div className="aspect-square size-18 md:size-32 border flex justify-center items-center">
                                                        {item.images[0].url ?
                                                            <Image className="object-cover w-full h-full" src={`/api/uploads${item.images[0].url}`} width={128} height={128} alt={item.title} />
                                                            :
                                                            <ImageOff />
                                                        }
                                                    </div>

                                                    <div className="w-full flex flex-col h-full justify-between gap-2">
                                                        <div className="flex-1 h-full flex items-center gap-2">
                                                            <p className="text-xs text-muted-foreground">{item.sku}</p>
                                                            {item.values.length !== 0 && item.values[0].values &&
                                                                <div className="flex items-center gap-2">
                                                                    {Object.keys(item.values[0].values!).map((a, index) => {
                                                                        const attrID = Number(a)
                                                                        const currentAttribute = variantAttributes.find(attr => attr.id === attrID)
                                                                        const attributeTitle = currentAttribute?.title
                                                                        const attributeValue = currentAttribute?.values.find(v => v.id === item.values[0].values![attrID])?.value

                                                                        return (
                                                                            <p key={a} className="text-xs">{index === 0 && " - "} {attributeTitle}:<span> {attributeValue}</span> {index !== Object.keys(item.values[0].values!).length - 1 && " - "}</p>
                                                                        )
                                                                    })}
                                                                </div>
                                                            }
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
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>
                            <div className="w-full md:w-80 lg:w-100 sticky bottom-0 md:top-0 right-0 bg-white py-2">
                                <h2 className="text-xs font-semibold tracking-wide uppercase pb-2 md:pb-6 border-b border-dashed">Résume</h2>
                                <div className="space-y-4 pt-4 text-sm">
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
                                    <Link href="/checkout">
                                        <Button className="w-full">Passer au paiement</Button>
                                    </Link>

                                </div>
                            </div>
                        </div>
                    }
                </div>

                :

                <div className="w-full h-full flex justify-center items-center flex-1">
                    <Item variant="muted" className="w-fit">
                        <ItemMedia>
                            <Spinner />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle className="line-clamp-1">Récupération des données du panier...</ItemTitle>
                        </ItemContent>
                    </Item>
                </div>}

        </div >
    )
}