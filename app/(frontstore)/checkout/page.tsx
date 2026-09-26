import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CheckoutForm from "./checkout-form";
import Link from "next/link";
import { headers } from "next/headers";
import { db } from "@/src";
import { auth } from "@/lib/auth";

export default async function CheckoutPage() {

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
        <div className="space-y-6 h-full flex-1 flex flex-col">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink  href="/">Accueil</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Link href="/cart">Panier</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Finaliser la commande</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CheckoutForm userInfo={currentUserInfo}/>
        </div>
    )
}