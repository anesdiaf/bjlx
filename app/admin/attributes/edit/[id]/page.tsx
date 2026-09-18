import { Button } from "@/components/ui/button";
import { db } from "@/src"
import { ChevronLeft, PlusIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { attribute, attributeValues } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function EditAttributeAdminPage({
    params,
}: {
    params: Promise<{ id: number }>
}) {

    const id = (await params).id;

    let currentAttribute = await db.query.attribute.findFirst({
        where: { id },
    });

    if (!currentAttribute) {
        return <p>Attribute not found</p>
    }

    const cuurentAttributeValues = await db.select().from(attributeValues).where(eq(attributeValues.attribute_id, currentAttribute?.id))


    const editAttribute = async (formData: FormData) => {
        "use server"


        const title = formData.get("title") as string

        try {
            await db.update(attribute).set({ title }).where(eq(attribute.id, currentAttribute.id))
            revalidatePath(`/admin/attributes/edit/${currentAttribute.id}`)
        } catch (err) {
            console.log(err.message);
        }

    }

    const createValue = async (formData: FormData) => {
        "use server"

        const value = formData.get("title") as string

        try {

            await db.insert(attributeValues).values({ value, attribute_id: currentAttribute.id })

            revalidatePath(`/admin/attributes/edit/${currentAttribute.id}`)
        } catch (err) {
            console.log(err.message);
        }
    }

    const deleteValue = async (formData: FormData) => {
        "use server"

        const value_id = Number(formData.get("value_id"))

        try {

            await db.delete(attributeValues).where(eq(attributeValues.id, value_id))


            revalidatePath(`/admin/attributes/edit/${currentAttribute.id}`)
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <div className="w-full space-y-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/admin/attributes">
                        <Button size="icon-lg"><ChevronLeft /></Button>
                    </Link>
                    <h3 className="text-2xl">Modifier l'attribute #{currentAttribute.id}</h3>
                </div>
                <Link href="/admin/attributes/new">
                    <Button className="hidden md:block">Nouvelle attribute</Button>
                    <Button className="md:hidden"><PlusIcon /></Button>
                </Link>
            </div>
            <div className="flex items-start gap-6 flex-wrap">
                <form action={editAttribute} className="flex-1 max-w-lg space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations générales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Field className="flex-1 w-full">
                                <FieldLabel htmlFor="title">Titre de l'attribute</FieldLabel>
                                <Input id="title" name="title" type="text" className="flex-1 w-full" required defaultValue={currentAttribute.title} />
                            </Field>
                            <input type="number" name="id" defaultValue={currentAttribute.id} hidden />
                        </CardContent>
                    </Card>
                    <Button className="float-right" type="submit">Sauvegarder</Button>
                </form>
                <div className="flex-1 max-w-lg space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Valeurs d'attribute</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form action={createValue}>
                                <div className="flex items-end">
                                    <Field className="flex-1 w-full">
                                        <FieldLabel htmlFor="title">Titre de la valeur</FieldLabel>
                                        <Input id="title" name="title" type="text" className="flex-1 w-full" required />

                                    </Field>
                                    <Button className="float-right" type="submit" size="icon-lg"><PlusIcon /></Button>
                                </div>
                            </form>
                            <input type="number" name="id" defaultValue={currentAttribute.id} hidden />
                            <Table>
                                <TableCaption>{cuurentAttributeValues.length === 0 && "Aucune catégorie n'a encore été ajoutée."}.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">#</TableHead>
                                        <TableHead className="">Titre</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {cuurentAttributeValues.length == 0 && (<TableBody></TableBody>)}
                                {cuurentAttributeValues.length !== 0 && (
                                    <TableBody>
                                        {cuurentAttributeValues.map(c => (
                                            <TableRow key={c.id}>
                                                <TableCell className="font-medium">{c.id}</TableCell>
                                                <TableCell>{c.value}</TableCell>
                                                <TableCell className="text-right float-right space-x-3.5 flex justify-center items-center">
                                                    <form action={deleteValue}>
                                                        <input type="text" name="value_id" id="value_id" defaultValue={c.id} hidden />
                                                        <Button type="submit">Supprimer</Button>
                                                    </form>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                )}
                            </Table>
                        </CardContent>
                    </Card>

                </div>
            </div>

        </div>
    )
}