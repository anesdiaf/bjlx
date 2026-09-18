import DeleteProductButton from "@/components/admin/products/delete-product-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/src";
import { product } from "@/src/db/schema";
import { Pen, PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function ProductsAdminPage() {

    const products = await db.select().from(product)

    return (
        <div className="w-full">
            <div className="flex justify-between">
                <h3 className="text-2xl mb-6">Produits</h3>
                <Link href="/admin/products/new">
                    <Button className="hidden md:block">Nouveau produit</Button>
                    <Button className="md:hidden"><PlusIcon /></Button>
                </Link>
            </div>
             <Card className="w-full">
                <CardHeader>
                    <Input type="text" />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>{products.length === 0 && "Aucun produit n'a encore été ajouté."}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">#</TableHead>
                                <TableHead className="min-w-30">Titre</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        {products.length == 0 && (<TableBody></TableBody>)}
                        {products.length !== 0 && (
                            <TableBody>
                                {products.map((p, index) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{index+1}</TableCell>
                                        <TableCell><Link href={`/admin/products/edit/${p.id}`}>{p.title}</Link></TableCell>
                                        <TableCell>{p.status ? <Badge className="bg-green-400/20 text-green-700">Active</Badge> : <Badge variant="destructive">Inactive</Badge> }</TableCell>
                                        <TableCell className="text-right space-x-3.5 flex justify-center items-center">
                                            <Link href={`/admin/products/edit/${p.id}`}><Button><Pen/></Button></Link>
                                            <DeleteProductButton id={p.id}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}