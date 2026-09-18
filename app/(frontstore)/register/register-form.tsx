"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


const formSchema = z.object({
    name: z.string()
        .min(4, "Le nom doit comporter au moins 4 caractères.")
        .max(32, "Le nom ne doit pas dépasser 32 caractères."),
    email: z.email("S'il vous plaît, mettez une adresse email valide."),
    password: z.string()
        .min(8, "Le mot de passe doit comporter au moins 8 caractères.")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre."),
    confirmation: z.string()
        .min(8, "Le mot de passe doit comporter au moins 8 caractères.")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
});



export default function RegisterForm() {

    const router = useRouter()

    const [visible, setVisible] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmation: ""
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        // Do something with the form values.
        console.log(data)

        const { name, email, password, confirmation } = data

        if (password !== confirmation) {
            toast.add({
                title: "Les mots de passe doivent correspondre",
                type: "warning"
            })
            return;
        }

        const { data: response, error } = await authClient.signUp.email({
            name, // required, The name of the user.
            email, // required, The email address of the user.
            password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
        });

        if (error) {
            toast.add({
                title: error.message,
                type: "error"
            })
            return;
        }

        toast.add({
            title: `Bienvenue, ${response.user.name}`,
            type: "success"
        })

        if (response.user.role === "admin") {
            router.push("/admin");
        } else {
            router.push("/")
        }

    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FieldGroup>
                <Controller
                    name="name"
                    control={form.control}
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
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email">
                                Email
                            </FieldLabel>
                            <Input
                                {...field}
                                id="email"
                                aria-invalid={fieldState.invalid}
                                placeholder="Email"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="password">
                                Mot de passe
                            </FieldLabel>
                            <div className="relative">
                                <Input
                                    {...field}
                                    id="password"
                                    aria-invalid={fieldState.invalid}
                                    type={visible ? "text" : "password"}
                                    placeholder="Mot de passe"
                                />
                                <Button size="icon-sm" variant="default" className="absolute w-10 h-10 right-0" onClick={() => setVisible(v => !v)}>{visible ? <EyeClosed size={16} /> : <Eye size={16} />} </Button>
                            </div>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="confirmation"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="confirmation">
                                Confirmation
                            </FieldLabel>
                            <Input
                                {...field}
                                id="confirmation"
                                aria-invalid={fieldState.invalid}
                                type={visible ? "text" : "password"}
                                placeholder="Confirmation"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
            <Button type="submit" className="self-end">S'inscrire</Button>
        </form>
    )
}