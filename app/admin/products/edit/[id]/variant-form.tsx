"use client"

import { createVariant } from "@/app/actions/products"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { variantDataFormSchema } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, XIcon } from "lucide-react"
import { SubmitEvent, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

export default function CreateVariantForm({ id }: { id: number }) {


    const [open, setOpen] = useState(false);


    const form = useForm<z.infer<typeof variantDataFormSchema>>({
        resolver: zodResolver(variantDataFormSchema),
        defaultValues: {
            sku: "",
            stock: 0,
            track_stock: false,
            buy_price: 0,
            price: 0,
            promo_price: 0,
            on_promo: false,
            default: false,
            status: true,
            product_id: Number(id)
        },
    })
    async function onSubmit(data: z.infer<typeof variantDataFormSchema>) {


        const response = await createVariant(data)


        if (response.success) {

            toast.add({
                title: "Variante créée avec succès",
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

    return (
        <Dialog open={open}>
            <DialogTrigger onClick={() => setOpen(true)} render={<Button size="icon-lg"><PlusIcon /></Button>} />
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="w-full flex justify-between items-center">Nouveau variant
                        <Button onClick={() => setOpen(false)} type="button" variant="ghost" size="icon-sm"><XIcon /></Button>
                    </DialogTitle>
                </DialogHeader>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center gap-4">
                        <Controller
                            name="sku"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="flex-1 w-full" aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="sku">Réf.</FieldLabel>
                                    <Input {...field} id="sku" name="sku" type="text" className="flex-1 w-full" required aria-invalid={fieldState.invalid} />
                                </Field>
                            )}
                        />
                        <Controller
                            name="stock"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="flex-1 w-full" data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="stock">Stock</FieldLabel>
                                    <Input {...form.register("stock", {
                                        valueAsNumber: true,
                                    })} value={field.value}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)} id="stock" name="stock" type="number" className="flex-1 w-full" required aria-invalid={fieldState.invalid} />
                                </Field>
                            )}
                        />
                        <Controller
                            name="track_stock"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="w-fit" aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="track_stock">Track</FieldLabel>
                                    <Checkbox checked={field.value}
                                        onCheckedChange={field.onChange} id="track_stock" name="track_stock" aria-invalid={fieldState.invalid} />
                                </Field>
                            )}
                        />

                    </div>
                    <div className="flex items-center gap-4">
                        <Controller
                            name="price"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="flex-1 w-full" aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="price">Prix</FieldLabel>
                                    <Input {...form.register("price", {
                                        valueAsNumber: true,
                                    })} value={field.value}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)} id="price" name="price" type="number" className="flex-1 w-full" required aria-invalid={fieldState.invalid} />
                                </Field>
                            )}
                        />
                        <Controller
                            name="buy_price"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="flex-1 w-full" aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="buy_price">Prix d'achat</FieldLabel>
                                    <Input {...form.register("buy_price", {
                                        valueAsNumber: true,
                                    })} value={field.value}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        id="buy_price" name="buy_price" type="number" className="flex-1 w-full" required aria-invalid={fieldState.invalid} />
                                </Field>
                            )}
                        />
                        <Controller
                            name="promo_price"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="flex-1 w-full" aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="promo_price">Prix promo</FieldLabel>
                                    <Input {...form.register("promo_price", {
                                        valueAsNumber: true,
                                    })} value={field.value}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)} id="promo_price" name="promo_price" type="number" className="flex-1 w-full" aria-invalid={fieldState.invalid} />
                                </Field>
                            )}
                        />

                    </div>
                    <div className="flex items-end gap-4">
                        <Controller
                            name="on_promo"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="w-fit" aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="on_promo">On promo</FieldLabel>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="on_promo" name="on_promo" aria-invalid={fieldState.invalid} />
                                </Field>
                            )}
                        />
                        <Controller
                            name="default"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="w-fit" aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="default">Default</FieldLabel>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="default" name="default" aria-invalid={fieldState.invalid} />
                                </Field>
                            )}
                        />

                        <Controller
                            name="status"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="w-fit" aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="status">Status</FieldLabel>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="status" name="status" aria-invalid={fieldState.invalid} />
                                </Field>
                            )}
                        />
                        <Button type="submit" className="flex-1">Confirmer</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}