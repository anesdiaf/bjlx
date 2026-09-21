import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";

export default function HomePageCarousel() {
    const images = [
        "https://images.unsplash.com/photo-1777126413365-f4113a23eeab?q=80&w=1738&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1777126413538-87a5a5797995?q=80&w=1740&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1777126413373-7d69b5472f2a?q=80&w=1748&auto=format&fit=crop"
    ]

    return (
        <Carousel opts={{
            loop: true
        }} className="w-full">
            <CarouselContent>
                {images.map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="w-full h-full overflow-hidden aspect-video">
                            <Image loading={index === 0 ? "eager" : "lazy"} src={_} width={1600} height={900} alt={_} className="w-full h-full object-cover"/>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious/>
            <CarouselNext/>
        </Carousel>
    )
}