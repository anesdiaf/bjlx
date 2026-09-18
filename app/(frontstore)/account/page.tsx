import TabsDashboard from "@/components/frontstore/account/tabs-dashboard";
import TabsInfoContent from "@/components/frontstore/account/tabs-info";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { db } from "@/src";
import { commune, userInfo, wilaya } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { Mail, MapPin, MapPinCheck, User } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
    title: "Mon compte"
}

export default async function AccountPage({ searchParams }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    const tab = (await searchParams).tab

    const wilayas = await db.select().from(wilaya)
    const communes = await db.select().from(commune)

    const userDataQuery = await db.select().from(userInfo).where(eq(userInfo.user_id, session?.user.id!)).limit(1)

    let userData = null;
    if (userDataQuery.length !== 0) {
        userData = userDataQuery[0]
    }

    async function handleLogout() {
        "use server"
        const response = await auth.api.signOut({
            headers: await headers()
        })

        if (response.success) {
            redirect("/")
        }
    }
    async function handleInfo() {
        "use server"
        redirect("/account?tab=info")
    }


    return (
        <div className="lg:max-w-4xl mx-auto w-full space-y-5">
            <div className="flex w-full justify-between items-center">
                <h1 className="text-2xl font-medium">Mon compte</h1>
                <form action={handleLogout}><Button type="submit" size="sm" variant="destructive">Se déconnecter</Button></form>
            </div>
            <Tabs defaultValue={tab ? tab : "dashboard"} className="w-full overflow-hidden" >
                <TabsList className="w-full mb-6" >
                    <TabsTrigger className="text-xs lg:w-fit" value="dashboard">Table de bord</TabsTrigger>
                    <TabsTrigger className="text-xs lg:w-fit" value="info">Mes informations</TabsTrigger>
                    <TabsTrigger className="text-xs lg:w-fit" value="orders">Commandes</TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard" className="space-y-8">
                    <div className="space-y-4">
                        <div className="w-full flex items-center justify-between">
                            <h3 className="text-base font-medium">Commandes récentes</h3>
                            <p>Voir plus</p>
                        </div>
                        <p>Vous n'avez pas encore passé de commande</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-full flex items-center justify-between">
                            <h3 className="text-base font-medium">Informations sur le comptes</h3>
                            <form action={handleInfo}><button type="submit">Modifier</button></form>
                        </div>
                        <div className="flex gap-3">
                            <User size={16} />
                            <p>Anes Diaf</p>
                        </div>
                        <div className="flex gap-3">
                            <Mail size={16} />
                            <p>anofofa2@gmail.com</p>
                        </div>
                        <div className="flex gap-3">
                            <MapPin size={16} />
                            <p>{userData ? wilayas.find(w => w.id == userData.wilaya_id)?.name : ""}</p>
                        </div>
                        <div className="flex gap-3">
                            <MapPinCheck size={16} />
                            <p>{userData ? communes.find(c => c.id == userData.commune_id)?.name : ""}</p>
                        </div>

                    </div>
                </TabsContent>
                <TabsContent value="info">
                    <TabsInfoContent wilayas={wilayas} communes={communes} user={session?.user!} userData={userData} />
                </TabsContent>
                <TabsContent value="orders" className="space-y-8">Change your password here.</TabsContent>
            </Tabs>
        </div>
    )
}