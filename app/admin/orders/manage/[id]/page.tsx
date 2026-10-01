import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Item, ItemTitle } from "@/components/ui/item"
import { capitalizeFirstLetter, cn, formatNumbers } from "@/lib/utils"
import { db } from "@/src"
import { ChevronLeft, ImageOff, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ChangeOrderStatus from "./change-order-status"
import DynamicIcon from "@/components/admin/all/dynamic-icon"
import DeleteOrderButton from "../../delete-order-button"

export default async function ManageOrderAdminPage({
    params,
}: {
    params: Promise<{ id: number }>
}) {
    const { id } = await params

    const orderData = await db.query.order.findFirst({
        where: {
            id
        },
        with: {
            items: {
                with: {
                    variant: {
                        with: {
                            images: true,
                            values: true
                        }
                    },
                    product: true
                }
            },
            orderStatus: true,
            history: {
                with: {
                    status: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            },
            info: true,
            zone: {
                with: {
                    shippingProvider: true,
                    wilaya: true,
                    commune: true,
                }
            }
        }
    })

    if (!orderData) {
        return <div>Order not found</div>
    }

    const commune = await db.query.commune.findFirst({
        where: {
            id: orderData.info?.commune_id!,
        },
        with: {
            wilaya: true
        }
    })

    const variantAttributes = await db.query.attribute.findMany({
        with: {
            values: true
        }
    })

    return (
        <div className="w-full space-y-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
                        <Button size="icon-lg"><ChevronLeft /></Button>
                    </Link>
                    <div className="flex gap-2 w-full">
                        <h3 className="text-2xl whitespace-nowrap">Commande #{orderData?.order_number}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-center text-xs font-medium px-3 h-10 w-fit flex items-center gap-2"
                        style={{
                            backgroundColor: orderData.orderStatus!.color ? orderData.orderStatus!.color.replace(')', ' / 20%)') : "oklch(55.1% 0.027 264.364 / 10%)",
                            color: orderData.orderStatus!.color ? orderData.orderStatus!.color : "oklch(55.1% 0.027 264.364)"
                        }}>
                        <DynamicIcon name={orderData.orderStatus!.icon ?? undefined} />
                        {orderData.orderStatus!.title}
                    </div>
                    <ChangeOrderStatus status_id={orderData.orderStatus?.id!} order_id={id} payment_status={orderData.payment_status} />
                    <DeleteOrderButton id={id} />
                </div>

            </div>
            <div className="flex gap-6 w-full">
                <div className="w-full space-y-6">
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>Données client</CardTitle>
                            <div className={cn("bg-primary/20 text-primary flex items-center p-1 px-2 gap-2", orderData.guest ? "bg-gray-500" : "bg-green-500/20 text-green-600")}>
                                <div className={cn("w-1.5 h-1.5", orderData.guest ? "bg-gray-500" : "bg-green-600")}></div>
                                <p>{orderData.guest ? "Invité" : "Enregistré"}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col">
                                <div className="py-3 border-b border-dashed flex justify-between w-full">
                                    <p>Nom</p>
                                    <p>{orderData.info?.name}</p>
                                </div>
                                <div className="py-3 border-b border-dashed flex justify-between w-full">
                                    <p>Télephone</p>
                                    <p>{orderData.info?.phone}</p>
                                </div>
                                <div className="py-3 border-b border-dashed flex justify-between w-full">
                                    <p>Wilaya</p>
                                    <p>{commune?.wilaya?.name}</p>
                                </div>
                                <div className="py-3 border-b border-dashed flex justify-between w-full">
                                    <p>Commune</p>
                                    <p>{commune?.name}</p>
                                </div>
                                <div className="py-3 border-b border-dashed flex justify-between w-full">
                                    <p>Adresse</p>
                                    <p>{orderData.info?.address} - {orderData.info?.postal}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Articles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col">
                                {orderData.items.map(item => {
                                    const product = item.product;
                                    const variant = item.variant!;
                                    return (
                                        <div key={item.id} className="border-b border-dashed w-full py-3 flex items-stretch gap-2">
                                            <div className="flex gap-2 flex-1 w-full">
                                                <div className="aspect-square size-18 md:size-22 border flex justify-center items-center">
                                                    {variant!.images[0].url ?
                                                        <Image className="object-cover w-full h-full" src={`/api/uploads${variant!.images[0].url}`} width={128} height={128} alt={product!.title} />
                                                        :
                                                        <ImageOff />
                                                    }
                                                </div>

                                                <div className="w-full flex flex-col h-18 md:h-22 justify-between text-sm">
                                                    <p className="font-medium whitespace-nowrap">
                                                        <span className="text-muted-foreground">{variant.sku}</span> - {product?.title}
                                                    </p>
                                                    <div className="flex-1 h-full flex items-end">
                                                        {variant!.values.length !== 0 && variant.values[0].values &&
                                                            <div className="flex items-center gap-2">
                                                                {Object.keys(variant.values[0].values!).map((a, index) => {
                                                                    const attrID = Number(a)
                                                                    const currentAttribute = variantAttributes.find(attr => attr.id === attrID)
                                                                    const attributeTitle = currentAttribute?.title
                                                                    const attributeValue = currentAttribute?.values.find(v => v.id === variant.values[0].values![attrID])?.value

                                                                    return (
                                                                        <p key={a}>
                                                                            <span className="text-muted-foreground">{attributeTitle}:</span>
                                                                            <span className="font-medium"> {attributeValue}</span>
                                                                            {index !== Object.keys(variant.values[0].values!).length - 1 && " - "}
                                                                        </p>
                                                                    )
                                                                })}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>




                                            <div className="w-full flex flex-col items-end justify-between">
                                                <div>
                                                    {variant.on_promo
                                                        ?
                                                        <div className="text-right">
                                                            <p className="whitespace-nowrap line-through text-xs text-muted-foreground">{formatNumbers(Number(item.variant!.price) * item.qty!)} D.A</p>
                                                            <p className="whitespace-nowrap font-medium">{formatNumbers(Number(item.price) * item.qty!)} D.A</p>
                                                        </div>
                                                        : <p className="whitespace-nowrap font-medium">{formatNumbers(Number(item.price) * item.qty!)} D.A</p>}
                                                </div>
                                                <p className="textsm font-medium text-muted-foreground">Qté: {item.qty}</p>
                                            </div>
                                        </div>


                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full space-y-6">
                    {orderData.note &&
                        <Card>
                            <CardHeader>
                                <CardTitle>Note du client</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{orderData.note}</p>
                            </CardContent>
                        </Card>
                    }
                    <Card>
                        <CardHeader>
                            <CardTitle>Données de livraison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="w-full">
                                    <div className="w-full flex justify-between items-center py-3 border-b border-dashed">
                                        <p>Prestataire de livraison</p>
                                        <p>{orderData.zone?.shippingProvider?.title}</p>
                                    </div>
                                    <div className="w-full flex justify-between items-center py-3 border-b border-dashed">
                                        <p>Localisation</p>
                                        <p>
                                            <span>{orderData.zone?.wilaya?.name} - </span>
                                            <span>{orderData.zone?.commune?.name}</span>
                                        </p>
                                    </div>
                                    <div className="w-full flex justify-between items-center py-3 border-b border-dashed">
                                        <p>Adresse</p>
                                        <p>
                                            <span>{orderData.zone?.address} - </span>
                                            <span>{orderData.zone?.postal}</span>
                                        </p>
                                    </div>
                                    <div className="w-full flex justify-between items-center py-3 border-b border-dashed">
                                        <p>Frais</p>
                                        <p>{formatNumbers(orderData.zone?.price!, "US-us")} D.A</p>
                                    </div>
                                    <div className="w-full flex justify-between items-center py-3 border-b border-dashed">
                                        <p>Type</p>
                                        <p>{capitalizeFirstLetter(orderData.zone?.type!)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Résumé</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="w-full">
                                    <div className="w-full flex justify-between items-center py-3 border-b border-dashed">
                                        <p>Sous-total</p>
                                        <p>{formatNumbers(orderData.subtotal!, "US-us")} D.A</p>
                                    </div>
                                    {orderData.discount !== 0 &&
                                        <div className="w-full flex justify-between items-center py-3 border-b border-dashed">
                                            <p>Remise</p>
                                            <p>{formatNumbers(orderData.discount!, "US-us")} D.A</p>
                                        </div>
                                    }
                                    <div className="w-full flex justify-between items-center py-3 border-b border-dashed">
                                        <p>Frais de livraison</p>
                                        <p>{formatNumbers(orderData.shipping_cost!, "DZ-dz")} D.A</p>
                                    </div>
                                    <div className="w-full flex justify-between items-center py-4 font-medium border-b border-dashed">
                                        <p>Total</p>
                                        <p>{formatNumbers(orderData.total!, "US-us")} D.A</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Activité</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {orderData.history.map((hItem, index) => {
                                const formattedDate = hItem.createdAt!.toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                                return (
                                    <div key={hItem.id} className="w-full flex justify-between items-start">
                                        <div className="flex items-start gap-6 h-17">
                                            <div className="flex flex-col items-center relative">
                                                <div className="w-1.5 h-1.5 bg-gray-300 absolute top-2 z-50"></div>
                                                {orderData.history.length !== 1 && index !== orderData.history.length - 1 &&
                                                    <div className="w-px h-17 bg-gray-400/70 absolute top-2"></div>}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2 items-center">
                                                    <div style={{
                                                        backgroundColor: hItem.status!.color ? hItem.status!.color.replace(')', ' / 20%)') : "oklch(55.1% 0.027 264.364 / 10%)",
                                                        color: hItem.status!.color ? hItem.status!.color : "oklch(55.1% 0.027 264.364)"
                                                    }}
                                                        className="text-sm w-fit capitalize p-0.5 px-1.5 whitespace-nowrap flex items-center gap-2">
                                                        <DynamicIcon name={hItem.status!.icon ?? undefined} />
                                                        {hItem.status?.title}
                                                    </div>
                                                    {hItem.payment_status !== "en_attente" && <p>{capitalizeFirstLetter(hItem.payment_status!.replace('_', ' '))}</p>    }
                                                </div>

                                                {hItem.note && <p className="text-muted-foreground">{hItem.note}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <p>{formattedDate}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}