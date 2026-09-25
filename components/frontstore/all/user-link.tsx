import { auth } from "@/lib/auth";
import { FolderPen, LayoutDashboard, User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function UserLink() {

    
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return <Link href="/login"><User size={22} className="text-muted-foreground" /></Link>
    }

    const role = session?.user.role;
    
    return (
       <>
        {role === "admin" 
        ? (
            <div className="flex items-center gap-4">
                <Link href="/admin"><FolderPen strokeWidth={1.5} size={24} className="text-muted-foreground" /></Link>
                <Link href="/account"><User strokeWidth={1.5} size={24} className="text-muted-foreground" /></Link>
            </div>
        ) 
        : <Link href="/account"><User strokeWidth={1.5} size={24} className="text-muted-foreground" /></Link>}
       </>
    )
}