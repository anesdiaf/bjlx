"use client"

import { getOrderStatuses, updateOrderStatus } from "@/app/actions/orders";
import DynamicIcon from "@/components/admin/all/dynamic-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { capitalizeFirstLetter } from "@/lib/utils";
import { OrderPaymentStatusType, orderStatusType } from "@/src/db/schema";
import { useEffect, useState } from "react";

export default function ChangeOrderStatus({ status_id, order_id, payment_status }: { status_id: number, order_id: number, payment_status: OrderPaymentStatusType }) {
    const [open, setOpen] = useState<boolean>(false)
    const [orderStatuses, setOrderStatuses] = useState<orderStatusType[]>([])
    const [paymentStatuses, setPaymentStatuses] = useState<OrderPaymentStatusType[]>([
        "en_attente",
        "collecté",
        "recu",
        "retourne",
        "rembourse",
        "annule",
    ])


    const [note, setNote] = useState<string | undefined>()
    const [selectedStatus, setSelectedStatus] = useState<number | null>(null)
    const [selectedPaymentStatus, setPaymentStatus] = useState<OrderPaymentStatusType>(payment_status);

    async function onSubmit() {
        if (!selectedStatus || (selectedStatus === status_id && selectedPaymentStatus === payment_status)) {
            toast.add({
                title: "Il faut modifier le statut de la commande.",
                type: "warning"
            })
            return
        }

        const response = await updateOrderStatus(order_id, selectedStatus, selectedPaymentStatus, note)


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
                <Field className="w-full flex-1">
                    <FieldLabel>Payment Status</FieldLabel>
                    <Select value={selectedPaymentStatus} onValueChange={v => setPaymentStatus(v!)}>
                        <SelectTrigger>
                            <SelectValue>{capitalizeFirstLetter(selectedPaymentStatus.replace('_', ' '))}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {paymentStatuses.map((ps, index) => (
                                    <SelectItem key={index} value={ps}>
                                        {capitalizeFirstLetter(ps.replace('_', ' '))}
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