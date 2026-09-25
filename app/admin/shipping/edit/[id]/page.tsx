import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/src";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import EditProviderForm from "@/app/admin/shipping/edit/[id]/edit-provider-form";
import ShippingZoneForm from "./shipping-zone-form";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter, formatNumbers } from "@/lib/utils";
import EditShppingZoneForm from "./edit-shipping-zone-form";
import DeleteShippingZoneButton from "./delete-shipping-zone-button";

export default async function EditProductAdminPage({
    params,
}: {
    params: Promise<{ id: number }>
}) {

    const id = (await params).id;

    const shippingProvider = await db.query.shippingProvider.findFirst({
        where: {
            id
        },
        with: {
            zones: true
        }
    })

    if (!shippingProvider) {
        return <div>Provider not found</div>
    }

    const wilayas = await db.query.wilaya.findMany({
        with: {
            communes: true
        }
    })

    const { zones } = shippingProvider;

    return (
        <div className="w-full space-y-10">
            <div className="flex items-center gap-4">
                <Link href="/admin/shipping">
                    <Button size="icon-lg"><ChevronLeft /></Button>
                </Link>
                <h3 className="text-2xl">Modification de <span className="text-muted-foreground">{shippingProvider?.title}</span></h3>
            </div>
            <div className="w-full flex flex-col xl:flex-row gap-6 items-start">
                <Card className="w-full xl:w-1/3 xl:min-w-120">
                    <CardHeader className="w-full flex justify-between items-center">
                        <CardTitle>Informations</CardTitle>
                        <EditProviderForm shippingProvider={shippingProvider} />
                    </CardHeader>
                    <CardContent>
                        <div className="w-full">
                            <div className="w-full flex items-center justify-between border-b border-dashed py-2 hover:bg-accent transition px-1">
                                <p>Titre</p>
                                <p>{shippingProvider.title}</p>
                            </div>
                            <div className="w-full flex items-center justify-between border-b border-dashed py-2 hover:bg-accent transition px-1">
                                <p>Téléphone</p>
                                <p>{shippingProvider.phone}</p>
                            </div>
                            <div className="w-full flex items-center justify-between border-b border-dashed py-2 hover:bg-accent transition px-1">
                                <p>Wilaya</p>
                                <p>{wilayas.find(w => w.id === shippingProvider.wilaya_id)?.name}</p>
                            </div>
                            <div className="w-full flex items-center justify-between border-b border-dashed py-2 hover:bg-accent transition px-1">
                                <p>Commune</p>
                                <p>{wilayas.find(w => w.id === shippingProvider.wilaya_id)?.communes.find(c => c.id === shippingProvider.commune_id)?.name}</p>
                            </div>
                            <div className="w-full flex items-center justify-between border-b border-dashed py-2 hover:bg-accent transition px-1">
                                <p>Code postal</p>
                                <p>{shippingProvider.postal}</p>
                            </div>
                            <div className="w-full flex items-center justify-between py-2 hover:bg-accent transition px-1">
                                <p>Adresse</p>
                                <p>{shippingProvider.address}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader className="w-full flex justify-between items-center">
                        <CardTitle>Zones d'expédition</CardTitle>
                        <ShippingZoneForm id={shippingProvider.id} />
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableCaption>{zones.length === 0 && "Aucun prestataire d'expédition n'a encore été ajouté."}</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">#</TableHead>
                                    <TableHead>Wilaya</TableHead>
                                    <TableHead>Commune</TableHead>
                                    <TableHead>Prix</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            {zones.length == 0 && (<TableBody></TableBody>)}
                            {zones.length !== 0 && (
                                <TableBody>
                                    {zones.map((z, index) => {
                                        const wilaya = wilayas.find(w => w.id === z.wilaya_id);
                                        const commune = wilaya?.communes.find(c => c.id === z.commune_id)
                                        return (
                                            <TableRow key={z.id}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell>{wilaya?.name}</TableCell>
                                                <TableCell>{commune?.name} - {commune?.post_code?.toString().length == 4 ? "0"+commune?.post_code :commune?.post_code}</TableCell>
                                                <TableCell>{formatNumbers(z.price, "dz")} D.A</TableCell>
                                                <TableCell>{capitalizeFirstLetter(z.type!) === "Office" ? "Bureau": "À domicile"}</TableCell>
                                                <TableCell>{z.status ? <Badge className="bg-green-400/20 text-green-700">Active</Badge> : <Badge variant="destructive">Inactive</Badge>}</TableCell>
                                                <TableCell className="text-right space-x-3.5 flex justify-center items-center">
                                                    <EditShppingZoneForm zone={z}/>
                                                    <DeleteShippingZoneButton id={z.id}  provider_id={z.provider_id!}/>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            )}
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}