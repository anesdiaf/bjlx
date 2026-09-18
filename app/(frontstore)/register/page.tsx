import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import RegisterForm from "./register-form";

export default function RegisterationPage(){
    return(
        <div className="h-full w-full flex-1 flex flex-col gap-4 justify-center items-center">
            <Card className="w-full md:w-lg">
                <CardHeader>
                    <CardTitle>Créer un compte</CardTitle>
                    <CardDescription>Rejoignez-nous pour des offres exclusives et le suivi des commandes</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
            </Card>
            <div className="flex items-center gap-">
                <p>Vous avez déjà un compte ?</p>
                <Link href="/login"><Button size="xs" variant="link"> Se connecter</Button></Link>
            </div>
        </div>
    )
}