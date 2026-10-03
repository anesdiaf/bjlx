"use client"

import { getProductVariant } from "@/app/actions/products";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttributeWithValuesType, ProductWithDetailsType, productValues, userWithDataType, VariantValues, VariantWithValuesImagesType } from "@/types";
import { useEffect, useState } from "react";
import QuickOrderForm from "./quick_order_form";
import AddItemToCartButton from "./add-cart-button";



export default function OrderForm({ attributes, currentProduct, currentVariant, currentValues, variant_id, userInfo }
    : { userInfo?: userWithDataType, attributes: AttributeWithValuesType[], currentProduct: ProductWithDetailsType, currentVariant: VariantWithValuesImagesType, currentValues: productValues, variant_id?: number }) {

    // This made so i can export data later to order
    const [values, setValues] = useState<VariantValues>(currentVariant.values[0]?.values ?? {})



    const handleVariantChange = async (attr: number, v: number) => {
        // send sets of attribute and its value_id so ican search and redirect if default remove variant param from url else set variant id in url params in the server action
        const newValues = {
            ...values,
            [attr]: v,
        };
        setValues(newValues);
    }


    useEffect(() => {
        if (currentVariant.values.length !== 0 && values !== currentVariant.values[0].values) {
            getProductVariant(currentVariant.product_id!, values)
        }

    }, [values])

    useEffect(() => {
        currentVariant.values.length !== 0 && setValues(currentVariant.values[0].values!)
    }, [variant_id])


const isValueAvailable = (
    attrId: number,
    valueId: number
) => {
    // Attributes before the current attribute
    const previousSelections = Object.entries(values)
        .filter(([key]) => Number(key) < attrId);

    return currentProduct.variants.some((variant) => {
        const variantValues = variant.values?.[0]?.values;

        if (!variantValues) return false;

        // Current option must exist in this variant
        if (variantValues[attrId] !== valueId) {
            return false;
        }

        // All previous attributes must match
        return previousSelections.every(
            ([key, selectedValue]) =>
                variantValues[Number(key)] === selectedValue
        );
    });
};

    return (
        <div className="space-y-4">
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
                {currentValues && Object.keys(currentValues).map((attr) => {
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
                                        {currentValues[attrID].map((v, index) => (
                                            <SelectItem 
                                            key={index} 
                                            value={v} 
                                            disabled={!isValueAvailable(attrID, v)}>
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
            {(!currentVariant.track_stock || (currentVariant.track_stock && currentVariant.stock! >= 1)) &&
                <div className="space-y-4">
                    <AddItemToCartButton title={currentProduct.title} variant={currentVariant} />
                    <QuickOrderForm userInfo={userInfo} currentProduct={currentProduct} currentVariant={currentVariant} />
                </div>
            }

        </div>
    )
}