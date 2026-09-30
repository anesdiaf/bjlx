"use client"

import { getOrderStatuses, updateOrderStatus } from "@/app/actions/orders";
import DynamicIcon from "@/components/admin/all/dynamic-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { orderStatusType } from "@/src/db/schema";
import { orderUpdateSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod"

export default function ChangeOrderStatus({ status_id, order_id }: { status_id: number, order_id: number }) {
    const [open, setOpen] = useState<boolean>(false)
    const [orderStatuses, setOrderStatuses] = useState<orderStatusType[]>([])

    const [note, setNote] = useState<string | undefined>()
    const [selectedStatus, setSelectedStatus] = useState<number | null>(null)
    // Should handle payment status here also


    async function onSubmit() {
        if (!selectedStatus || selectedStatus === status_id) {
            toast.add({
                title: "Il faut modifier le statut de la commande.",
                type: "warning"
            })
            return
        }

        const response = await updateOrderStatus(order_id, selectedStatus, note)


        if (response.success) {

            toast.add({
                title: "Commande mise à jour avec succès",
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
            getOrderStatuses()
                .then(res => {
                    if (res.success) {
                        setOrderStatuses(res.data)
                        setSelectedStatus(status_id)
                    }
                })
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)} render={<Button>Mettre à jour</Button>} />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier le statut de la commande</DialogTitle>
                </DialogHeader>


                <Field className="flex-1 w-full">
                    <FieldLabel htmlFor="note">Note</FieldLabel>
                    <Textarea value={note} onChange={e => setNote(e.target.value)} className="flex-1 w-full" required />
                </Field>
                <Field className="w-full flex-1">
                    <FieldLabel>Status</FieldLabel>
                    <Select value={selectedStatus} onValueChange={v => setSelectedStatus(Number(v))}>
                        <SelectTrigger>
                            <SelectValue><DynamicIcon name={orderStatuses.find(os => os.id == selectedStatus)?.icon ?? undefined} />{orderStatuses.find(os => os.id == selectedStatus)?.title}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {orderStatuses.map((oStatus) => (
                                    <SelectItem key={oStatus.id} value={oStatus.id}>
                                        <DynamicIcon name={oStatus.icon ?? undefined} />{oStatus.title}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
                <Button onClick={() => onSubmit()}>Confirmer</Button>
            </DialogContent>
        </Dialog>
    )
}