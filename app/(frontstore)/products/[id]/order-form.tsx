"use client"

import { getProductVariant } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttributeWithValuesType, productValues, VariantValues, VariantWithValuesImagesType } from "@/types";
import { useEffect, useState } from "react";
import QuickOrderForm from "./quick_order_form";



export default function OrderForm({ attributes, id, currentVariant, currentValues, variant }: { attributes: AttributeWithValuesType[], id: number, currentVariant: VariantWithValuesImagesType, currentValues: productValues, variant?: number }) {

    // This made so i can export data later to order
    const [values, setValues] = useState<VariantValues>({})



    const handleVariantChange = async (attr: number, v: number) => {
        // send sets of attribute and its value_id so ican search and redirect if default remove variant param from url else set variant id in url params in the server action
        const newValues = {
            ...values,
            [attr]: v,
        };
        setValues(newValues);
    }

    useEffect(() => {

        currentVariant.values.length !== 0 && setValues(currentVariant.values[0].values!)
    }, [])

    useEffect(() => {
        getProductVariant(currentVariant.product_id!, values)
        console.log(values);
    }, [values])

    useEffect(() => {
        currentVariant.values.length !== 0 && setValues(currentVariant.values[0].values!)
    }, [variant])

    return (
        <div className="space-y-4">
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(currentValues).map((attr) => {
                    const attrID: number = Number(attr)
                    const currentAttribute = attributes.find(at => at.id == attrID)!;
                    return (
                        <Field key={attr} className="w-full flex-1">
                            <FieldLabel>{currentAttribute.title}</FieldLabel>
                            <Select
                                value={values[attrID] ?? ""}
                                onValueChange={v => handleVariantChange(attrID, v!)}>
                                <SelectTrigger>
                                    <SelectValue>{currentAttribute.values.find(value => value.id === values[attrID])?.value}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {currentValues[attrID].map(v => (
                                            <SelectItem key={v} value={v} disabled={!currentAttribute.values.find(v => v.id === values[currentAttribute.id])}>
                                                {currentAttribute.values.find(value => value.id === v)?.value}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    )
                })}
            </div>
            <div className="space-y-4">
                <Button className="w-full">Ajouter au panier</Button>
                <QuickOrderForm/>
            </div>
        </div>
    )
}