import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { AdIcon, Bolt, Box, GalleryHorizontal, Home, LinkIcon, LogOutIcon, LucideHash, SquareDashed, TagIcon, UserCheck2, UserIcon } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export function AppSidebar() {

    async function handleLogout() {

        "use server"
        const response = await auth.api.signOut({
            headers: await headers()
        })
        if (response.success) {
            redirect("/")
        }
    }
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuButton className="flex justify-center" render={<a href="/admin" />}>
                    <p className="text-2xl font-serif">BJLX</p>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Liens rapides</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenuButton render={<Link href="/admin" />} >
                            <SquareDashed />
                            <span>Table de bord</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton render={<Link href="/" />} >
                            <Home />
                            <span>Magasin</span>
                        </SidebarMenuButton>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Catalogue</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenuButton render={<Link href="/admin/products" />} >
                            <Box />
                            <span>Produits</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton render={<Link href="/admin/categories" />} >
                            <LinkIcon />
                            <span>Catégories</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton render={<Link href="/admin/attributes" />} >
                            <LucideHash />
                            <span>Attributes</span>
                        </SidebarMenuButton>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Ventes</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenuButton render={<Link href="/admin/products" />} >
                            <Box />
                            <span>Commandes</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton render={<Link href="/admin/customers" />} >
                            <UserIcon />
                            <span>Clients</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton render={<Link href="/admin/admins" />} >
                            <UserCheck2 />
                            <span>Admins</span>
                        </SidebarMenuButton>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Marketing</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenuButton render={<Link href="/admin/carousels" />} >
                            <GalleryHorizontal />
                            <span>Carousels</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton render={<Link href="/admin/announcments" />} >
                            <AdIcon />
                            <span>Announcments</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton render={<Link href="/admin/collections" />} >
                            <TagIcon />
                            <span>Collections</span>
                        </SidebarMenuButton>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenuButton render={<Link href="/admin/settings" />} >
                    <Bolt />
                    <span>Settings</span>
                </SidebarMenuButton>
                <form action={handleLogout}>
                    <SidebarMenuButton type="submit" className="bg-red-500 text-white hover:text-white hover:bg-red-600/90">
                        <LogOutIcon />
                        <span>Se déconnecter</span>
                    </SidebarMenuButton>
                </form>
            </SidebarFooter>
        </Sidebar>
    )
}