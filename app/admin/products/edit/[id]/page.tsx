import { Button } from "@/components/ui/button";
import { db } from "@/src"
import { CheckIcon, ChevronLeft, PlusIcon } from "lucide-react";
import Link from "next/link";
import EditProductForm from "./product-form";
import { category, productVariant, productVariantValues, variantImage, variantThumbnail } from "@/src/db/schema";
import { eq} from "drizzle-orm";
import CreateVariantForm from "./variant-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DeleteVariantButton from "@/components/admin/products/delete-variant-button";
import SetAttributesForm from "./attributes-form";
import EditVariantForm from "./edit-variant-form";
import ProductImagesForm from "./images-form";


export default async function EditProductAdminPage({
    params,
}: {
    params: Promise<{ id: number }>
}) {

    const id = (await params).id;

    let currentProduct = await db.query.product.findFirst({
        where: { id }
    });


    if (!currentProduct) {
        return <p>Product not found</p>
    }

    const categories = await db.select().from(category);

    const attributes = await db.query.attribute.findMany({
        with: {
            values: true
        }
    })

    // Product Variants
    const variants = await db.select().from(productVariant).where(eq(productVariant.product_id, id))
    // productVariantValues (to check if product has attributes)
    const variantValues = await db.select().from(productVariantValues).where(eq(productVariantValues.product_id, id))


    // Product Images
    const prodcutImages = await db.select().from(variantImage).where(eq(variantImage.product_id, id));
    // Prodcut Thumbnails
    const prodcutThumbnails = await db.select().from(variantThumbnail).where(eq(variantThumbnail.product_id, id));

    return (
        <div className="w-full space-y-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <Button size="icon-lg"><ChevronLeft /></Button>
                    </Link>
                    <h3 className="text-2xl">Modifier le produit #{currentProduct.id}</h3>
                </div>
                <Link href="/admin/products/new">
                    <Button className="hidden md:block">Nouveau produit</Button>
                    <Button className="md:hidden"><PlusIcon /></Button>
                </Link>
            </div>
            <div className="space-y-6">
                <EditProductForm categories={categories} currentProduct={currentProduct} />
                <Card className="w-full">
                    <CardHeader className="flex justify-between">
                        <CardTitle>Variantes de produit</CardTitle>
                        <CreateVariantForm id={id} />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <Table>
                            <TableCaption>{variants.length === 0 && "Aucune variante n'a encore été ajoutée."}</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">#</TableHead>
                                    <TableHead className="w-30">Réf.</TableHead>
                                    <TableHead>Prix</TableHead>
                                    <TableHead>Prix D'achat</TableHead>
                                    <TableHead>Promo</TableHead>
                                    <TableHead>Default</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            {variants.length == 0 && (<TableBody></TableBody>)}
                            {variants.length !== 0 && (
                                <TableBody>
                                    {variants.map((v, index) => (
                                        <TableRow key={v.id}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell><Link href={`/admin/products/edit/${v.id}`}>{v.sku}</Link></TableCell>
                                            <TableCell>{v.price} D.A <Badge variant="outline">({Number(v.price) - Number(v.buy_price)} D.A)</Badge></TableCell>
                                            <TableCell>{v.buy_price} D.A</TableCell>
                                            <TableCell>
                                                {v.on_promo ? v.promo_price + " D.A" : ""}
                                            </TableCell>
                                            <TableCell>{v.default && <CheckIcon size={16} />}</TableCell>
                                            <TableCell>{v.status ? <Badge className="bg-green-400/20 text-green-700">Active</Badge> : <Badge variant="destructive">Inactive</Badge>}</TableCell>
                                            <TableCell className="text-right space-x-2 flex justify-center items-center">
                                                <SetAttributesForm variantValues={variantValues.find(va => va.variant_id === v.id)} attributes={attributes} id={v.id} productId={id} />
                                                <ProductImagesForm id={v.id} productId={id} prodcutImages={prodcutImages} productThumbnails={prodcutThumbnails}/>
                                                <EditVariantForm id={v.id}/>
                                                <DeleteVariantButton id={v.id} productId={id} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            )}
                        </Table>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}