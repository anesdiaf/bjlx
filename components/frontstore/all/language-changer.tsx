"use client"

import { changeLocaleAction } from "@/app/actions/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "next-intl";
import { useState } from "react";

export default function LanguageChanger() {

    const locale = useLocale()

    const [locales] = useState([
        { title: "Francais", value: "fr" },
        { title: "العربية", value: "ar" }
    ])

    const handleLanguageChange = async (locale: string|null) => {
        if(locale){
            await changeLocaleAction(locale)
        }
    }

    return (
        <div className="absolute max-w-6xl w-full mx-auto top-0">

            <Select defaultValue={locale}  onValueChange={v => handleLanguageChange(v)}>
                <SelectTrigger className="w-24 absolute right-0 top-0">
                    <SelectValue placeholder="Language" >{locales.find(l => l.value === locale)?.title}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {locales.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

        </div>
    )
}