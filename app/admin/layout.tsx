export const dynamic = 'force-dynamic';

import { AppSidebar } from "@/components/admin/all/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default function AdminLayout({ children }: LayoutProps<"/admin">) {

    return (
        <div className="font-sans w-full">
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full">
                    <SidebarTrigger />
                    <div className="p-6 w-full">
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        </div>
    )
}