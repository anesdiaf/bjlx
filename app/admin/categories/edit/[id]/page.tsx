import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/src";
import { category } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { ChevronLeft, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditCategoryAdminPage({
    params,
}: {
    params: Promise<{ id: number }>
}) {
    const { id } = await params


    const currentCategory = await db.query.category.findFirst({
        where: {id}
    })


    if (!currentCategory) {
        return <p>Category not found</p>
    }


    async function editCategory(formData: FormData) {
        "use server"

        let isSuccessful = false;

        try {
            // turn formdata to object
            const categoryObject = Object.fromEntries(formData);
            categoryObject.status = categoryObject.status === "on" ? "true" : "false"

            // remove actionID
            const actionIdKey = Object.keys(categoryObject).find(k => k.startsWith('$ACTION_ID'))
            actionIdKey && delete categoryObject[actionIdKey]

            // make urlkey lower-case
            categoryObject.meta_url_key = categoryObject.meta_url_key.toString().toLowerCase()

            // handle sql query
            await db.update(category).set(categoryObject).where(eq(category.id, id))


            isSuccessful = true

        } catch (err) {
            console.log(err);
        }

        if (isSuccessful) {
            redirect("/admin/categories")
        }
    }

    return (

        <div className="w-full space-y-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/admin/categories">
                        <Button size="icon-lg"><ChevronLeft /></Button>
                    </Link>
                    <h3 className="text-2xl">Modifier la catégorie #{currentCategory.id}</h3>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="hidden md:block">Nouvelle catégorie</Button>
                    <Button className="md:hidden"><PlusIcon /></Button>
                </Link>
            </div>

            <div className="flex gap-6 items-start flex-wrap">
                <form action={editCategory} className="flex-1 max-w-lg space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations générales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Field className="flex-1 w-full">
                                    <FieldLabel htmlFor="title">Titre de la catégorie</FieldLabel>
                                    <Input id="title" name="title" type="text" className="flex-1 w-full" required defaultValue={currentCategory.title!} />
                                </Field>
                                <Field className="w-18">
                                    <FieldLabel htmlFor="order">Order</FieldLabel>
                                    <Input id="order" name="order" type="number" className="flex-1 w-full" required defaultValue={currentCategory.order!} />
                                </Field>
                                <Field className="w-fit">
                                    <FieldLabel htmlFor="status">Status</FieldLabel>
                                    <Checkbox id="status" name="status" defaultChecked={currentCategory.status || true} />
                                </Field>

                            </div>
                            <Field className="w-full">
                                <FieldLabel htmlFor="desc">Description</FieldLabel>
                                <Textarea id="desc" name="desc" required defaultValue={currentCategory.desc!} />
                            </Field>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Optimiser pour les moteurs de recherche</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <Field className="flex-1">
                                <FieldLabel htmlFor="meta_url_key">URL key <span className="text-[9px]">lower-case only</span></FieldLabel>
                                <Input id="meta_url_key" name="meta_url_key" type="text" className="flex-1 w-full" required defaultValue={currentCategory.meta_url_key!} />
                            </Field>
                            <Field className="flex-1">
                                <FieldLabel htmlFor="meta_title">Meta title</FieldLabel>
                                <Input id="meta_title" name="meta_title" type="text" className="flex-1 w-full" required defaultValue={currentCategory.meta_title!} />
                            </Field>
                            <Field className="w-full">
                                <FieldLabel htmlFor="meta_desc">Meta description</FieldLabel>
                                <Textarea id="meta_desc" name="meta_desc" required defaultValue={currentCategory.meta_desc!} />
                            </Field>
                        </CardContent>
                    </Card>
                    <Button className="float-right" type="submit">Sauvegarder</Button>
                </form>
            </div>

        </div >

    )
}