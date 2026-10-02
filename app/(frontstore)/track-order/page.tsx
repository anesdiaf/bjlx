export const revalidate = 60;

import DynamicIcon from "@/components/admin/all/dynamic-icon";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { db } from "@/src"
import { order } from "@/src/db/schema";
import { OrderHistoryWithStatusType } from "@/types";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function AccountPage({ searchParams }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const orderParam = (await searchParams).order

    let orderStatus: OrderHistoryWithStatusType | undefined;

    if (orderParam) {
        const orderQuery = await db.query.order.findFirst({
            columns: {
                id: true
            },
            where: {
                order_number: orderParam as string
            }
        })
        if (orderQuery) {
            orderStatus = await db.query.orderHistory.findFirst({
                with: {
                    status: true
                },
                where: {
                    order_id: orderQuery.id
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        }

    }

    const handleSubmit = async (formData: FormData) => {
        "use server"

        const order_number = formData.get("order_number") as string;
        if (order_number !== "") {
            redirect(`/track-order?order=${order_number}`)
        }

    }

    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Suivez votre commande</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-col w-full items-center space-y-6 max-w-100 mx-auto">
                {orderParam && <div className="w-full flex flex-col items-center">
                    <div className="aspect-square size-40">
                        <svg className="w-full h-full" width="256px" height="256px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ef1515">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path opacity="0.4" d="M11.9998 14H12.9998C14.0998 14 14.9998 13.1 14.9998 12V2H5.99976C4.49976 2 3.18977 2.82999 2.50977 4.04999" stroke="#6c6356" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M2 17C2 18.66 3.34 20 5 20H6C6 18.9 6.9 18 8 18C9.1 18 10 18.9 10 20H14C14 18.9 14.9 18 16 18C17.1 18 18 18.9 18 20H19C20.66 20 22 18.66 22 17V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L18.58 6.01001C18.22 5.39001 17.56 5 16.84 5H15V12C15 13.1 14.1 14 13 14H12" stroke="#6c6356" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20C6 21.1046 6.89543 22 8 22Z" stroke="#6c6356" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M16 22C17.1046 22 18 21.1046 18 20C18 18.8954 17.1046 18 16 18C14.8954 18 14 18.8954 14 20C14 21.1046 14.8954 22 16 22Z" stroke="#6c6356" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M22 12V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L22 12Z" stroke="#6c6356" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M2 8H8" stroke="#6c6356" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M2 11H6" stroke="#6c6356" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M2 14H4" stroke="#6c6356" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </g>
                        </svg>
                    </div>
                    {orderStatus ?
                        <div className="space-y-4 w-full text-center">
                            <h1>Statut de la commande</h1>

                            <div className="text-center text-sm px-3 py-1 justify-center flex items-center gap-2 w-full"
                                style={{
                                    backgroundColor: orderStatus.status?.color ? orderStatus.status?.color.replace(')', ' / 20%)') : "oklch(55.1% 0.027 264.364 / 10%)",
                                    color: orderStatus.status?.color ? orderStatus.status.color : "oklch(55.1% 0.027 264.364)"
                                }}>
                                <DynamicIcon name={orderStatus.status?.icon ?? undefined} />
                                {orderStatus.status?.title}
                            </div>
                        </div>
                        :
                        <div>
                            <p>Il n'y a pas de commande correspondant à ce numéro.</p>
                        </div>
                    }
                </div>}

                <form action={handleSubmit} className="border border-dashed space-y-3 p-2 w-full">
                    <Field>
                        <FieldLabel htmlFor="order_number">Numéro de commande</FieldLabel>
                        <Input name="order_number" type="text" placeholder="17209405584575" />
                    </Field>
                    <Button type="submit" className="w-full">Suivre la commande</Button>
                </form>
            </div>

        </div>
    )
}