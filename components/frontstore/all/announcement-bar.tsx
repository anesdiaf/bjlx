"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import { useTranslations } from "next-intl";

export default function AnnouncementBar() {
    const t = useTranslations("temp");

    const phone = "06 52 79 23 68";

    const anns = [
        t("shipping"),
        t.rich("phone", {
            phone: (chunks) => (
                <span dir="ltr" className="inline-block">
                    {phone}
                </span>
            ),
        }),
    ];

    return (
        <Carousel
            orientation="vertical"
            opts={{ loop: true, align: "start" }}
            plugins={[
                Autoplay({
                    delay: 3000,
                }),
            ]}
        >
            <CarouselContent className="h-11">
                {anns.map((announcement, index) => (
                    <CarouselItem
                        key={index}
                        className="h-full flex items-center"
                    >
                        <p className="text-center w-full">
                            {announcement}
                        </p>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}