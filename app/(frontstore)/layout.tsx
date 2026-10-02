import AnnouncementBar from "@/components/frontstore/all/announcement-bar";
import CartDrawer from "@/components/frontstore/all/cart-drawer";
import Footer from "@/components/frontstore/all/footer";
import LanguageChanger from "@/components/frontstore/all/language-changer";
import UserLink from "@/components/frontstore/all/user-link";
import { CartStoreProvider } from "@/src/context/cart-store-provider";
import { Search, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";


export default function FrontstoreLayout({ children }: LayoutProps<"/">) {
    return (
        <CartStoreProvider>
            <div className="flex flex-col min-h-screen">
                <header className="w-full border-b">
                    <div className="flex justify-center bg-accent text-primary h-12 items-center">
                        <AnnouncementBar />
                        <LanguageChanger />
                    </div>
                    <div className="flex justify-between items-center max-w-6xl mx-auto py-3 lg:py-4 px-4 xl:px-0">
                        <Link href="/" className="text-3xl font-serif">BJLX</Link>
                        <div className="flex items-center gap-4">
                            <Search strokeWidth={1.5} size={24} className="text-muted-foreground" />
                            <Suspense fallback={<User strokeWidth={1.5} size={24} className="text-muted-foreground" />}>
                                <UserLink />
                            </Suspense>
                            <CartDrawer />
                        </div>
                    </div>
                </header>
                <div className="w-full flex-1 h-full max-w-6xl mx-auto flex flex-col px-4 pt-6 pb-8 xl:px-0">
                    {children}
                </div>
                <Footer/>
            </div>
        </CartStoreProvider>
    )
}