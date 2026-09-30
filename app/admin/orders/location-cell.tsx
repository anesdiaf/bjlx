"use client"
import { getCommuneWithWilaya } from "@/app/actions/shipping";
import { useEffect, useState } from "react"

export default function LocationCell({ commune_id }: { commune_id: number }) {
    const [commune, setCommune] = useState<{
        name: string | null;
        wilaya: {
            name: string | null;
        } | null;
    } | null>(null)
    useEffect(() => {
        getCommuneWithWilaya(commune_id).then(res => {
            if (res.success) {
                setCommune(res.data)
            }
        })
    }, [])
    return (
        <div className="gap-2 flex flex-col md:flex-row md:items-center">
            <p>{commune && commune.wilaya?.name}</p>
            -
            <p className="text-xs md:text-sm">{commune && commune.name}</p>
        </div>
    )
}