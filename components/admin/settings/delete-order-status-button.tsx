"use client"

import { Button } from "@/components/ui/button";
import { SubmitEvent } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast";
import { deleteOrderStatus } from "@/app/actions/orders";
import { Trash2Icon } from "lucide-react";

export default function DeleteOrderStatusButton({ id }: { id: number }) {

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const response = await deleteOrderStatus(id);

        if (response.success) {
            toast.add({
                title: "Statut de la commande supprimé avec succès",
                type: "success"
            })

        } else {
            toast.add({
                title: response.error,
                type: "error"
            })
        }

    }

    return (
        <Dialog>
            <DialogTrigger render={<Button size="icon-sm" variant="destructive"><Trash2Icon/></Button>} />
            
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>En êtes-vous absolument sûr ?</DialogTitle>
                    <DialogDescription>Cette action est irréversible. Elle supprimera définitivement votre compte et effacera vos données de nos serveurs.</DialogDescription>
                </DialogHeader>
                <form onSubmit={e => handleSubmit(e)} className="block">
                    <Button type="submit" className="float-right">Confirmer</Button>
                </form>
            </DialogContent>
        </Dialog>

    )
}