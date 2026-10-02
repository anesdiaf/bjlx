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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";





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
        redirect("/")
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
            if (v.values && v.values.length !== 0) {
                const values = v.values[0].values;
                if (values && Object.keys(values).length !== 0) {
                    Object.keys(values).forEach(key => {
                        if (!currentValues[Number(key)]) {
                            currentValues[Number(key)] = []
                        }
                        currentValues[Number(key)].push(values[Number(key)])
                    })
                }
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

    type AccordionItem = {
        value: string;
        trigger: string;
        content: ReactNode;
    };


    const pft = await getTranslations("ProductInfo");

    const accordionItems: AccordionItem[] = [
        {
            value: "livraison",
            trigger: pft("shipping.title"),
            content: (
                <div className="space-y-3">
                    <p>{pft("shipping.description")}</p>

                    <ul className="list-disc space-y-1 pl-5">
                        <li>{pft("shipping.items.fast")}</li>
                        <li>{pft("shipping.items.cod")}</li>
                        <li>{pft("shipping.items.fees")}</li>
                    </ul>
                </div>
            ),
        },
        {
            value: "paiement",
            trigger: pft("payment.title"),
            content: (
                <p>{pft("payment.description")}</p>
            ),
        },
        {
            value: "retour",
            trigger: pft("returns.title"),
            content: (
                <div className="space-y-3">
                    <p>{pft("returns.defect")}</p>

                    <p>{pft("returns.deadline")}</p>

                    <p>{pft("returns.packaging")}</p>
                </div>
            ),
        },
        {
            value: "entretien",
            trigger: pft("care.title"),
            content: (
                <div className="space-y-3">
                    <p>{pft("care.description")}</p>

                    <ul className="list-disc space-y-1 pl-5">
                        <li>{pft("care.items.water")}</li>
                        <li>{pft("care.items.perfume")}</li>
                        <li>{pft("care.items.storage")}</li>
                        <li>{pft("care.items.cleaning")}</li>
                    </ul>
                </div>
            ),
        },
    ];



    const t = await getTranslations("All")

    return (
        <div className="space-y-6">
            <div className="gap-6 flex flex-col md:flex-row md:items-stretch">
                <div className="w-full md:w-110 2xl:w-1/2 flex flex-col gap-5">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/catalog">{t("catalog")}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{currentProduct.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <Carousel dir="ltr" className="w-full" opts={{ loop: true }}>
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

                <div className="space-y-8 flex-1 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div>
                            <p className="font-serif text-muted-foreground">BJLX</p>
                            <h1 className="text-xl md:text-2xl">{currentProduct.title}</h1>
                        </div>
                        <div className="flex items-center">
                            {currentVariant.on_promo ?
                                <div className=" flex items-end justify-center gap-3 text-xl text-center">
                                    <p className="font-medium">{formatNumbers(currentVariant.promo_price!, "DZ-dz")} D.A</p>
                                    <p className="text-muted-foreground text-sm line-through">{formatNumbers(currentVariant.price, "DZ-dz")} {t("currency_symbol")}</p>
                                </div>
                                :
                                <p className="font-medium text-xl md:text-2xl text-center">{formatNumbers(currentVariant.price, "DZ-dz")} {t("currency_symbol")}</p>
                            }

                            <Separator orientation="vertical" className="mx-4" />
                            <p className="text-muted-foregroundtext-center">{t("ref")} : {currentVariant.sku}</p>
                        </div>
                    </div>
                    <Accordion className="border-dashed border">
                        {accordionItems.map(item => (
                            <AccordionItem key={item.value} value={item.value} className="border-b px-4 last:border-b-0">
                                <AccordionTrigger>{item.trigger}</AccordionTrigger>
                                <AccordionContent>
                                    {item.content}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    {currentVariant.track_stock ?
                        currentVariant.stock! > 0 ?
                            <div className="flex items-center gap-2 text-xs text-green-600">
                                <CheckCircle size={20} />
                                <p>{t("available_desc")}</p>
                            </div>
                            :
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <XCircle size={20} />
                                <p>{t("inavailable_desc")}</p>
                            </div>
                        :
                        <div className="flex items-center gap-2 text-xs text-green-600">
                            <CheckCircle size={20} />
                            <p>{t("available_desc")}</p>
                        </div>
                    }
                    <OrderForm userInfo={currentUserInfo} attributes={attributes!} currentProduct={currentProduct} variant_id={Number(variant)} currentVariant={currentVariant} currentValues={currentValues} />
                </div>
            </div>
            <div className="space-y-8">
                <div className="space-y-4 bg-accent p-5">
                    <h1 className="text-lg font-medium">{t("description")}</h1>
                    <Separator />
                    <p className="font-sans">{currentProduct.desc}</p>
                </div>
                <div>
                    <h1 className="text-lg font-medium">{t("like_also")}</h1>
                </div>
            </div>
        </div>

    )

}
