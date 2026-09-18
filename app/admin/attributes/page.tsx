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
import { attribute } from "@/src/db/schema";
import DeleteAttributeButton from "@/components/admin/attributes/delete-attribute-button";

export default async function AttributesAdminPage(){

    const attributes = await db.select().from(attribute)

    if(!attributes){
        return <div>...</div>
    }

    return(
        <div className="w-full">
            <div className="flex justify-between">
                <h3 className="text-2xl mb-6">Attributes</h3>
                <Link href="/admin/attributes/new">
                    <Button className="hidden md:block">Nouvelle attributes</Button>
                    <Button className="md:hidden"><PlusIcon /></Button>
                </Link>
            </div>

            <Card className="w-full">
                <CardHeader>
                    <Input type="text" />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>{attributes.length === 0 && "Aucune attribute n'a encore été ajoutée."}.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">#</TableHead>
                                <TableHead className="min-w-30">Titre</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        {attributes.length == 0 && (<TableBody></TableBody>)}
                        {attributes.length !== 0 && (
                            <TableBody>
                                {attributes.map((c, index) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{index+1}</TableCell>
                                        <TableCell>{c.title}</TableCell>
                                        <TableCell className="text-right space-x-3.5 flex justify-center items-center">
                                            <Link href={`/admin/attributes/edit/${c.id}`}><Button>Modifier</Button></Link>
                                            <DeleteAttributeButton id={c.id}/>
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