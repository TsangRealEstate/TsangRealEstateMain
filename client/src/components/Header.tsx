"use client";
import Link from "next/link";


function MobileNavigation() {
    return (
        <>
            <Link href="/">Home</Link>
            <Link href="/how">How is this free?</Link>
            <Link href="#buy">Buy / Sell</Link>
            <Link href="#contact">About us</Link>
        </>
    );
}

export function Header() {
    return (
        <header className="pt-4 pb-4 bg-slate-100">
            <div className="container mx-auto px-4">
                <nav className="relative z-50 flex justify-between">
                    <div className="flex items-center md:gap-x-12">
                        <Link href="/" aria-label="Home" className="flex items-center">
                            <svg
                                viewBox="0 0 54 65"
                                className="h-14 w-auto text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                            >
                                <path d="M12.9337 31.8516V18.7526L26.8399 10.7289C31.4803 13.4035 36.1107 16.078 40.7461 18.7526V39.0381H15.8073H2.88617C2.41399 37.9621 1.93168 36.9014 1.54074 35.8C-0.0636231 31.2781 -0.413942 26.4162 0.484704 21.7419C1.4595 16.6465 3.9219 11.7896 7.86172 7.85633C13.1064 2.61877 19.9756 0 26.8399 0C33.7143 0 40.5836 2.61877 45.8181 7.85633C51.0577 13.099 53.6774 19.9657 53.6774 26.8272C53.6774 33.6939 51.0577 40.5656 45.8181 45.7981L26.8399 64.769L7.86172 45.8032C7.05955 45.0014 6.29797 44.1385 5.60242 43.2402H11.2329L26.8399 58.8463L42.8581 42.8343C47.2752 38.4189 49.4888 32.618 49.4888 26.8272C49.4888 21.0365 47.2752 15.2406 42.8581 10.8202C38.436 6.39469 32.6329 4.187 26.8399 4.187C21.0469 4.187 15.249 6.39976 10.8267 10.8151C7.49617 14.1445 5.42472 18.235 4.60222 22.5184C3.8102 26.6191 4.1656 30.8873 5.65318 34.8357H36.5524V21.1583C33.3082 19.2856 30.074 17.4179 26.8399 15.5503L17.1325 21.1583V31.8617H12.9337V31.8516Z" />
                            </svg>
                            <span className="ml-2 text-2xl font-bold text-blue-600">
                                Tsang
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-x-5 md:gap-x-8">
                        <div className="hidden md:flex md:gap-x-6">
                            <Link href="/">Home</Link>
                            <Link href="/how">How is this free?</Link>
                            <Link href="#buy">Buy / Sell</Link>
                            <Link href="#contact">About us</Link>
                        </div>
                        <Link
                            href="/apply"
                            className="inline-block rounded-md bg-blue-600 px-5 py-2.5 font-normal text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/agent"
                            className="inline-block rounded-md bg-blue-600 px-5 py-2.5 font-normal text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Agent
                        </Link>
                        <div className="-mr-1 md:hidden">
                            <MobileNavigation />
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}