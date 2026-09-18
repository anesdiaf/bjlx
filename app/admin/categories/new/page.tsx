import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CreateCategoryForm from "./category-form";
import { db } from "@/src";
import { category } from "@/src/db/schema";
import { max } from "drizzle-orm";



export default async function NewCategoryAdminPage() {

    let lastOrder = 1;

    const query = await db.select({ lastOrder: max(category.order) }).from(category)

    if (query && query.length !== 0) {
        lastOrder = query[0].lastOrder! + 1;
    }

    return (
        <div className="w-full space-y-10">
            <div className="flex items-center gap-4">
                <Link href="/admin/categories">
                    <Button size="icon-lg"><ChevronLeft /></Button>
                </Link>
                <h3 className="text-2xl">Nouvelle catégorie</h3>
            </div>
            <CreateCategoryForm lastOrder={lastOrder} />
        </div >
    )
}