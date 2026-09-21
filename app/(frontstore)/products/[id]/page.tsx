export const revalidate = 60;

import { getAttributes } from "@/app/actions/attributes";
import { getProduct, getProductDetailed } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { attributeType, attributeValuesType } from "@/src/db/schema";
import { CheckCircle, XCircle } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import OrderForm from "./order-form";
import { AttributesObjectsWithValues, AttributeWithValuesType, VaraintValuesWithData } from "@/types";
import { formatNumbers } from "@/lib/utils";





type Props = {
    params: Promise<{ id: number }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = (await params).id


    let { data: currentProduct } = await getProduct(id)

    return {
        title: currentProduct ? currentProduct.meta_title : "Not found",
        description: currentProduct ? currentProduct.meta_desc : "",
    }
}





export default async function SingleProductPage({
    params,
    searchParams
}: Props) {
    const id = ((await params)).id;

    const { variant } = await searchParams;

    let { data: currentProduct } = await getProductDetailed(id)


    if (!currentProduct) {
        return <p>Product not found</p>
    }
    // Product Variants
    const variants = currentProduct.variants;

    const currentVariant = variant ? variants.find(v => v.id === Number(variant)) : variants.find(v => v.default);



    if (!currentVariant) {
        return <div>Variant non exitent</div>
    }

    // Cross-check these to visualize variants choices
    const { data: attributes } = await getAttributes()

    let currentValues: AttributesObjectsWithValues = {};

    if (variants.length > 1) {

        variants.map(v => {
            v.values.map(vv => {
                if (!currentValues[vv.attribute_id!]) {
                    currentValues[vv.attribute_id!] = []
                }
                currentValues[vv.attribute_id!].push(vv)
            })
        })

    }
    // Variant Images
    const prodcutImages = currentVariant.images

    return (
        <div className="space-y-6">
            <div className="gap-6 flex flex-col md:flex-row md:items-end">
                <Carousel className="w-full md:w-110 2xl:w-1/2">
                    <CarouselContent>
                        {prodcutImages.filter(i => i.variant_id === currentVariant!.id).map((i, index) => (
                            <CarouselItem key={i.id}>
                                <div className="w-full h-full overflow-hidden aspect-square">
                                    <Image loading={index == 0 ? "eager" : "lazy"} src={`/api/uploads${i.url}`} width={600} height={600} alt={`Image ${i.id}`} className="w-full h-full object-cover" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <div className="space-y-8 lg:space-y-12  flex-1">
                    <div className="space-y-12 lg:space-y-8">
                        <div>
                            <p className="font-serif text-muted-foreground">BJLX</p>
                            <h1 className="text-2xl md:text-3xl">{currentProduct.title}</h1>
                        </div>

                        <div className="flex justify-between items-center">
                            {currentVariant.on_promo ?
                                <div className="flex-1 flex items-end justify-center gap-3 text-xl md:text-2xl text-center">
                                    <p className="font-medium ">{formatNumbers(currentVariant.promo_price!, "DZ-dz")} D.A</p>
                                    <p className="text-muted-foreground text-sm line-through">{formatNumbers(currentVariant.price, "DZ-dz")} D.A</p>
                                </div>
                                :
                                <p className="flex-1 font-medium text-xl md:text-2xl text-center">{formatNumbers(currentVariant.price, "DZ-dz")} D.A</p>
                            }

                            <Separator orientation="vertical" />
                            <p className="text-muted-foreground px-6 text-center">Réf.: {currentVariant.sku}</p>
                        </div>
                    </div>
                    {currentVariant.track_stock ?
                        currentVariant.stock! > 0 ?
                            <div className="flex items-center gap-2 text-xs text-green-600">
                                <CheckCircle />
                                <p>En stock - délai de livraison 2-5 jours ouvrables</p>
                            </div>
                            :
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <XCircle />
                                <p>Rupture de stock — Contactez-nous pour plus d&apos;informations</p>
                            </div>
                        :
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <p>En stock - délai de livraison 2-5 jours ouvrables</p>
                        </div>
                    }
                    <OrderForm attributes={attributes!} id={id} currentVariant={currentVariant} currentValues={currentValues} />
                </div>
            </div>
            <div className="space-y-8">
                <div className="space-y-4 bg-accent p-5">
                    <h1 className="text-lg font-medium">Description</h1>
                    <Separator />
                    <p className="font-sans">{currentProduct.desc}</p>
                </div>
                <div>
                    <h1 className="text-lg font-medium">Vous aimerez peut-être aussi</h1>
                </div>
            </div>
        </div>

    )

}
