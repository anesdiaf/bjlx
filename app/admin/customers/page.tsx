import DeleteCategoryButton from "@/components/admin/categories/delete-category-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/src"
import { Pen } from "lucide-react"
import Link from "next/link"

export default async function CustomersAdminPage() {

    const customers = await db.query.user.findMany({
        where: {
            role: 'user'
        }
    })

    if (!customers) {
        return <div>...</div>
    }


    console.log(customers);
    return (
        <div className="w-full">
            <div className="flex justify-between">
                <h3 className="text-2xl mb-6">Clients</h3>
            </div>
            <Table>
                <TableCaption>{customers.length === 0 && "Aucune catégorie n'a encore été ajoutée."}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead className="min-w-30">Nom</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {customers.length === 0 && (<TableBody></TableBody>)}
                {customers.length !== 0 && (
                    <TableBody>
                        {customers.map((c, index) => (
                            <TableRow key={c.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{c.name}</TableCell>
                                <TableCell>{!c.banned ? <Badge className="bg-green-400/20 text-green-700">Active</Badge> : <Badge variant="destructive">Inactive</Badge>}</TableCell>
                                <TableCell className="text-right space-x-3.5 flex justify-center items-center">
                                    <Link href={`/admin/categories/edit/${c.id}`}><Button size="icon"><Pen/></Button></Link>
                                    <DeleteCategoryButton id={1} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>
        </div>
    )
}