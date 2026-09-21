export const revalidate = 60;

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { db } from "@/src";
import { attributeType, productVariant, productVariantValues, productVariantValuesType, producVariantType, variantImage } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { CheckCircle, XCircle } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";





type Props = {
    params: Promise<{ id: number }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = (await params).id


    let currentProduct = await db.query.product.findFirst({
        where: { id }
    });


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

    let currentProduct = await db.query.product.findFirst({
        where: { id }
    });



    if (!currentProduct) {
        return <p>Product not found</p>
    }



    // Product Variants
    const variants = await db.select().from(productVariant).where(eq(productVariant.product_id, id))


    let attributes: attributeType[] | undefined;
    // productVariantValues (to check if product has attributes)
    let variantValues: productVariantValuesType[] | undefined;


    let currentVariant: producVariantType | undefined;
    // chekc if prodcut has variants
    if (variants && variants.length !== 0) {
        // If prodcut has only one variant
        if (variants.length === 1 || !variant) {
            currentVariant = variants.find(v => v.default)
        } else {
            currentVariant = variants.find(v => v.id === Number(variant))

            variantValues = await db.select().from(productVariantValues).where(eq(productVariantValues.product_id, id))
            attributes = await db.query.attribute.findMany();
        }
    }


    if (!currentVariant) {
        return <div>Variant non exitent</div>
    }



    // Product Images
    const prodcutImages = await db.select().from(variantImage).where(eq(variantImage.product_id, id)).orderBy(variantImage.order);

    const formatter = new Intl.NumberFormat('en-US');

    return (
        <div className="space-y-6">
            <div className="gap-6 flex flex-col md:flex-row md:items-end">
                <Carousel className="w-full md:w-110 2xl:w-1/2">
                    <CarouselContent>
                        {prodcutImages.filter(i => i.variant_id === currentVariant!.id).map((i, index) => (
                            <CarouselItem key={i.id}>
                                <div className="w-full h-full overflow-hidden rounded aspect-square">
                                    <Image loading={index == 0 ? "eager" : "lazy"} src={`/api/uploads${i.url}`} width={600} height={600} alt={`Image ${i.id}`} className="w-full h-full object-cover" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <div className="space-y-6 lg:space-y-12  flex-1">
                    <div className="space-y-4 lg:space-y-8">
                        <div>
                            <p className="font-serif text-muted-foreground">BJLX</p>
                            <h1 className="text-2xl md:text-3xl">{currentProduct.title}</h1>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-xl md:text-2xl w-1/2 text-center">{formatter.format(Number(currentVariant.price))} D.A</p>
                            <Separator orientation="vertical" />
                            <p className="text-muted-foreground w-1/2 text-center">Réf. : {currentVariant.sku}</p>
                        </div>
                    </div>
                    {currentVariant.track_stock ?
                        currentVariant.stock! > 0 ?
                            <div className="flex items-center gap-2 text-xs text-green-600">
                                <CheckCircle/>
                                <p>En stock - délai de livraison 2-5 jours ouvrables</p>
                            </div>
                            :
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <XCircle/>
                                <p>Rupture de stock — Contactez-nous pour plus d’informations</p>
                            </div>
                        :
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <p>En stock - délai de livraison 2-5 jours ouvrables</p>
                        </div>
                    }
                    <div className="space-y-4">
                        <Button className="w-full">Ajouter au panier</Button>
                        <Button className="w-full">Acheter maintenant</Button>
                    </div>
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
