"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";


const formSchema = z.object({
    email: z.email("S'il vous plaît, mettez une adresse email valide."),
    password: z.string()
        .min(6, "Le mot de passe doit comporter au moins 6 caractères.")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
});



export default function LoginForm() {

    const router = useRouter()

    const [visible, setVisible] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {

        const { data: response, error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
        })

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
        
        if (response?.user.role === "admin") {
            router.push("/admin")
        } else {
            router.push("/")
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FieldGroup>
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
            </FieldGroup>
            <Button type="submit" className="self-end">Se connecter</Button>
        </form>
    )
}