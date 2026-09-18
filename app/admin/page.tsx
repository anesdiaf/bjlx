import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";



export default function DashboardPage() {

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
        <div>
            Admin
            <form action={handleLogout}><Button type="submit" variant="destructive">Logout</Button></form>
        </div>
    )
}