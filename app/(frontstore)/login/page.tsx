import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import LoginForm from "./login-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Se connecter"
}


export default async function LoginPage() {


    // Check if the user is already signed-in
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })

    if (session) {
        redirect("/")
    }

    return (
        <div className="h-full w-full flex-1 flex flex-col gap-4 justify-center items-center">
            <Card className="w-full md:w-lg">
                <CardHeader>
                    <CardTitle>Se connecter</CardTitle>
                    <CardDescription>Bon retour — connectez-vous à votre compte.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
            <div className="flex items-center gap-">
                <p>Vous n'avez pas de compte ?</p>
                <Link href="/register"><Button size="xs" variant="link"> Créer un compte</Button></Link>
            </div>
        </div>
    )
}