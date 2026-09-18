"use client"

import { useRouter } from "next/navigation";
import { SubmitEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { createAttribute } from "@/app/actions/attributes";

export default function CreateAttributeForm() {


    const router = useRouter()

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement)

        const title = formData.get("title") as string

        const response = await createAttribute(title);

        if (response.success) {

            toast.add({
                title: "Attribute créée avec succès",
                type: "success"
            })

            router.push(`/admin/attributes/edit/${response.data}`)
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
                    <Field className="flex-1 w-full">
                        <FieldLabel htmlFor="title">Titre de l'attribute</FieldLabel>
                        <Input id="title" name="title" type="text" className="flex-1 w-full" required />
                    </Field>
                </CardContent>
            </Card>
            <Button className="float-right" type="submit">Sauvegarder</Button>
        </form>
    )

}