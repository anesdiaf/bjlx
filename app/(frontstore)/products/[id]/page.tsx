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

    const accordionItems: AccordionItem[] = [
        {
            value: "livraison",
            trigger: "Livraison",
            content: (
                <div className="space-y-3">
                    <p>Livraison à travers les 69 wilayas d'Algérie.</p>

                    <ul className="list-disc space-y-1 pl-5">
                        <li>Livraison rapide et fiable</li>
                        <li>Paiement à la livraison</li>
                        <li>Frais de livraison calculés selon votre wilaya</li>
                    </ul>
                </div>
            ),
        },
        {
            value: "paiement",
            trigger: "Paiement",
            content: (
                <p>
                    Payez votre commande directement à la réception.
                    Aucun paiement en ligne n'est nécessaire.
                </p>
            ),
        },
        {
            value: "retour",
            trigger: "Retours & échanges",
            content: (
                <div className="space-y-3">
                    <p>
                        Les retours sont acceptés uniquement en cas de défaut
                        du produit.
                    </p>

                    <p>
                        Toute demande de retour doit être effectuée dans les
                        36 heures suivant la réception de la commande.
                    </p>

                    <p>
                        Le produit doit être retourné avec son emballage et sa
                        couverture d'origine en bon état.
                    </p>
                </div>
            ),
        },
        {
            value: "entretien",
            trigger: "Entretien",
            content: (
                <div className="space-y-3">
                    <p>Pour préserver l'éclat de votre bijou :</p>

                    <ul className="list-disc space-y-1 pl-5">
                        <li>Évitez le contact prolongé avec l'eau.</li>
                        <li>Évitez les parfums et produits chimiques.</li>
                        <li>Rangez votre bijou dans son écrin après utilisation.</li>
                        <li>
                            Nettoyez délicatement avec un chiffon doux.
                        </li>
                    </ul>
                </div>
            ),
        },
    ];


    return (
        <div className="space-y-6">
            <div className="gap-6 flex flex-col md:flex-row md:items-stretch">
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

                <div className="space-y-8 flex-1 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div>
                            <p className="font-serif text-muted-foreground">BJLX</p>
                            <h1 className="text-xl md:text-2xl">{currentProduct.title}</h1>
                        </div>
                        <div className="flex items-center">
                            {currentVariant.on_promo ?
                                <div className=" flex items-end justify-center gap-3 text-xl text-center pr-6">
                                    <p className="font-medium">{formatNumbers(currentVariant.promo_price!, "DZ-dz")} D.A</p>
                                    <p className="text-muted-foreground text-sm line-through">{formatNumbers(currentVariant.price, "DZ-dz")} D.A</p>
                                </div>
                                :
                                <p className="font-medium text-xl md:text-2xl text-center pr-6">{formatNumbers(currentVariant.price, "DZ-dz")} D.A</p>
                            }

                            <Separator orientation="vertical" />
                            <p className="text-muted-foreground px-6 text-center">Réf.: {currentVariant.sku}</p>
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
                                <p>En stock - délai de livraison 2-5 jours ouvrables</p>
                            </div>
                            :
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <XCircle size={20} />
                                <p>Rupture de stock — Contactez-nous pour plus d&apos;informations</p>
                            </div>
                        :
                        <div className="flex items-center gap-2 text-xs text-green-600">
                            <CheckCircle size={20} />
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
