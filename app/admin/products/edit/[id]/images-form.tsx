"use client"

import { createVariantImage, createVariantThumbnail, deleteVariantImage, deleteVariantThumbnail, editVariantImage, editVariantThumbnail } from "@/app/actions/products"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import { variantImageType, variantThumbnailType } from "@/src/db/schema"
import { CameraIcon, CheckIcon, ImageIcon, Pen, TrashIcon, UploadIcon, XIcon } from "lucide-react"
import Image from "next/image"
import { SubmitEvent, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"


interface Values {
    [key: string]: any;
}


export default function ProductImagesForm(
    { id, productId, prodcutImages, productThumbnails }
        : { id: number, productId: number, prodcutImages: variantImageType[], productThumbnails: variantThumbnailType[] }
) {


    const [open, setOpen] = useState(false);


    const [imageBlob, setImageBlob] = useState<Blob>()
    const [imageOrder, setImageOrder] = useState<number>()

    const [selectedImage, setSelectedImage] = useState<variantImageType>()

    const uploadImage = async () => {


        if (!imageBlob || !imageOrder) {
            toast.add({
                title: "Une image et son ordre sont requis",
                type: "error",
            })
            return
        }


        if (prodcutImages.filter(i => i.variant_id === id).find(i => i.order === imageOrder)) {
            toast.add({
                title: "Une image avec cette order existe déjà",
                type: "error",
            })
            return
        }

        const timestamp = new Date().getTime()


        const location = `/products/${productId}/${id}/${timestamp}.webp`

        const response = await createVariantImage(location, imageOrder, imageBlob, id, productId)



        if (response.success) {

            toast.add({
                title: "Image téléchargée avec succès",
                type: "success"
            })

            setImageBlob(undefined)
            setImageOrder(undefined)

        } else {
            toast.add({
                title: response.error,
                type: "error",
            })
        }
    }


    const editImage = async (id: number) => {


        const response = await editVariantImage(id, selectedImage?.order!, productId)

        if (response.success) {

            toast.add({
                title: "Ordre des images modifié avec succès",
                type: "success"
            })

            setSelectedImage(undefined)

        } else {
            toast.add({
                title: response.error,
                type: "error",
            })
        }
    }

    const deleteImage = async (id: number, key: string) => {


        const response = await deleteVariantImage(id, key, productId)

        if (response.success) {

            toast.add({
                title: "Suppression de l'image de la variante réussie",
                type: "success"
            })

        } else {
            toast.add({
                title: response.error,
                type: "error",
            })
        }
    }


    
    const [thumbnailBlob, setThumbnailBlob] = useState<Blob>()

    const [thumbnailOrder, setThumbnailOrder] = useState<number>()

    const [selectedThumbnail, setSelectedThumbnail] = useState<variantThumbnailType>()


    const uploadThumbnail = async () => {


        if (!thumbnailBlob || !thumbnailOrder) {
            toast.add({
                title: "Une vignette et son ordre sont requis",
                type: "error",
            })
            return
        }


        if (productThumbnails.filter(i => i.variant_id === id).find(i => i.order === thumbnailOrder)) {
            toast.add({
                title: "Une vignette avec cette order existe déjà",
                type: "error",
            })
            return
        }

        const timestamp = new Date().getTime()


        const location = `/products/${productId}/${id}/thumbnails/${timestamp}.webp`

        const response = await createVariantThumbnail(location, thumbnailOrder, thumbnailBlob, id, productId)



        if (response.success) {

            toast.add({
                title: "Vignette téléchargée avec succès",
                type: "success"
            })

            setThumbnailBlob(undefined)
            setThumbnailOrder(undefined)

        } else {
            toast.add({
                title: response.error,
                type: "error",
            })
        }
    }

        const editThumbnail = async (id: number) => {


        const response = await editVariantThumbnail(id, selectedImage?.order!, productId)

        if (response.success) {

            toast.add({
                title: "Ordre de la vignette modifié avec succès",
                type: "success"
            })

            setSelectedThumbnail(undefined)

        } else {
            toast.add({
                title: response.error,
                type: "error",
            })
        }
    }

        const deleteThumbnail = async (id: number, key: string) => {


        const response = await deleteVariantThumbnail(id, key, productId)

        if (response.success) {

            toast.add({
                title: "Suppression de la vignette de la variante réussie",
                type: "success"
            })

        } else {
            toast.add({
                title: response.error,
                type: "error",
            })
        }
    }




    return (
        <Dialog open={open}>
            <DialogTrigger onClick={() => setOpen(true)} render={<Button size="icon-sm"><ImageIcon /></Button>} />
            <DialogContent showCloseButton={false} className="w-full sm:max-w-200">
                <DialogHeader>
                    <DialogTitle className="w-full flex justify-between items-center">
                        Images de variante
                        <Button onClick={() => setOpen(false)} type="button" variant="ghost" size="icon-sm"><XIcon /></Button>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex items-stretch h-62">
                    <div className="space-y-4 w-40">
                        {imageBlob ? (
                            <div className="flex justify-center items-center outline outline-dashed outline-offset-2 aspect-square size-40 relative">
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

                        <div className="w-full flex items-end">
                            <Field>
                                <FieldLabel htmlFor="order">Order</FieldLabel>
                                <Input value={imageOrder} onChange={e => setImageOrder(Number(e.target.value))} id="order" name="order" type="number" placeholder="1" />
                            </Field>
                            <Button onClick={() => uploadImage()} size="icon-sm">
                                <UploadIcon />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1">
                        {prodcutImages.length === 0 && (
                            <p className="text-muted-foreground text-center w-full mt-6">Aucune image n'a encore été ajoutée.</p>
                        )}
                        {prodcutImages.length !== 0 &&
                            <ScrollArea className="h-62">
                                <Table className="max-h-62 overflow-hidden">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12 text-center">#</TableHead>
                                            <TableHead className="w-full">Image</TableHead>
                                            <TableHead className="text-center">Order</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {prodcutImages.filter(i => i.variant_id === id).map((v, index) => (
                                            <TableRow key={v.id}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <div className="aspect-square outline outline-dashed size-20">
                                                                <Image src={`/api/uploads${v.url}`} width={150} height={150} alt={v.order?.toString() ?? "V Image"} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{v.url}</TooltipContent>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {selectedImage?.id === v.id ?
                                                        <Input type="number" value={selectedImage.order!} onChange={e => setSelectedImage({ ...selectedImage, order: Number(e.target.value) })} />
                                                        :
                                                        v.order
                                                    }
                                                </TableCell>
                                                <TableCell className="space-x-4 text-right">
                                                    {selectedImage?.id === v.id ?
                                                        <Button onClick={() => editImage(v.id)} size="icon-sm" variant="secondary"><CheckIcon /></Button> :
                                                        <Button onClick={() => setSelectedImage(v)} size="icon-sm" variant="secondary"><Pen /></Button>
                                                    }
                                                    <Popover>
                                                        <PopoverTrigger render={<Button size="icon-sm" variant="destructive"><TrashIcon /></Button>} />
                                                        <PopoverContent>
                                                            <PopoverHeader>
                                                                <PopoverTitle>Es-tu sûr ?</PopoverTitle>
                                                            </PopoverHeader>
                                                            <Button onClick={() => deleteImage(v.id, v.url)}><CheckIcon /></Button>
                                                        </PopoverContent>
                                                    </Popover>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        }
                    </div>
                </div>

                <Separator className="w-full h-1" />

                <DialogTitle className="w-full flex justify-between items-center">
                    Vignettes de variante
                </DialogTitle>

                <div className="flex items-stretch h-62">
                    <div className="space-y-4 w-40">
                        {thumbnailBlob ? (
                            <div className="flex justify-center items-center outline outline-dashed outline-offset-2 aspect-square size-40 relative">
                                <Button onClick={() => setThumbnailBlob(undefined)} size="icon-xs" variant="destructive" className="absolute top-0 right-0"><XIcon /></Button>
                                <Image src={URL.createObjectURL(thumbnailBlob)} className="w-full h-full" width={600} height={600} alt="Image" />
                            </div>
                        ) : (
                            <Field>
                                <FieldLabel htmlFor="thumbnail">
                                    <div className="flex justify-center items-center border-2 border-dotted aspect-square size-40">
                                        <CameraIcon className="text-primary" />
                                    </div>
                                </FieldLabel>
                                <Input id="thumbnail" name="thumbnail" type="file" hidden onChange={e => { e.target.files?.length !== 0 && setThumbnailBlob(e.target.files![0]) }} accept=".webp" />
                            </Field>
                        )}

                        <div className="w-full flex items-end">
                            <Field>
                                <FieldLabel htmlFor="t_order">Order</FieldLabel>
                                <Input value={thumbnailOrder} onChange={e => setThumbnailOrder(Number(e.target.value))} id="t_order" name="t_order" type="number" placeholder="1" />
                            </Field>
                            <Button onClick={() => uploadThumbnail()} type="submit" size="icon-sm">
                                <UploadIcon />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1">
                        {productThumbnails.length === 0 && (
                            <p className="text-muted-foreground text-center w-full mt-6">Aucune vignette n'a encore été ajoutée.</p>
                        )}
                        {productThumbnails.length !== 0 &&
                            <ScrollArea className="h-62">


                                <Table className="max-h-62 overflow-hidden">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12 text-center">#</TableHead>
                                            <TableHead className="w-full">Image</TableHead>
                                            <TableHead className="text-center">Order</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {productThumbnails.filter(i => i.variant_id === id).map((v, index) => (
                                            <TableRow key={v.id}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <div className="aspect-square outline outline-dashed size-20">
                                                                <Image src={`/api/uploads${v.url}`} width={150} height={150} alt={v.order?.toString() ?? "V Image"} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{v.url}</TooltipContent>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {selectedImage?.id === v.id ?
                                                        <Input type="number" value={selectedImage.order!} onChange={e => setSelectedThumbnail({ ...selectedImage, order: Number(e.target.value) })} />
                                                        :
                                                        v.order
                                                    }
                                                </TableCell>
                                                <TableCell className="space-x-4 text-right">
                                                    {selectedImage?.id === v.id ?
                                                        <Button onClick={() => editThumbnail(v.id)} size="icon-sm" variant="secondary"><CheckIcon /></Button> :
                                                        <Button onClick={() => setSelectedThumbnail(v)} size="icon-sm" variant="secondary"><Pen /></Button>
                                                    }
                                                    <Popover>
                                                        <PopoverTrigger render={<Button size="icon-sm" variant="destructive"><TrashIcon /></Button>} />
                                                        <PopoverContent>
                                                            <PopoverHeader>
                                                                <PopoverTitle>Es-tu sûr ?</PopoverTitle>
                                                            </PopoverHeader>
                                                            <Button onClick={() => deleteThumbnail(v.id, v.url)}><CheckIcon /></Button>
                                                        </PopoverContent>
                                                    </Popover>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}