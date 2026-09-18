"use client"

import { createVariant, createVariantImage, deleteVariantValue, setVariantValue } from "@/app/actions/products"
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
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import { attributeWithValuesType, productVariantValuesType } from "@/src/db/schema"
import { CameraIcon, CheckIcon, ImageIcon, ImagePlusIcon, PlusIcon, UploadIcon, XIcon } from "lucide-react"
import Image from "next/image"
import { SubmitEvent, useEffect, useState } from "react"


interface Values {
    [key: string]: any;
}

export default function ProductImagesForm({ id, productId }: { id: number, productId: number }) {

    const [images, setImages] = useState<Blob[]>([])


    const [imageBlob, setImageBlob] = useState<Blob>()

    const [open, setOpen] = useState(false);


    const uploadImage = async (e: SubmitEvent<HTMLFormElement>) => {

        if(!imageBlob){
            return
        }
        e.preventDefault()

        const formData = new FormData(e.target)

        const order = formData.get("order")

        const location = `/products/${productId}/${id}/${order}.webp`

        const response = await createVariantImage(location, imageBlob, id, productId )
        


        if (response.success) {
        
            toast.add({
                title: "Image téléchargée avec succès",
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

    const uploadThumbnail = async () => {

        const location = ""
        //const response = await createVariantImage()

    }


    return (
        <Dialog open={open}>
            <DialogTrigger onClick={() => setOpen(true)} render={<Button size="icon-sm"><ImageIcon /></Button>} />
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="w-full flex justify-between items-center">
                        Images du produit
                        <Button onClick={() => setOpen(false)} type="button" variant="ghost" size="icon-sm"><XIcon /></Button>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={e => uploadImage(e)} className="space-y-4">
                    {imageBlob ? (
                        <div className="flex justify-center items-center ring ring-primary aspect-square size-40 relative">
                            <Button onClick={() => setImageBlob(undefined)} size="icon-xs" variant="destructive" className="absolute top-0 right-0"><XIcon /></Button>
                            <Image src={URL.createObjectURL(imageBlob)} className="w-full h-full" width={600} height={600} alt="Image" />
                        </div>
                    ) : (
                        <Field>
                            <FieldLabel htmlFor="image">
                                <div className="flex justify-center items-center border-2 border-dotted aspect-square size-40">
                                    <CameraIcon className="text-primary" />
                                </div>
                            </FieldLabel>
                            <Input id="image" name="image" type="file" placeholder="Max Leiter" hidden onChange={e => { e.target.files?.length !== 0 && setImageBlob(e.target.files![0]) }} accept=".png, .avif, .webp" />
                        </Field>
                    )}

                    <div className="w-40 flex items-end">
                        <Field>
                            <FieldLabel htmlFor="order">Order</FieldLabel>
                            <Input id="order" name="order" type="text" placeholder="1" />
                        </Field>
                        <Button type="submit" size="icon-sm">
                            <UploadIcon />
                        </Button>
                    </div>
                </form>

                <Separator className="w-full h-1" />
                <div className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="image">
                            <div className="flex justify-center items-center border-2 border-dotted aspect-square size-40">
                                <CameraIcon className="text-primary" />
                            </div>
                        </FieldLabel>
                        <Input id="image" type="file" placeholder="Max Leiter" hidden />
                    </Field>
                    <div className="w-40 flex items-end">
                        <Field>
                            <FieldLabel htmlFor="order">Order</FieldLabel>
                            <Input id="order" type="text" placeholder="1" />
                        </Field>
                        <Button onClick={() => uploadThumbnail()} size="icon-sm">
                            <UploadIcon />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}