export const revalidate = 60;

import { getAttributes } from "@/app/actions/attributes";
import { getProduct, getProductDetailed } from "@/app/actions/products";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import OrderForm from "./order-form";
import { productValues } from "@/types";
import { formatNumbers } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/src";
import { userDataType, userInfo } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";





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
    const { data: attributes } = await getAttributes();

    let currentValues: productValues = {};

    if (variants.length > 1) {
        variants.map(v => {
            const values = v.values[0].values;
            if (values) {
                Object.keys(values).forEach(key => {
                    if (!currentValues[Number(key)]) {
                        currentValues[Number(key)] = []
                    }
                    currentValues[Number(key)].push(values[Number(key)])
                })
            }
        })
    }
    // Variant Images
    const prodcutImages = currentVariant.images


    const session = await auth.api.getSession({
        headers: await headers()
    })

    const user = session?.user;
    let currentUserInfo;
    if (user) {
        currentUserInfo = await db.query.userInfo.findFirst({
            where: {
                user_id: user?.id
            },
            with: {
                user: true
            }
        })
    }




    return (
        <div className="space-y-6">
            <div className="gap-6 flex flex-col md:flex-row md:items-end">
                <div className="w-full md:w-110 2xl:w-1/2 flex flex-col gap-5">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/catalog">Catalog</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{currentProduct.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <Carousel className="w-full">
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
                </div>

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
                    <OrderForm userInfo={currentUserInfo} attributes={attributes!} currentProduct={currentProduct} variant_id={Number(variant)} currentVariant={currentVariant} currentValues={currentValues} />
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
