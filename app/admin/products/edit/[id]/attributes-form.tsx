"use client"

import { setVariantValue } from "@/app/actions/products"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { attributeWithValuesType, productVariantValuesType } from "@/src/db/schema"
import { VariantValues } from "@/types"
import { XIcon } from "lucide-react"
import { useEffect, useState } from "react"



export default function SetAttributesForm({ variantValues, attributes, id, productId }: { variantValues?: productVariantValuesType, attributes: attributeWithValuesType[], id: number, productId: number }) {


    const [values, setValues] = useState<VariantValues>({})

    const [open, setOpen] = useState(false);


    const handleChanges = (key: number, value: any) => {
        setValues({ ...values, [key]: value })
    }


    const handleUpsert = async () => {
        const response = await setVariantValue(productId, id, values)

        if (response.success) {

            toast.add({
                title: "Données de variante modifiées avec succès",
                type: "success"
            })

            setOpen(false)

        } else {
            toast.add({
                title: response.error,
                type: "error"
            })
        }
    }


    const handleDelete = async (attribute_id: number) => {
        setValues(prev => {
            const newValues = { ...prev };
            delete newValues[attribute_id];
            return newValues;
        });
    }

    useEffect(() => {
        if (variantValues && variantValues.values) {
            const currentVariantValues: VariantValues = variantValues.values;
            Object.keys(currentVariantValues!).map(v => {
                setValues({ ...values, [Number(v)]: currentVariantValues[Number(v)] })
            })
        }
    }, [])

    useEffect(() => {

    }, [values])

    return (
        <Dialog open={open}>
            <DialogTrigger onClick={() => setOpen(true)} render={<Button size="sm">Attributes</Button>} />
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="w-full flex justify-between items-center">
                        Définir les attributs {id}
                        <Button onClick={() => setOpen(false)} type="button" variant="ghost" size="icon-sm"><XIcon /></Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-4 flex-wrap flex-col">
                    {attributes.map(attr => (
                        <div key={attr.id} className="flex items-end w-full gap-4">
                            <Field className="w-full flex-1">
                                <FieldLabel>{attr.title}</FieldLabel>
                                <Select value={values[attr.id] ?? undefined} onValueChange={v => handleChanges(attr.id, v)}>
                                    <SelectTrigger>
                                        <SelectValue>{attr.values.find(v => v.id == values[attr.id])?.value}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {attr.values.map((v) => (
                                                <SelectItem key={v.id} value={v.id}>
                                                    {v.value}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <div>
                                {attr.id in values && (
                                    <Button onClick={() => handleDelete(attr.id)} size="icon-sm">
                                        <XIcon />
                                    </Button>
                                )}

                            </div>

                        </div>

                    ))}
                </div>
                <Button onClick={() => handleUpsert()} className="w-full">Sauvegarder</Button>

            </DialogContent>
        </Dialog>
    )
}