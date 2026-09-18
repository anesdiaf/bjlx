import AnnouncementBar from "@/components/frontstore/all/announcement-bar";
import UserLink from "@/components/frontstore/all/user-link";
import { Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";


export default function FrontstoreLayout({ children }: LayoutProps<"/">) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="w-full">
                <div className="flex justify-center bg-[#5b534c] text-white h-12 items-center">
                    <AnnouncementBar />
                </div>
                <div className="flex justify-between items-center max-w-6xl mx-auto py-5 lg:py-8 px-4 xl:px-0">
                    <Link href="/" className="text-2xl">BJLX</Link>
                    <div className="flex items-center gap-6">
                        <Search size={22} className="text-muted-foreground" />
                        <Suspense fallback={<User size={22} className="text-muted-foreground" />}>
                            <UserLink />
                        </Suspense>

                        <ShoppingBag size={22} className="text-muted-foreground" />
                    </div>
                </div>
            </header>
            <div className="w-full flex-1 h-full max-w-6xl mx-auto flex flex-col px-4 pb-8 xl:px-0">
                {children}
            </div>
            <footer className="bg-accent py-6 px-4 xl:px-0 w-full">
                <div className="max-w-6xl flex justify-between mx-auto">
                    <p>Made with love by Anes Diaf</p>
                    <p>
                        Socials
                    </p>
                </div>

            </footer>
        </div>
    )
}