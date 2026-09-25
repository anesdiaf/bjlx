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
import { TrashIcon } from "lucide-react";
import { deleteShippingZone } from "@/app/actions/shipping";

export default function DeleteShippingZoneButton({ id, provider_id }: { id: number, provider_id: number }) {

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const response = await deleteShippingZone(id, provider_id);

        if (response.success) {
            toast.add({
                title: "Zone d'expédition supprimée avec succès",
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
            <DialogTrigger render={<Button type="submit" size="icon-sm"><TrashIcon /></Button>} />
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