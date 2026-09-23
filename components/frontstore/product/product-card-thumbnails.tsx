"use client"

import { variantThumbnailType } from "@/src/db/schema";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ProductCardThumbnails(thumbnails: { thumbnails: variantThumbnailType[] }) {


    const [currentThumbnail, setCurrentThumbnail] = useState(0)

    return (
        <div className="aspect-square w-full group overflow-hidden"
            onMouseEnter={() => { thumbnails.thumbnails.length > 1 && setCurrentThumbnail(1) }}
            onMouseOut={() => { setCurrentThumbnail(0) }}>
            {thumbnails.thumbnails.length !== 0 && thumbnails.thumbnails[currentThumbnail].url 
            ? <Image loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" src={`/api/uploads${thumbnails.thumbnails[currentThumbnail].url}`} width={256} height={256} alt="Thumbnail" />
            : <ImageIcon/>
            }
        </div>
    )
}