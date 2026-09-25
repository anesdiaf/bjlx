import { Button } from "@/components/ui/button";
import { db } from "@/src";
import { shippingProvider } from "@/src/db/schema";
import { Pen } from "lucide-react";
import Link from "next/link";
import ProviderForm from "@/app/admin/shipping/provider-form";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DeleteProviderButton from "@/app/admin/shipping/delete-provider-button";

export default async function ShippingAdminPage() {



    const providers = await db.select().from(shippingProvider)

    return (
        <div className="w-full">
            <div className="flex justify-between">
                <h3 className="text-2xl mb-6">Livraison</h3>
                <ProviderForm />
            </div>
            <Table>
                <TableCaption>{providers.length === 0 && "Aucun prestataire d'expédition n'a encore été ajouté."}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead className="min-w-30">Titre</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {providers.length == 0 && (<TableBody></TableBody>)}
                {providers.length !== 0 && (
                    <TableBody>
                        {providers.map((p, index) => (
                            <TableRow key={p.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell><Link href={`/admin/shipping/edit/${p.id}`}>{p.title}</Link></TableCell>
                                <TableCell>{p.status ? <Badge className="bg-green-400/20 text-green-700">Active</Badge> : <Badge variant="destructive">Inactive</Badge>}</TableCell>
                                <TableCell className="text-right space-x-3.5 flex justify-center items-center">
                                    <Link href={`/admin/shipping/edit/${p.id}`}><Button><Pen /></Button></Link>
                                    <DeleteProviderButton id={p.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>
        </div>
    )
}