import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import RegisterForm from "./register-form";
import { getTranslations } from "next-intl/server";

export default async function RegisterationPage(){
    const t = await getTranslations("All")
    return(
        <div className="h-full w-full flex-1 flex flex-col gap-4 justify-center items-center">
            <Card className="w-full md:w-lg">
                <CardHeader>
                    <CardTitle>{t("register")}</CardTitle>
                    <CardDescription>{t("join_motivation")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
            </Card>
            <div className="flex items-center gap-">
                <p>{t("already_have_account")}</p>
                <Link href="/login"><Button size="xs" variant="link">{t("login")}</Button></Link>
            </div>
        </div>
    )
}