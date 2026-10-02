"use client"

import { changeLocaleAction } from "@/app/actions/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "next-intl";
import { useState } from "react";

export default function LanguageChanger() {

    const locale = useLocale()

    const [locales] = useState([
        { title: "العربية", value: "ar" },
        { title: "Francais", value: "fr" }
        
    ])

    const handleLanguageChange = async (locale: string | null) => {
        if (locale) {
            await changeLocaleAction(locale)
        }
    }

    return (


        <Select value={locale} onValueChange={v => handleLanguageChange(v)}>
            <SelectTrigger className="w-10">
                <SelectValue placeholder="Language" className="capitalize">{locales.find(l => l.value === locale)?.value}</SelectValue>
            </SelectTrigger>
            <SelectContent>
                {locales.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                        {item.title}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>


    )
}