"use client"


import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, XIcon } from "lucide-react";
import { useState } from "react";

export default function QuickOrderForm() {
    const [open, setOpen] = useState(false);


    return (
        <Dialog open={open}>
            <DialogTrigger onClick={() => setOpen(true)} render={<Button className="w-full">Acheter maintenant</Button>} />
            <DialogContent showCloseButton={false} className="w-full sm:max-w-200">
                <DialogHeader>
                    <DialogTitle className="w-full flex justify-between items-center">
                        Passer une commande
                        <Button onClick={() => setOpen(false)} type="button" variant="ghost" size="icon-sm"><XIcon /></Button>
                    </DialogTitle>
                </DialogHeader>
                <form action="" className="space-y-4">
                    <Field className="flex-1 w-full">
                        <FieldLabel htmlFor="sku">Nom complet</FieldLabel>
                        <Input id="sku" name="sku" type="text" className="flex-1 w-full" required />
                    </Field>
                    <Field className="flex-1 w-full">
                        <FieldLabel htmlFor="sku">Téléphone</FieldLabel>
                        <Input id="sku" name="sku" type="text" className="flex-1 w-full" required />
                    </Field>
                    <div className="flex items-center gap-4">
                        <Field className="flex-1 w-full">
                            <FieldLabel htmlFor="sku">Wilaya</FieldLabel>
                            <Input id="sku" name="sku" type="text" className="flex-1 w-full" required />
                        </Field>
                        <Field className="flex-1 w-full">
                            <FieldLabel htmlFor="sku">Commune</FieldLabel>
                            <Input id="sku" name="sku" type="text" className="flex-1 w-full" required />
                        </Field>
                    </div>
                    <div className="flex items-center gap-4">
                        <Field className="flex-1 w-full">
                            <FieldLabel htmlFor="sku">Adresse</FieldLabel>
                            <Input id="sku" name="sku" type="text" className="flex-1 w-full" required />
                        </Field>
                        <Field className="w-24">
                            <FieldLabel htmlFor="sku">Code postal</FieldLabel>
                            <Input id="sku" name="sku" type="text" className="flex-1 w-full" required />
                        </Field>
                    </div>
                    <Field className="w-full">
                        <FieldLabel htmlFor="sku">Note</FieldLabel>
                        <Textarea id="sku" name="sku" className="flex-1 w-full" required />
                    </Field>
                    <Button className="w-full">commander</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}