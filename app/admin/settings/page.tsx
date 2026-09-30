import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/src";
import { commune, orderStatus, wilaya } from "@/src/db/schema";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { insertWilayas } from "@/app/actions/wilayas";
import { insertCommunes } from "@/app/actions/communes";
import { asc, count } from "drizzle-orm";
import { Badge, CheckIcon, Pen, Trash2Icon } from "lucide-react";
import OrderStatusForm from "@/components/admin/settings/order-status-form";
import EditOrderStatusForm from "@/components/admin/settings/edit-order-status-form";
import DeleteOrderStatusButton from "@/components/admin/settings/delete-order-status-button";
import DynamicIcon from "@/components/admin/all/dynamic-icon";
import { Metadata } from "next";



export const metadata: Metadata = {
    title: "Paramètres"
}

export default async function SettingsAdminPage() {
    const wilayas = await db.select({ count: count() }).from(wilaya)
    const communes = await db.select({ count: count() }).from(commune)

    const orderStatuses = await db.select().from(orderStatus).orderBy(asc(orderStatus.order))

    if (!wilayas || !communes) {
        return <div>...</div>
    }

    return (
        <div className="w-full">
            <h3 className="text-2xl mb-6">Paramètres</h3>
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Statuts de commande</CardTitle>
                        <OrderStatusForm />
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Titre</TableHead>
                                    <TableHead>Icon</TableHead>
                                    <TableHead className="text-center w-30">Order</TableHead>
                                    <TableHead className="text-center w-30">Default</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderStatuses.map((o, index) => (
                                    <TableRow key={o.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <p className="text-center px-2 py-1"
                                                style={{ 
                                                    backgroundColor: o.color ? o.color.replace(')', ' / 20%)') : "oklch(55.1% 0.027 264.364 / 10%)",
                                                    color: o.color ? o.color : "oklch(55.1% 0.027 264.364)"
                                                 }}>
                                                {o.title}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-center"><DynamicIcon name={o.icon??undefined}/></TableCell>
                                        <TableCell className="text-center">{o.order}</TableCell>
                                        <TableCell className="text-center flex justify-center items-center pt-5">{o.default && <CheckIcon className="text-center" size={18} />}</TableCell>
                                        <TableCell className="space-x-4">
                                            <EditOrderStatusForm orderStatus={o} />
                                            <DeleteOrderStatusButton id={o.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>


                <Card>
                    <CardHeader>
                        <CardTitle>Données du magasin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-40">Table</TableHead>
                                    <TableHead className="w-40">Data</TableHead>
                                    <TableHead className="w-40">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Wilayas</TableCell>
                                    <TableCell>{wilayas[0].count} wilayas</TableCell>
                                    <TableCell>
                                        {wilayas[0].count === 0 && (
                                            <form action={insertWilayas}>
                                                <Button type="submit" size="sm">Insert</Button>
                                            </form>)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Communes</TableCell>
                                    <TableCell>{communes[0].count} communes</TableCell>
                                    <TableCell>
                                        {communes[0].count === 0 && (
                                            <form action={insertCommunes}>
                                                <Button type="submit" size="sm">Insert</Button>
                                            </form>)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}