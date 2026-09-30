"use client"

import { createOrderStatus, editOrderStatus } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { orderStatusType } from "@/src/db/schema";
import { Pen, Plus, XIcon } from "lucide-react";
import { SubmitEvent, useState } from "react";

export default function EditOrderStatusForm({ orderStatus }: { orderStatus: orderStatusType }) {

    const [open, setOpen] = useState(false)

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {

        e.preventDefault()

        const formData = new FormData(e.target)

        const title = formData.get("title") as string
        const order = Number(formData.get("order"))
        const icon = formData.get("icon") ? formData.get("icon") as string : undefined
        const color = formData.get("color") ? formData.get("color") as string : undefined
        const isDefault = formData.get("default") === "on" ? true : false

        const response = await editOrderStatus(orderStatus.id, { title, order, icon, color, default: isDefault })


        if (response.success) {


            toast.add({
                title: "Statut de la commande modifié avec succès",
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
            <DialogTrigger onClick={() => setOpen(true)} render={<Button size="icon-sm"><Pen /></Button>} />
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="w-full flex justify-between items-center">
                        Modifier le statut de la commande
                        <Button onClick={() => setOpen(false)} type="button" variant="ghost" size="icon-sm"><XIcon /></Button>
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={e => handleSubmit(e)} className="space-y-6">

                    <div className="flex items-center gap-4">
                        <Field>
                            <FieldLabel htmlFor="title">
                                Titre
                            </FieldLabel>
                            <Input type="text" id="title" name="title" required className="w-full" defaultValue={orderStatus.title ?? ""} />
                        </Field>
                        <Field className="w-24">
                            <FieldLabel htmlFor="order">
                                Order
                            </FieldLabel>
                            <Input type="number" id="order" name="order" required className="w-full" defaultValue={orderStatus.order ?? ""} />
                        </Field>
                    </div>
                    <div className="flex items-end gap-4">
                        <div className="flex items-center gap-4">
                            <Field>
                                <FieldLabel htmlFor="icon">
                                    Icon
                                </FieldLabel>
                                <Input type="text" id="icon" name="icon" className="w-full" defaultValue={orderStatus.icon ?? ""} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="color">
                                    Color
                                </FieldLabel>
                                <Input type="text" id="color" name="color" className="w-full" defaultValue={orderStatus.color ?? ""} />
                            </Field>
                        </div>
                        <div className="flex items-end gap-4">
                            <Field>
                                <FieldLabel htmlFor="default">
                                    Default
                                </FieldLabel>
                                <Switch id="default" name="default" defaultChecked={orderStatus.default ?? false} />
                            </Field>
                            <Button type="submit">Sauvegarder</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}