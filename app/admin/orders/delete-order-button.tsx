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
import { Trash } from "lucide-react";
import { deleteOrder } from "@/app/actions/orders";
import { useRouter } from "next/navigation";

export default function DeleteOrderButton({ id }: { id: number }) {


    const router = useRouter()

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const response = await deleteOrder(id);

        if (response.success) {
            toast.add({
                title: "Commande supprimée avec succès",
                type: "success"
            })

            router.push('/admin/orders')
        } else {
            toast.add({
                title: response.error,
                type: "error"
            })
        }

    }

    return (
        <Dialog>
            <DialogTrigger render={<Button type="submit" size="icon" variant="destructive"><Trash/></Button>} />  
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