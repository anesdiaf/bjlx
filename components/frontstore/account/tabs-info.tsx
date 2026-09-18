"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "better-auth";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { communeType, userDataType, wilayaType } from '@/src/db/schema';
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { updateUserInfo } from "@/app/actions/user-info";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const nameSchema = z.object({
    name: z.string()
        .min(4, "Le nom doit comporter au moins 4 caractères.")
        .max(32, "Le nom ne doit pas dépasser 32 caractères."),
});


const infoSchema = z.object({
    phone: z.string()
        .length(10, "Vous devez fournir un numéro de téléphone valide.")
        .regex(/^0[567]\d{8}$/, "Vous devez fournir un numéro de téléphone valide."),
    address: z.string().max(255),
    postal: z.string().length(5),
    wilaya: z.number().nullable(),
    commune: z.number().nullable(),
});


interface infoProps {
    wilayas: wilayaType[]
    communes: communeType[]
    user: User,
    userData?: userDataType | null
}

export default function TabsInfoContent({ wilayas, communes, user, userData }: infoProps) {

    const router = useRouter()

    const [filteredCommunes, setCommunes] = useState<communeType[]>([]);
    const [selectedWilaya, setWilaya] = useState<wilayaType | null>(null);
    const [selectedCommune, setCommune] = useState<communeType | null>(null);

    const nameForm = useForm<z.infer<typeof nameSchema>>({
        resolver: zodResolver(nameSchema),
        defaultValues: {
            name: user.name,
        },
    })

    const infoForm = useForm<z.infer<typeof infoSchema>>({
        resolver: zodResolver(infoSchema),
        defaultValues: {
            phone: userData && userData.phone ? userData.phone : "",
            address: userData && userData.address ? userData.address : "",
            postal: userData && userData.postal ? userData.postal : "",
            wilaya: userData && userData.wilaya_id ? userData.wilaya_id : null,
            commune: userData && userData.commune_id ? userData.commune_id : null,
        },
    })

    async function handleNameChange(data: z.infer<typeof nameSchema>) {
        const { name } = data
        await authClient.updateUser({
            name
        })
    }

    async function handleInfoChange(data: z.infer<typeof infoSchema>) {
        console.log(data);

        const formData = new FormData();



        formData.append("userID", user.id);
        data.phone && formData.append("phone", data.phone);
        data.address && formData.append("address", data.address);
        data.postal && formData.append("postal", data.postal);
        data.wilaya && formData.append("wilaya", data.wilaya.toString());
        data.commune && formData.append("commune", data.commune.toString());


        const result = await updateUserInfo(formData)

        if (result.success) {
            window.history.replaceState(null, '', window.location.pathname);

            toast.add({
                title: "Les données ont été modifiées avec succès.",
                type: "success"
            })
        } else {

            toast.add({
                title: result.error,
                type: "error"
            })
        }

        console.log(result);
    }


    const wilaya = infoForm.watch("wilaya")
    const commune = infoForm.watch("commune")

    useEffect(() => {
        const fc = communes.filter(c => c.wilaya_id == wilaya)
        const sw = wilayas.find(w => w.id == wilaya)

        setWilaya(sw!)
        setCommunes(fc)

    }, [wilaya])

    useEffect(() => {
        const sc = communes.find(c => c.id == commune)
        setCommune(sc!)

    }, [commune])

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="w-full flex items-center justify-between">
                    <h3 className="text-base font-medium">Modifiez vos informations</h3>
                </div>
                <div>
                    <form onSubmit={nameForm.handleSubmit(handleNameChange)} className="flex flex-col gap-6">

                        <Controller
                            name="name"
                            control={nameForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="name">
                                        Nom
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Votre nom"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Button type="submit" className="self-end">Changer</Button>
                    </form>
                </div>
            </div>
            <Separator />
            <div className="space-y-4">
                <form onSubmit={infoForm.handleSubmit(handleInfoChange)} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
                        <Controller
                            name="wilaya"
                            control={infoForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="wilaya">
                                        Wilaya
                                    </FieldLabel>
                                    <Select id="wilaya" name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Wilaya">
                                                {selectedWilaya ? selectedWilaya.code + " - " + selectedWilaya.name : undefined}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent >
                                            {wilayas.map((item) => (
                                                <SelectItem key={item.code} value={item.id}>
                                                    {item.code} - {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="commune"
                            control={infoForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="commune">
                                        Commune
                                    </FieldLabel>
                                    <Select id="commune"
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Commune" >
                                                {selectedCommune ? (selectedCommune.post_code?.toString().length == 4 ? "0" + selectedCommune.post_code + " - " + selectedCommune.name : selectedCommune.post_code + " - " + selectedCommune.name) : undefined}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent aria-invalid={fieldState.invalid}>
                                            {filteredCommunes.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.post_code?.toString().length == 4 ? "0" + item.post_code : item.post_code} - {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
                        <Controller
                            name="phone"
                            control={infoForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="w-full">
                                    <FieldLabel htmlFor="phone">
                                        Téléphone
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="phone"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Votre numéro de téléphone"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="postal"
                            control={infoForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="w-full">
                                    <FieldLabel htmlFor="postal">
                                        Code postal
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="postal"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Votre code postal"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                    <Controller
                        name="address"
                        control={infoForm.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="w-full">
                                <FieldLabel htmlFor="address">
                                    Adresse
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="address"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Votre adresse"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Button type="submit" className="self-end">Changer</Button>
                </form>
            </div>
        </div>
    )
}