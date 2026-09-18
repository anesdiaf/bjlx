import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import { db } from "@/src";
import { category } from "@/src/db/schema";
import { Badge } from "@/components/ui/badge";
import { asc } from "drizzle-orm";
import DeleteCategoryButton from "@/components/admin/categories/delete-category-button";

export default async function CategoriesAdminPage() {

    const categories = await db.select().from(category).orderBy(asc(category.order))

    if(!categories){
        return <div>...</div>
    }

    return (
        <div className="w-full">
            <div className="flex justify-between">
                <h3 className="text-2xl mb-6">Catégories</h3>
                <Link href="/admin/categories/new">
                    <Button className="hidden md:block">Nouvelle catégorie</Button>
                    <Button className="md:hidden"><PlusIcon /></Button>
                </Link>
            </div>

            <Card className="w-full">
                <CardHeader>
                    <Input type="text" />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>{categories.length === 0 && "Aucune catégorie n'a encore été ajoutée."}.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">#</TableHead>
                                <TableHead className="min-w-30">Titre</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        {categories.length == 0 && (<TableBody></TableBody>)}
                        {categories.length !== 0 && (
                            <TableBody>
                                {categories.map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.order}</TableCell>
                                        <TableCell>{c.title}</TableCell>
                                        <TableCell>{c.status ? <Badge className="bg-green-400/20 text-green-700">Active</Badge> : <Badge variant="destructive">Inactive</Badge> }</TableCell>
                                        <TableCell className="text-right space-x-3.5 flex justify-center items-center">
                                            <Link href={`/admin/categories/edit/${c.id}`}><Button>Modifier</Button></Link>
                                            <DeleteCategoryButton id={c.id}/>
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