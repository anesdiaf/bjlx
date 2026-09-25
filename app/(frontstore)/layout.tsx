import AnnouncementBar from "@/components/frontstore/all/announcement-bar";
import CartDrawer from "@/components/frontstore/all/cart-drawer";
import UserLink from "@/components/frontstore/all/user-link";
import { CartStoreProvider } from "@/src/context/cart-store-provider";
import { Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";


export default function FrontstoreLayout({ children }: LayoutProps<"/">) {
    return (
        <CartStoreProvider>
            <div className="flex flex-col min-h-screen">
                <header className="w-full border-b">
                    <div className="flex justify-center bg-accent text-primary h-12 items-center">
                        <AnnouncementBar />
                    </div>
                    <div className="flex justify-between items-center max-w-6xl mx-auto py-5 lg:py-8 px-4 xl:px-0">
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
                <footer className="bg-accent py-6 px-4 xl:px-0 w-full">
                    <div className="max-w-6xl flex flex-col gap-6 md:flex-row justify-center md:justify-between mx-auto flex-wrap items-center">
                        <p className="font-sans">&copy; {new Date().getFullYear()} BJLX. Tous droits réservés.</p>
                        <div className="flex gap-4 items-center">
                            <p className="hidden md::block">Vous nous trouvez ici</p>
                            <a href="https://www.facebook.com/bjlxdz" className="group">
                                <svg className="size-8 mb-0.5 fill-primary group-hover:fill-primary/80 transition" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg" strokeWidth="0.00024000000000000003">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z"></path>
                                    </g>
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/bjlx_dz" className="group">
                                <svg className="size-7 fill-primary group-hover:fill-primary/80 transition" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path className="fill-primary group-hover:fill-primary/80" fillRule="evenodd" clipRule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#5b534c"></path>
                                        <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"></path>
                                        <path className="fill-primary group-hover:fill-primary/80" fillRule="evenodd" clipRule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"></path>
                                    </g>
                                </svg>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </CartStoreProvider>
    )
}