"use client"

import { createVariant, deleteVariantValue, setVariantValue } from "@/app/actions/products"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { attributeWithValuesType, productVariantValuesType } from "@/src/db/schema"
import { CheckIcon, PlusIcon, XIcon } from "lucide-react"
import { SubmitEvent, useEffect, useState } from "react"


interface Values {
    [key: string]: any;
}

export default function SetAttributesForm({ variantValues, attributes, id, productId }: { variantValues: productVariantValuesType[], attributes: attributeWithValuesType[], id: number, productId: number }) {


    const [values, setValues] = useState<Values>({})

    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement)

        const response = await createVariant(formData, id)


        if (response.success) {

            toast.add({
                title: "Variante créée avec succès",
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

    const handleChanges = (key: number, value: any) => {
        setValues({ ...values, [key]: value })
        console.log(values);
    }


    const handleUpsert = async (attribute_id:number, value_id:string) => {
        if (attribute_id && value_id) {
            await setVariantValue(attribute_id, Number(value_id), productId, id)
        } 
    }


    const handleDelete = async (attribute_id:number) => {
        await deleteVariantValue(attribute_id, id, productId)
    }

    useEffect(() => {
        if(variantValues.length !== 0){
            variantValues.forEach(element => {
                setValues({ ...values, [element.attribute_id!]: element.value_id })
            });
        }
    }, [])

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
                <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
                    <div className="flex items-center gap-4 flex-wrap flex-col">
                        {attributes.map(attr => (
                            <div key={attr.id} className="flex items-end w-full gap-4">
                                <Field className="w-full flex-1">
                                    <FieldLabel>{attr.title}</FieldLabel>
                                    <Select onValueChange={v => handleChanges(attr.id, v)} defaultValue={variantValues.find(v => v.attribute_id === attr.id)?.value_id}>
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
                                    <Button onClick={() => handleUpsert(attr.id, values[attr.id])} size="icon-sm">
                                        <CheckIcon />
                                    </Button>
                                    {variantValues.find(v => v.attribute_id === attr.id) && (
                                        <Button onClick={() => handleDelete(attr.id)} size="icon-sm">
                                            <XIcon />
                                        </Button>
                                    )}

                                </div>

                            </div>

                        ))}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}