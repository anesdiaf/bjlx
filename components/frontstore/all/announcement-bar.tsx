
"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
export default function AnnouncementBar() {
    const anns = [
        "La livraison disponible 69 wilaya",
        "Appelez-nous au 07 77 81 90 08"
    ]
    return (
        <Carousel orientation="vertical"
            opts={{ loop: true, align: "start" }}
            plugins={[
                Autoplay({
                    delay: 3000,
                }),
            ]}
        >
            <CarouselContent className="h-11">
                {anns.map((_, index) => (
                    <CarouselItem key={index} className="">
                        <p className="text-center">{_}</p>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}