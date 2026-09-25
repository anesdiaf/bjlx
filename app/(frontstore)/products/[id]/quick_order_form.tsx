"use client"


import { createQuickOrder } from "@/app/actions/orders";
import { getShippingZonesByWilaya, getWilayaCommunes, getWilayas } from "@/app/actions/shipping";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { cn, formatNumbers } from "@/lib/utils";
import { communeType, shippingZoneType, wilayaType } from "@/src/db/schema";
import { PorductWithDetailsType, quickOrderFormScema, userWithDataType, VariantWithValuesImagesType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2Icon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

export default function QuickOrderForm({ userInfo, currentProduct, currentVariant }: { userInfo?: userWithDataType, currentProduct: PorductWithDetailsType, currentVariant: VariantWithValuesImagesType }) {
    const [open, setOpen] = useState(false);

    const [wilayas, setWilayas] = useState<wilayaType[]>([]);
    const [communes, setCommunes] = useState<communeType[]>([]);
    const [zones, setZones] = useState<shippingZoneType[]>([]);
    const [loadingZones, setLoadingZones] = useState<boolean>(false)

    const [step, setStep] = useState<number>(1);




    const form = useForm<z.infer<typeof quickOrderFormScema>>({
        resolver: zodResolver(quickOrderFormScema),
        defaultValues: {
            name: userInfo?.user?.name ?? "",
            phone: userInfo?.phone ?? "",
            wilaya_id: userInfo?.wilaya_id ?? undefined,
            commune_id: userInfo?.commune_id ?? undefined,
            address: userInfo?.address ?? "",
            postal: userInfo?.postal ?? "",
            note: "",
            zone_id: undefined,
            guest_order: userInfo ? false : true
        },
    })

    async function onSubmit(data: z.infer<typeof quickOrderFormScema>) {
        // Do something with the form values.

        console.log(data);

        const response = await createQuickOrder()


        if (response.success) {

            setStep(3)
            form.reset()
            toast.add({
                title: "Votre commande a bien été confirmée.",
                type: "success"
            })

           //setOpen(false)

        } else {
            toast.add({
                title: response.error,
                type: "error"
            })
        }
    }



    const wilaya = form.watch("wilaya_id")
    const commune = form.watch("commune_id")
    const zone_id = form.watch("zone_id")

    useEffect(() => {
        if (open) {
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
        }
    }, [open])



    useEffect(() => {
        if (open) {
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


    return (
        <Dialog open={open}>
            <DialogTrigger onClick={() => setOpen(true)} render={<Button className="w-full">Acheter maintenant</Button>} />
            <DialogContent showCloseButton={false} className="w-full sm:max-w-200">
                <DialogHeader>
                    <DialogTitle className={cn(step === 3 ? "w-full flex justify-end items-center" : "w-full flex justify-between items-center")}>
                        {step === 1 && "Vos informations"}
                        {step === 2 && "Livraison info et resumé"}
                        <Button onClick={() => setOpen(false)} type="button" variant="ghost" size="icon-sm" className="float-right"><XIcon /></Button>
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 group">
                    {step === 1 && <div className="space-y-4">
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
                        <FieldGroup className="grid grid-cols-2">
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
                        <FieldGroup className="grid grid-cols-2">
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
                    </div>}

                    {step === 2 && <><div>
                        {!loadingZones ?
                            <>
                                {zones.length !== 0 ?
                                    <Controller
                                        name="zone_id"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="zone_id">
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
                                    <p>Aucune expédition vers cette destination pour le moment.</p>}
                            </>

                            :
                            <div className="flex flex-col gap-4">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>

                        }
                    </div>
                        <div className={cn("w-full border border-dashed px-2 origin-top transition", zone_id ? "scale-y-100 h-fit" : "scale-y-0 h-0")}>
                            <div className="w-full flex justify-between border-b border-dashed py-3">
                                <p>Article: </p>
                                <p>{currentProduct.title}</p>
                            </div>
                            <div className="w-full flex justify-between border-b border-dashed py-3">
                                <p>{currentVariant.on_promo ? "Prix ​​unitaire" : "Prix"}</p>
                                <p>{formatNumbers(currentVariant.price, "DZ-dz")} D.A</p>
                            </div>
                            {currentVariant.on_promo && (
                                <>
                                    <div className="w-full flex justify-between border-b border-dashed py-3">
                                        <p>Remise: </p>
                                        <p>{formatNumbers((Number(currentVariant.price) - Number(currentVariant.promo_price)), "DZ-dz")} D.A</p>
                                    </div>
                                    <div className="w-full flex justify-between border-b border-dashed py-3">
                                        <p>Prix promo: </p>
                                        <p>{formatNumbers(currentVariant.promo_price!, "DZ-dz")} D.A</p>
                                    </div>
                                </>
                            )}
                            <div className="w-full flex justify-between border-b border-dashed py-3">
                                <p>Frais de livraison: </p>
                                <p>{formatNumbers(zones.find(z => z.id == zone_id)?.price, "DZ-dz")} D.A</p>
                            </div>
                            <div className="w-full flex justify-between py-3">
                                <p>Total: </p>
                                <p>{formatNumbers(Number(zones.find(z => z.id == zone_id)?.price) + (currentVariant.on_promo ? Number(currentVariant.promo_price) : Number(currentVariant.price)), "us")} D.A</p>
                            </div>
                        </div></>}


                    {step === 3 &&
                        <div className="w-full flex flex-col items-center gap-6">
                            <CheckCircle2Icon size={128} className="text-green-500" />
                            <h1 className="text-lg font-bold text-center">Merci pour votre commande !</h1>
                            <div className="w-full flex flex-col items-center">
                                <p>Votre commande a bien été confirmée.</p>
                                <span className="text-muted-foreground">Nous vous contacterons prochainement pour la confirmer et préparer son expédition.</span>
                            </div>
                            <Link className="text-primary font-medium w-full" href="/track-order"><Button variant="secondary" className="w-full">Suivre la commande</Button></Link>
                            <Button onClick={() => { setOpen(false); setStep(1)}} className="w-full">Fermer</Button>
                        </div>
                    }


                    {step === 1 && <Button className="w-full" variant="default" onClick={() => setStep(2)} disabled={commune ? false : true}>Suivant</Button>}
                    {step === 2 && <div className="flex items-center gap-3">
                        <Button onClick={() => setStep(1)}><ArrowLeft /></Button>
                        <Button className="flex-1" variant="default" type="submit" disabled={zone_id ? false : true}>
                            Commander
                            {zone_id && !Number.isNaN(zone_id) && !Number.isNaN(zones.find(z => z.id === zone_id)?.price) &&
                                <span>
                                    ( {formatNumbers(Number(zones.find(z => z.id == zone_id)?.price) + (currentVariant.on_promo ? Number(currentVariant.promo_price) : Number(currentVariant.price)), "us")} D.A )
                                </span>
                            }
                        </Button>
                    </div>}

                </form>
            </DialogContent>
        </Dialog>
    )
}