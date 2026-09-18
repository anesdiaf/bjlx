"use client"

import { createVariant, editVariant, getVariant } from "@/app/actions/products"
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
import { producVariantType } from "@/src/db/schema"
import { PenIcon, XIcon } from "lucide-react"
import { SubmitEvent, useEffect, useState } from "react"

export default function EditVariantForm({ id }: { id: number }) {

    const [variant, setVariant] = useState<producVariantType | null>(null)

    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement)

        const response = await editVariant(formData, variant?.product_id!, id)


        if (response.success) {

            toast.add({
                title: "Variante modifiée avec succès",
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
        getVariant(id)
            .then(data => {
                if (data) {
                    setVariant(data)
                }
            })
    }, [])

    return (
        <Dialog open={open}>
            <DialogTrigger onClick={() => setOpen(true)} render={<Button size="icon-sm"><PenIcon /></Button>} />
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="w-full flex justify-between items-center">
                        Modifier la variante
                        <Button onClick={() => setOpen(false)} type="button" variant="ghost" size="icon-sm"><XIcon /></Button>
                    </DialogTitle>
                </DialogHeader>
                <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
                    <div className="flex items-center gap-4">
                        <Field className="flex-1 w-full">
                            <FieldLabel htmlFor="sku">Réf.</FieldLabel>
                            <Input id="sku" name="sku" type="text" className="flex-1 w-full" required defaultValue={variant?.sku ?? undefined} />
                        </Field>
                        <Field className="flex-1 w-full">
                            <FieldLabel htmlFor="stock">Stock</FieldLabel>
                            <Input id="stock" name="stock" type="number" className="flex-1 w-full" required defaultValue={variant?.stock ?? undefined} />
                        </Field>
                        <Field className="w-fit">
                            <FieldLabel htmlFor="track_stock">Track</FieldLabel>
                            <Checkbox id="track_stock" name="track_stock" defaultChecked={variant?.track_stock ?? false} />
                        </Field>
                    </div>
                    <div className="flex items-center gap-4">
                        <Field className="flex-1 w-full">
                            <FieldLabel htmlFor="price">Prix</FieldLabel>
                            <Input id="price" name="price" type="number" className="flex-1 w-full" required defaultValue={variant?.price} />
                        </Field>
                        <Field className="flex-1 w-full">
                            <FieldLabel htmlFor="buy_price">Prix d'achat</FieldLabel>
                            <Input id="buy_price" name="buy_price" type="number" className="flex-1 w-full" required defaultValue={variant?.buy_price} />
                        </Field>
                        <Field className="flex-1 w-full">
                            <FieldLabel htmlFor="promo_price">Prix promo</FieldLabel>
                            <Input id="promo_price" name="promo_price" type="number" className="flex-1 w-full" defaultValue={variant?.promo_price ?? undefined} />
                        </Field>
                    </div>
                    <div className="flex items-end gap-4">
                        <Field className="w-fit">
                            <FieldLabel htmlFor="on_promo">On promo</FieldLabel>
                            <Checkbox id="on_promo" name="on_promo" defaultChecked={variant?.on_promo ?? false} />
                        </Field>
                        <Field className="w-fit">
                            <FieldLabel htmlFor="default">Default</FieldLabel>
                            <Checkbox id="default" name="default" defaultChecked={variant?.default ?? false} />
                        </Field>
                        <Field className="w-fit">
                            <FieldLabel htmlFor="status">Status</FieldLabel>
                            <Checkbox id="status" name="status" defaultChecked={variant?.status ?? false} />
                        </Field>
                        <Button type="submit" className="flex-1">Confirmer</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}