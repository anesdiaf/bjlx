"use client"

import { getProductVariant } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { AttributesObjectsWithValues, AttributeWithValuesType, VariantWithValuesImagesType } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface Value extends Object {
    [key: number]: any;
}


export default function OrderForm({ attributes, id, currentVariant, currentValues }: { attributes: AttributeWithValuesType[], id: number, currentVariant: VariantWithValuesImagesType, currentValues: AttributesObjectsWithValues }) {

    // This made so i can export data later to order
    const [values, setValues] = useState<Value>({})

    const [valueChanged, setValueChanged] = useState(false)

    const router = useRouter()



    const handleVariantChange = async (attr: number, v: number) => {
        // send sets of attribute and its value_id so ican search and redirect if default remove variant param from url else set variant id in url params in the server action

        const newValues = {
            ...values,
            [attr]: v,
        };

        setValues(newValues);


    }

    useEffect(() => {
        currentVariant.values.forEach(value => {
            setValues({ ...values, [value.attribute_id!]: value.value_id })
        });
    }, [])

    useEffect(() => {

        getProductVariant(currentVariant.product_id!, values)
    }, [values])


    return (
        <div className="space-y-4">
            <div className="w-full grid grid-cols-2 lg:grid-cols-3">
                {Object.keys(currentValues).map((attr) => {
                    const attrID: number = Number(attr)
                    return (
                        <Field key={attr} className="w-full flex-1">
                            <FieldLabel>{attributes.find(at => at.id == attrID)?.title}</FieldLabel>
                            <Select
                                value={values[attrID] ?? ""}
                                onValueChange={v => handleVariantChange(attrID, v!)}
                                defaultValue={currentVariant.values.find(v => v.id === attrID)?.value_id}>
                                <SelectTrigger>
                                    <SelectValue>{currentValues[attrID].find(v => v.value_id == values[attrID])?.value?.value}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {currentValues[attrID].map(v => (
                                            <SelectItem key={v.id} value={v.value_id}>
                                                {v.value?.value}
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
                <Button className="w-full">Acheter maintenant</Button>
            </div>
        </div>
    )
}