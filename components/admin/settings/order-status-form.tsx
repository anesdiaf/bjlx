"use client"

import { createOrderStatus } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { Plus, XIcon } from "lucide-react";
import { SubmitEvent, useState } from "react";

export default function OrderStatusForm() {
    const [open, setOpen] = useState(false)

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {

        e.preventDefault()

        const formData = new FormData(e.target)

        const title = formData.get("title") as string
        const order = Number(formData.get("order"))
        const isDefault = formData.get("default") === "on" ? true : false

        const response = await createOrderStatus({title, order, default: isDefault})


        if (response.success) {


            toast.add({
                title: "Statut de la commande créé avec succès",
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
            <DialogTrigger onClick={() => setOpen(true)} render={<Button size="icon-sm"><Plus /></Button>} />
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="w-full flex justify-between items-center">
                        Créer un statut de commande
                        <Button onClick={() => setOpen(false)} type="button" variant="ghost" size="icon-sm"><XIcon /></Button>
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={e => handleSubmit(e)} className="space-y-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">
                                Titre
                            </FieldLabel>
                            <Input type="text" id="title" name="title" required/>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="order">
                                Order
                            </FieldLabel>
                            <Input type="number" id="order" name="order" required/>
                        </Field>
                    </FieldGroup>

                    <div className="flex justify-end items-end">
                    <Field>
                        <FieldLabel htmlFor="default">
                            Default
                        </FieldLabel>
                        <Switch id="default" name="default" />
                    </Field>
                    <Button type="submit">Sauvegarder</Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}