"use client"

import { createProduct, editProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { categoryType, productType } from "@/src/db/schema";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

export default function EditProductForm({ categories, currentProduct }: { categories: categoryType[], currentProduct: productType }) {

    const router = useRouter()

    const [selectedCategory, setCategory] = useState<number | undefined>(currentProduct.category_id ?? undefined);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement)

        const response = await editProduct(formData, currentProduct.id);

        if (response.success) {

            toast.add({
                title: "Produit modifié avec succès",
                type: "success"
            })

        } else {
            toast.add({
                title: response.error,
                type: "error"
            })
        }
    }

    return (
        <form onSubmit={e => handleSubmit(e)} className="flex-1 space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-end  gap-3">
                        <Field className="flex-1 w-full">
                            <FieldLabel htmlFor="title">Titre du produit</FieldLabel>
                            <Input id="title" name="title" type="text" className="flex-1 w-full" required defaultValue={currentProduct.title ?? ""} />
                        </Field>
                        <Field className="w-fit">
                            <FieldLabel htmlFor="status">Status</FieldLabel>
                            <Checkbox id="status" name="status" defaultChecked={currentProduct.status ?? false} />
                        </Field>
                    </div>
                    <div className="flex items-end gap-3">
                        <Field className="flex-1 w-full">
                            <FieldLabel htmlFor="category_id">Catégorie</FieldLabel>
                            <Select onValueChange={v => setCategory(v as number)} defaultValue={currentProduct.category_id??undefined} name="category_id" id="category_id">
                                <SelectTrigger>
                                    <SelectValue placeholder="Catégorie" >{selectedCategory && categories.find(c => c.id === selectedCategory)!.title}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {categories.map((item) => (
                                            <SelectItem key={item.id} value={item.id}>
                                                {item.title}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field className="w-fit">
                            <FieldLabel htmlFor="featured">En vedette</FieldLabel>
                            <Checkbox id="featured" name="featured" defaultChecked={currentProduct.featured ?? false} />
                        </Field>
                    </div>
                    <Field className="w-full">
                        <FieldLabel htmlFor="desc">Description</FieldLabel>
                        <Textarea id="desc" name="desc" required defaultValue={currentProduct.desc ?? ""} />
                    </Field>
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Optimiser pour les moteurs de recherche</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Field className="flex-1">
                        <FieldLabel htmlFor="meta_url_key">URL key <span className="text-[9px]">lower-case only</span></FieldLabel>
                        <Input id="meta_url_key" name="meta_url_key" type="text" className="flex-1 w-full" required defaultValue={currentProduct.meta_url_key??""} />
                    </Field>
                    <Field className="flex-1">
                        <FieldLabel htmlFor="meta_title">Meta title</FieldLabel>
                        <Input id="meta_title" name="meta_title" type="text" className="flex-1 w-full" required defaultValue={currentProduct.meta_title??""} />
                    </Field>
                    <Field className="w-full">
                        <FieldLabel htmlFor="meta_desc">Meta description</FieldLabel>
                        <Textarea id="meta_desc" name="meta_desc" required defaultValue={currentProduct.meta_desc??""} />
                    </Field>
                </CardContent>
            </Card>
            <Button className="float-right" type="submit">Sauvegarder</Button>
        </form>
    )
}