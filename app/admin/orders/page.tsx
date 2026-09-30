import { Button } from "@/components/ui/button";
import { db } from "@/src";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Commandes"
}

export default async function OrderAdminPage() {

    const orders = await db.query.order.findMany({
        with: {
            info: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return (
        <div className="w-full">
            <div className="flex justify-between">
                <h3 className="text-2xl mb-6">Commandes</h3>
                <Link href="/admin/products/new">
                    <Button className="hidden md:block">Nouvelle commande</Button>
                    <Button className="md:hidden"><PlusIcon /></Button>
                </Link>
            </div>
            <DataTable columns={columns} data={orders} />
        </div>
    )
}