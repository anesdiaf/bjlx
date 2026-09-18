import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CreateProductForm from "./product-form";
import { db } from "@/src";
import { category } from "@/src/db/schema";

export default async function NewProductAdminPage() {


    const categories = await db.select().from(category);


    return (
        <div className="w-full space-y-10">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button size="icon-lg"><ChevronLeft /></Button>
                </Link>
                <h3 className="text-2xl">Nouveau produit</h3>
            </div>
            <CreateProductForm categories={categories}/>
        </div >
    )
}