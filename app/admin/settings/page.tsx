import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/src";
import { commune, wilaya } from "@/src/db/schema";
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
import { count } from "drizzle-orm";



export default async function SettingsAdminPage() {
    const wilayas = await db.select({ count: count() }).from(wilaya)
    const communes = await db.select({ count: count() }).from(commune)


    return (
        <div>
            <h3 className="text-2xl mb-6">Paramètres</h3>

            <Card>
                <CardHeader>
                    <CardTitle>Données du magasin</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-40">Data</TableHead>
                                <TableHead className="w-40">Action</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Wilayas</TableCell>
                                <TableCell>
                                    {wilayas[0].count === 0 && (
                                        <form action={insertWilayas}>
                                            <Button type="submit" size="sm">Insert</Button>
                                        </form>)}
                                </TableCell>
                                <TableCell>{wilayas[0].count} wilayas</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Communes</TableCell>
                                <TableCell>
                                    {communes[0].count === 0 && (
                                        <form action={insertCommunes}>
                                            <Button type="submit" size="sm">Insert</Button>
                                        </form>)}
                                </TableCell>
                                <TableCell>{communes[0].count} communes</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}