"use client"

import { useRouter } from "next/navigation";
import { SubmitEvent } from "react";
import { createCategory } from "@/app/actions/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function CreateCategoryForm({lastOrder}: {lastOrder: number}) {

    
    const router = useRouter()

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement)

        const response = await createCategory(formData);

        if (response.success) {

            toast.add({
                title: "Catégorie créée avec succès",
                type: "success"
            })

            router.push(`/admin/categories/edit/${response.data}`)
        } else {
            toast.add({
                title: response.error,
                type: "error"
            })
        }
    }


    return (
        <form onSubmit={e => handleSubmit(e)} className="flex-1 max-w-lg space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Field className="flex-1 w-full">
                            <FieldLabel htmlFor="title">Titre de la catégorie</FieldLabel>
                            <Input id="title" name="title" type="text" className="flex-1 w-full" required />
                        </Field>
                        <Field className="w-18">
                            <FieldLabel htmlFor="order">Order</FieldLabel>
                            <Input id="order" name="order" type="number" className="flex-1 w-full" required defaultValue={lastOrder}/>
                        </Field>
                        <Field className="w-fit">
                            <FieldLabel htmlFor="status">Status</FieldLabel>
                            <Checkbox id="status" name="status" defaultChecked />
                        </Field>

                    </div>

                    <Field className="w-full">
                        <FieldLabel htmlFor="desc">Description</FieldLabel>
                        <Textarea id="desc" name="desc" required />
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
                        <Input id="meta_url_key" name="meta_url_key" type="text" className="flex-1 w-full" required />
                    </Field>
                    <Field className="flex-1">
                        <FieldLabel htmlFor="meta_title">Meta title</FieldLabel>
                        <Input id="meta_title" name="meta_title" type="text" className="flex-1 w-full" required />
                    </Field>
                    <Field className="w-full">
                        <FieldLabel htmlFor="meta_desc">Meta description</FieldLabel>
                        <Textarea id="meta_desc" name="meta_desc" required />
                    </Field>
                </CardContent>
            </Card>
            <Button className="float-right" type="submit">Sauvegarder</Button>
        </form>
    )

}