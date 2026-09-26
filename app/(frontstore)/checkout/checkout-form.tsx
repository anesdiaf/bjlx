"use client"

import { getAttributes } from "@/app/actions/attributes"
import { createQuickOrder } from "@/app/actions/orders"
import { getShippingZonesByWilaya, getWilayaCommunes, getWilayas } from "@/app/actions/shipping"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Item, ItemContent, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { cn, formatNumbers } from "@/lib/utils"
import { useCartStore } from "@/src/context/cart-store-provider"
import { communeType, shippingZoneType, wilayaType } from "@/src/db/schema"
import { AttributeWithValuesType, OrderFormScema, userWithDataType } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, CheckCircle2Icon, CheckIcon, ImageOff, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"



export default function CheckoutForm({ userInfo }: { userInfo?: userWithDataType }) {
    const { items, itemsLoaded, close, changeQty, remove, reset } = useCartStore((state) => state)

    const [step, setStep] = useState<number>(1);

    const [subtotal, setSubtotal] = useState<number>(0)
    const [discount, setDiscount] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)


    const [wilayas, setWilayas] = useState<wilayaType[]>([]);
    const [communes, setCommunes] = useState<communeType[]>([]);
    const [zones, setZones] = useState<shippingZoneType[]>([]);
    const [loadingZones, setLoadingZones] = useState<boolean>(false)
    const [variantAttributes, setVariantAttributes] = useState<AttributeWithValuesType[]>([])




    const form = useForm<z.infer<typeof OrderFormScema>>({
        resolver: zodResolver(OrderFormScema),
        defaultValues: {
            name: userInfo?.user?.name ?? "",
            phone: userInfo?.phone ?? "",
            wilaya_id: userInfo?.wilaya_id ?? undefined,
            commune_id: userInfo?.commune_id ?? undefined,
            address: userInfo?.address ?? "",
            postal: userInfo?.postal ?? "",
            note: "",
            zone_id: undefined,
            user_id: userInfo?.user_id ?? undefined,
            guest_order: userInfo ? false : true
        },
    })

    const wilaya = form.watch("wilaya_id")
    const zone_id = form.watch("zone_id")


    async function onSubmit(data: z.infer<typeof OrderFormScema>) {
        // Do something with the form values.

        console.log(data);

        const response = await createQuickOrder(data)


        if (response.success) {

            setStep(3)
            form.reset()
            reset()

            toast.add({
                title: "Votre commande a bien été confirmée.",
                type: "success"
            })


        } else {
            toast.add({
                title: response.error,
                type: "error"
            })
        }
    }

    const confirmInfo = () => {
        const data = form.getValues()
        if (data.name === "" || data.phone === "") {
            toast.add({
                title: "Saisissez un nom et un numéro de téléphone valides",
                type: "warning"
            })
            return
        }
        if (!data.wilaya_id || !data.commune_id) {
            toast.add({
                title: "Définir une wilaya et une commune pour continuer",
                type: "warning"
            })
            return
        }

        setStep(2)
    }


    useEffect(() => {
        if (wilayas.length === 0) {
            getWilayas()
                .then(res => {
                    if (res.success) {
                        setWilayas(res.data)
                    }
                })
        }
        if (userInfo?.wilaya_id && communes.length === 0) {
            getWilayaCommunes(userInfo.wilaya_id)
                .then(res => {
                    if (res.success) {
                        setCommunes(res.data)
                    }
                })
        }
        if (wilaya) {
            getShippingZonesByWilaya(wilaya)
                .then(res => {
                    if (res.success) {
                        setZones(res.data)
                        res.data.length !== 0 ? form.setValue("zone_id", res.data[0].id) : form.setValue("zone_id", undefined)
                        //console.log(res.data[0].id);
                        setLoadingZones(false)
                    }
                })
        }

        if (variantAttributes.length === 0) {
            getAttributes()
                .then(res => {
                    if (res.success) {
                        setVariantAttributes(res.data!)
                    }
                })
        }

    }, [])

    useEffect(() => {
        let currSubtotal = 0;
        let currDiscount = 0;
        let currTotal = 0;

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

        });

        setSubtotal(currSubtotal)
        setDiscount(currDiscount)
        setTotal(currTotal)


        if (variantAttributes.length === 0) {
            getAttributes()
                .then(res => {
                    if (res.success) {
                        setVariantAttributes(res.data!)
                    }
                })
        }

    }, [items])

    useEffect(() => {
        if (wilaya) {
            getWilayaCommunes(wilaya)
                .then(res => {
                    if (res.success) {
                        setCommunes(res.data)
                        form.setValue("commune_id", res.data[0].id)
                    }
                })
            setLoadingZones(true)
            getShippingZonesByWilaya(wilaya)
                .then(res => {
                    if (res.success) {
                        setZones(res.data)
                        res.data.length !== 0 ? form.setValue("zone_id", res.data[0].id) : form.setValue("zone_id", undefined)
                        //console.log(res.data[0].id);
                        setLoadingZones(false)
                    }
                })
        }
    }, [wilaya])


    if (itemsLoaded && items.length === 0) {
        return (
            <div className="gap-6 flex flex-col items-center w-full flex-1">
                <div className="flex flex-col items-center my-12 space-y-6">
                    <ShoppingCart size={128} className="text-primary" />
                    <div className="text-center">
                        <h1 className="font-medium text-muted-foreground mb-3">Votre panier est encore vide</h1>
                        <p className="text-muted-foreground text-justify md:w-2/3 mx-auto text-xs">Découvrez nos bijoux et laissez-vous séduire par votre prochain coup de cœur. ✨</p>
                    </div>
                    <Link href="/"><Button>Découvrir nos bijoux</Button></Link>
                </div>
            </div>
        )
    }

    return (
        <div className="gap-6 flex flex-col md:flex-row md:items-start h-full flex-1">
            {itemsLoaded &&
                <div className="w-full space-y-4">
                    <div className="w-full md:w-fit flex items-center justify-between p-2 text-xs font-medium border mx-auto gap-2">
                        <p className="flex items-center gap-1">
                            <span className={cn("aspect-square size-4 flex items-center justify-center", step === 1 ? "bg-primary text-white" : "bg-green-500 text-white")}>
                                {step === 1 ? "1" : <CheckIcon size={13} />}
                            </span>
                            Information
                        </p>
                        <div className={cn("min-w-6 h-0.5 flex-1", step === 2 || 3 ? "bg-primary" : "bg-primary/20")}></div>
                        <p className="flex items-center gap-1">
                            <span className={cn("aspect-square size-4 flex items-center justify-center", step === 1 && "bg-muted", step === 2 && "bg-primary text-white", step === 3 && "bg-green-500 text-white")}>
                                {step === 3 ? <CheckIcon size={13} /> : "2"}
                            </span>
                            Livraison
                        </p>
                        <div className={cn("min-w-6 h-0.5 flex-1", step === 3 ? "bg-primary" : "bg-primary/20")}></div>
                        <p className="flex items-center gap-1">
                            <span className={cn("aspect-square size-4 text-center", step === 3 ? "bg-primary text-white" : "bg-muted")}>3</span>
                            Terminée
                        </p>
                    </div>


                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 group">

                        {step === 1 &&
                            <div className="space-y-4">
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="name">
                                                Nom complet
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="name"
                                                aria-invalid={fieldState.invalid}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="phone"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="phone">
                                                Téléphone
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="phone"
                                                aria-invalid={fieldState.invalid}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <FieldGroup className="grid grid-cols-2 gap-2">
                                    <Controller
                                        name="wilaya_id"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="wilaya_id">
                                                    Wilaya
                                                </FieldLabel>
                                                <Select id="wilaya" name={field.name} required
                                                    value={field.value ?? ""}
                                                    onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                                        <SelectValue placeholder="Wilaya">{wilayas.find(w => w.id === field.value)?.name}</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent >
                                                        {wilayas.map((item) => (
                                                            <SelectItem key={item.code} value={item.id}>
                                                                {item.code} - {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="commune_id"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="commune_id">
                                                    Commune
                                                </FieldLabel>
                                                <Select id="commune_id" name={field.name} required
                                                    value={field.value ?? ""}
                                                    onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                                        <SelectValue placeholder="Commune">{communes.find(c => c.id === field.value)?.name}</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent >
                                                        {communes.map((item) => (
                                                            <SelectItem key={item.post_code} value={item.id}>
                                                                {item.post_code} - {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                                <FieldGroup className="grid grid-cols-2 gap-2">
                                    <Controller
                                        name="address"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="address">
                                                    Adresse
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="address"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="postal"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="postal">
                                                    Code postal
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="postal"
                                                    maxLength={10}
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                                <Controller
                                    name="note"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="note">Note</FieldLabel>
                                            <Textarea {...field} aria-invalid={fieldState.invalid} />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Button onClick={() => confirmInfo()} className="w-full">Suivant</Button>
                            </div>
                        }
                        {step === 2 &&
                            <div className="gap-6 flex flex-col md:flex-row md:items-start h-full flex-1">
                                {!loadingZones &&
                                    <div className="flex-1 space-y-4">
                                        <h2 className="text-xs font-semibold tracking-wide uppercase pb-2 md:pb-4 border-b border-dashed">Articles</h2>
                                        <div className="flex flex-col items-center gap-4 w-full py-4">
                                            {items.map(item => {
                                                return (
                                                    <div key={item.id} className="flex flex-col w-full text-sm">
                                                        <p className="font-medium">{item.title}</p>
                                                        <div key={item.id} className="border-b border-dashed w-full py-3 flex items-stretch gap-2">
                                                            <div className="aspect-square size-22 md:size-34 border flex justify-center items-center">
                                                                {item.images[0].url ?
                                                                    <Image className="object-cover w-full h-full" src={`/api/uploads${item.images[0].url}`} width={128} height={128} alt={item.title} />
                                                                    :
                                                                    <ImageOff />
                                                                }
                                                            </div>

                                                            <div className="w-full flex flex-col h-22 md:h-34 justify-between text-sm">
                                                                <div className="flex-1 h-full flex flex-col items-start gap-2">
                                                                    <p className="text-muted-foreground">{item.sku}</p>
                                                                    {item.values.length !== 0 && item.values[0].values &&
                                                                        <div className="flex items-center gap-2">
                                                                            {Object.keys(item.values[0].values!).map((a, index) => {
                                                                                const attrID = Number(a)
                                                                                const currentAttribute = variantAttributes.find(attr => attr.id === attrID)
                                                                                const attributeTitle = currentAttribute?.title
                                                                                const attributeValue = currentAttribute?.values.find(v => v.id === item.values[0].values![attrID])?.value

                                                                                return (
                                                                                    <p key={a}>
                                                                                        <span className="text-muted-foreground">{attributeTitle}:</span>
                                                                                        <span className="font-medium">{attributeValue}</span>
                                                                                        {index !== Object.keys(item.values[0].values!).length - 1 && " - "}
                                                                                    </p>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    }
                                                                </div>
                                                                <div className="w-full flex justify-between items-end">
                                                                    <div className="flex items-center w-full gap-2">
                                                                        {item.on_promo
                                                                            ? <p className="whitespace-nowrap">{formatNumbers(Number(item.promo_price) * item.qty)} D.A</p>
                                                                            : <p className="whitespace-nowrap">{formatNumbers(Number(item.price) * item.qty)} D.A</p>
                                                                        }
                                                                        <p>x <span>{item.qty}</span></p>
                                                                    </div>
                                                                    <div>
                                                                        {item.on_promo
                                                                            ?
                                                                            <div className="text-right">
                                                                                <p className="whitespace-nowrap line-through text-xs text-muted-foreground">{formatNumbers(Number(item.price) * item.qty)} D.A</p>
                                                                                <p className="whitespace-nowrap font-medium">{formatNumbers(Number(item.promo_price) * item.qty)} D.A</p>
                                                                            </div>
                                                                            : <p className="whitespace-nowrap font-medium">{formatNumbers(Number(item.price) * item.qty)} D.A</p>}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                }
                                <div className="w-full md:w-80 lg:w-100 sticky bottom-0 md:top-0 right-0 bg-white py-2 md:py-0 text-sm space-y-6">
                                    {zones.length !== 0 ?
                                        <Controller
                                            name="zone_id"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="zone_id" className="pb-2 md:pb-3 border-b border-dashed">
                                                        Destination de livraison
                                                    </FieldLabel>
                                                    <Select id="zone_id" name={field.name}
                                                        value={Number(field.value) ?? ""}
                                                        onValueChange={field.onChange}>
                                                        <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                                            <SelectValue placeholder="Choisissez une destination d'expédition">
                                                                <span>{wilayas.find(w => w.id === zones.find(z => z.id === zone_id)?.wilaya_id)?.name} - </span>
                                                                {wilayas.find(w => w.id === zones.find(z => z.id === zone_id)?.wilaya_id)?.name !== communes.find(c => c.id === zones.find(z => z.id === zone_id)?.commune_id)?.name &&
                                                                    <span>{communes.find(c => c.id === zones.find(z => z.id === zone_id)?.commune_id)?.name} - </span>}
                                                                <span>{zones.find(z => z.id === zone_id)?.type == "office" ? "Bureau" : "À domicile"} - </span>
                                                                <span>{formatNumbers(zones.find(z => z.id === zone_id)?.price, "DZ-dz")} D.A</span>
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent >
                                                            {zones.map((z) => {
                                                                const zoneWilaya = wilayas.find(w => w.id === z.wilaya_id)?.name
                                                                const zoneCommune = communes.find(c => c.id === z.commune_id)?.name
                                                                return (
                                                                    <SelectItem key={z.id} value={z.id}>
                                                                        {zoneWilaya} - {zoneWilaya !== zoneCommune && `${zoneCommune} -`} {z.type == "office" ? "Bureau" : "À domicile"} - {formatNumbers(z.price, "DZ-dz")} D.A
                                                                    </SelectItem>
                                                                )
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}

                                                </Field>
                                            )}
                                        />
                                        :
                                        <p>Aucune expédition vers cette destination pour le moment.</p>
                                    }
                                    <div>
                                        <h2 className="text-xs font-semibold tracking-wide uppercase pb-2 md:pb-4 border-b border-dashed">Résume</h2>
                                        <div className="space-y-4 pt-4">
                                            <div className="w-full border border-dashed px-2">
                                                <div className="w-full flex justify-between items-center py-2 border-b border-dashed">
                                                    <p>Sous-total</p>
                                                    <p>{formatNumbers(subtotal, "US-us")} D.A</p>
                                                </div>
                                                {discount !== 0 &&
                                                    <div className="w-full flex justify-between items-center py-1 border-b border-dashed">
                                                        <p>Remise</p>
                                                        <p>{formatNumbers(discount, "US-us")} D.A</p>
                                                    </div>
                                                }
                                                <div className="w-full flex justify-between items-center py-2 border-b border-dashed">
                                                    <p>Frais de livraison</p>
                                                    <p>{formatNumbers(zones.find(z => z.id == zone_id)?.price, "DZ-dz")} D.A</p>
                                                </div>
                                                <div className="w-full flex justify-between items-center py-2 border-b border-dashed">
                                                    <p>Total</p>
                                                    <p>{formatNumbers(total, "US-us")} D.A</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 w-full">
                                                <Button variant="secondary" onClick={() => setStep(1)}><ArrowLeft /></Button>
                                                <Button disabled={zone_id ? false : true} type="submit" className="flex-1">Confirmer la commande</Button>
                                            </div>
                                        </div>
                                    </div>

                                </div>


                                {loadingZones && <div className="flex flex-col gap-4">
                                    <Item variant="muted" className="w-full">
                                        <ItemMedia>
                                            <Spinner />
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle className="line-clamp-1">Récupération des zones de livraison...</ItemTitle>
                                        </ItemContent>
                                    </Item>
                                </div>}
                            </div>
                        }
                    </form>
                </div>
            }

            {step === 3 &&
                <div className="w-full flex flex-col items-center gap-6">
                    <CheckCircle2Icon size={128} className="text-green-500" />
                    <h1 className="text-lg font-bold text-center">Merci pour votre commande !</h1>
                    <div className="w-full flex flex-col items-center">
                        <p>Votre commande a bien été confirmée.</p>
                        <span className="text-muted-foreground">Nous vous contacterons prochainement pour la confirmer et préparer son expédition.</span>
                    </div>
                    <Link className="w-full" href="/track-order"><Button variant="secondary" className="w-full">Suivre la commande</Button></Link>
                    <Link className="w-full" href="/"><Button className="w-full">Poursuivre vos achats</Button></Link>
                </div>
            }


            {!itemsLoaded && step !== 3 &&
                <div className="w-full h-full flex justify-center items-center flex-1">
                    <Item variant="muted" className="w-fit">
                        <ItemMedia>
                            <Spinner />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle className="line-clamp-1">Récupération des données du panier...</ItemTitle>
                        </ItemContent>
                    </Item>
                </div>
            }
        </div>
    )
}