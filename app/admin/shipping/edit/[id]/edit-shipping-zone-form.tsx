"use client"


import { createProvider, createShippingZone, getWilayaCommunes, getWilayas } from "@/app/actions/shipping";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { communeType, shippingZoneType, wilayaType } from "@/src/db/schema";
import { providerFromSchema, shippingProviderWithZonesType, shippingZoneFromSchema, WilayasWithCommunesType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pen, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod"





export default function EditShppingZoneForm({ zone }:
    { zone: shippingZoneType }) {

    const [open, setOpen] = useState<boolean>(false)

    const [wilayas, setWilayas] = useState<wilayaType[]>([]);
    const [communes, setCommunes] = useState<communeType[]>([]);


    const form = useForm<z.infer<typeof shippingZoneFromSchema>>({
        resolver: zodResolver(shippingZoneFromSchema),
        defaultValues: {
            type: zone.type ?? "",
            price: zone.price ?? 0,
            wilaya_id: zone.wilaya_id ?? undefined,
            commune_id: zone.commune_id ?? undefined,
            address: zone.address ?? "",
            postal: zone.postal ?? "",
            status: zone.status ?? true,
            provider_id: zone.provider_id!
        },
    })


    async function onSubmit(data: z.infer<typeof shippingZoneFromSchema>) {
        // Do something with the form values.

        const response = await createShippingZone(data)


        if (response.success) {

            toast.add({
                title: "Zone d'expédition créée avec succès",
                type: "success"
            })

            setOpen(false)

        } else {
            toast.add({
                title: response.error,
                type: "error"
            })
        }
    }


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
            if (zone.wilaya_id) {
                getWilayaCommunes(zone.wilaya_id)
                    .then(res => {
                        if (res.success) {
                            setCommunes(res.data)
                        }
                    })
            }
        }

    }, [open])

    const wilaya = form.watch("wilaya_id")

    useEffect(() => {
        if (open) {
            getWilayaCommunes(wilaya)
                .then(res => {
                    if (res.success) {
                        setCommunes(res.data)
                    }
                })
        }
    }, [wilaya])



    return (
        <Dialog open={open}>
            <DialogTrigger onClick={() => setOpen(true)} render={<Button size="icon-sm"><Pen /></Button>} />
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="w-full flex justify-between items-center">Modifier une zone d'expédition
                        <Button onClick={() => setOpen(false)} type="button" variant="ghost" size="icon-sm"><XIcon /></Button>
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FieldGroup className="grid grid-cols-2">
                        <Controller
                            name="price"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="title">
                                        Prix
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="title"
                                        type="number"
                                        {...form.register("price", {
                                            valueAsNumber: true,
                                        })}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="type"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="type">
                                        Type
                                    </FieldLabel>
                                    <Select id="type" name={field.name}
                                        value={field.value ?? ""}
                                        required
                                        onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Type">{field.value.toLocaleUpperCase()}</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent >
                                            {["house", "office"].map((item, index) => (
                                                <SelectItem key={index} value={item}>
                                                    {item.toLocaleUpperCase()}
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
                            name="wilaya_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="wilaya_id">
                                        Wilaya
                                    </FieldLabel>
                                    <Select id="wilaya" name={field.name}
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
                                    <Select id="commune_id" name={field.name}
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
                    <div className="flex items-end justify-end">
                        <Controller
                            name="status"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="status">
                                        Status
                                    </FieldLabel>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} id="status" />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Button type="submit">Confirmer</Button>
                    </div>


                </form>
            </DialogContent>
        </Dialog>
    )
}