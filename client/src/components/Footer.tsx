import Link from "next/link";
import { FiChevronRight, FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

const quickLinks = [
    { title: "Home", url: "/" },
    { title: "About", url: "#" },
    { title: "FAQ", url: "#" },
    { title: "Properties", url: "#" },
];

const servicesLink = [
    { title: "Rent", url: "#" },
    { title: "Buy", url: "#" },
    { title: "Sell", url: "#" },
    { title: "Tour", url: "#" },
    { title: "Submit request", url: "#" },
];

const socialLinks = [
    { icon: "instagram", url: "https://www.instagram.com" },
    { icon: "facebook", url: "https://www.facebook.com" },
    { icon: "linkedin", url: "https://www.linkedin.com" },
    { icon: "twitter", url: "https://twitter.com" },
];

export function Footer() {
    return (
        <footer className="relative bg-slate-900 dark:bg-slate-800">
            <div className="container relative mx-auto max-w-7xl">
                <div className="grid grid-cols-1">
                    <div className="relative py-16">
                        <div className="relative w-full">
                            <div className="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
                                <div className="lg:col-span-4 md:col-span-12 flex flex-col px-2 md:px-0 items-center md:items-start">
                                    <Link
                                        href="/"
                                        aria-label="Home"
                                        className="flex items-center"
                                    >
                                        <svg
                                            viewBox="0 0 54 65"
                                            className="h-14 w-auto text-blue-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                        >
                                            <path d="M12.9337 31.8516V18.7526L26.8399 10.7289C31.4803 13.4035 36.1107 16.078 40.7461 18.7526V39.0381H15.8073H2.88617C2.41399 37.9621 1.93168 36.9014 1.54074 35.8C-0.0636231 31.2781 -0.413942 26.4162 0.484704 21.7419C1.4595 16.6465 3.9219 11.7896 7.86172 7.85633C13.1064 2.61877 19.9756 0 26.8399 0C33.7143 0 40.5836 2.61877 45.8181 7.85633C51.0577 13.099 53.6774 19.9657 53.6774 26.8272C53.6774 33.6939 51.0577 40.5656 45.8181 45.7981L26.8399 64.769L7.86172 45.8032C7.05955 45.0014 6.29797 44.1385 5.60242 43.2402H11.2329L26.8399 58.8463L42.8581 42.8343C47.2752 38.4189 49.4888 32.618 49.4888 26.8272C49.4888 21.0365 47.2752 15.2406 42.8581 10.8202C38.436 6.39469 32.6329 4.187 26.8399 4.187C21.0469 4.187 15.249 6.39976 10.8267 10.8151C7.49617 14.1445 5.42472 18.235 4.60222 22.5184C3.8102 26.6191 4.1656 30.8873 5.65318 34.8357H36.5524V21.1583C33.3082 19.2856 30.074 17.4179 26.8399 15.5503L17.1325 21.1583V31.8617H12.9337V31.8516Z" />
                                        </svg>
                                        <span className="ml-2 text-2xl font-bold text-slate-100">
                                            Tsang
                                        </span>
                                    </Link>
                                    <p className="mt-6 text-gray-300 text-center md:text-left">
                                        Lorem Ipsum is simply dummy text of the printing and
                                        typesetting industry. Lorem Ipsum has been the
                                        industry&apos;s standard dummy text ever since the 1500s
                                    </p>

                                    <ul className="flex mt-4">
                                        {socialLinks.map((socialLink, index) => (
                                            <li key={index} className="mr-4">
                                                <a
                                                    href={socialLink.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-full bg-blue-600 inline-block p-2 text-slate-100 hover:bg-slate-100 hover:text-blue-600"
                                                >
                                                    {socialLink.icon === "instagram" && (
                                                        <FaInstagram className="w-5 h-5" />
                                                    )}
                                                    {socialLink.icon === "facebook" && (
                                                        <FaFacebook className="w-5 h-5" />
                                                    )}
                                                    {socialLink.icon === "linkedin" && (
                                                        <FaLinkedin className="w-5 h-5" />
                                                    )}
                                                    {socialLink.icon === "twitter" && (
                                                        <FaTwitter className="w-5 h-5" />
                                                    )}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="lg:col-span-2 md:col-span-6">
                                    <h5 className="tracking-[1px] text-gray-100 font-semibold">
                                        Quick Links
                                    </h5>
                                    <ul className="list-none footer-list mt-6">
                                        {quickLinks.map((link, index) => (
                                            <li key={index} className="mb-3">
                                                <a
                                                    href={link.url}
                                                    className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out flex items-center"
                                                >
                                                    <FiChevronRight className="w-5 h-5 text-blue-600 me-3" />
                                                    {link.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="lg:col-span-3 md:col-span-6">
                                    <h5 className="tracking-[1px] text-gray-100 font-semibold">
                                        Services
                                    </h5>
                                    <ul className="list-none footer-list mt-6">
                                        {servicesLink.map((service, index) => (
                                            <li key={index} className="mb-3">
                                                <a
                                                    href={service.url}
                                                    className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out flex items-center"
                                                >
                                                    <FiChevronRight className="w-5 h-5 text-blue-600 me-3" />
                                                    {service.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="lg:col-span-3 md:col-span-4">
                                    <h5 className="tracking-[1px] text-gray-100 font-semibold">
                                        Contact
                                    </h5>

                                    <div className="flex mt-6">
                                        <FiMapPin className="w-5 h-5 text-blue-600 me-3" />
                                        <div>
                                            <h6 className="text-gray-300 mb-2">
                                                C/54 Northwest Freeway, <br /> Suite 558, <br />
                                                Houston, USA 485
                                            </h6>
                                        </div>
                                    </div>

                                    <div className="flex mt-6">
                                        <FiMail className="w-5 h-5 text-blue-600 me-3" />
                                        <div>
                                            <a
                                                href="mailto:contact@example.com"
                                                className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out"
                                            >
                                                contact@example.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex mt-6">
                                        <FiPhone className="w-5 h-5 text-blue-600 me-3" />
                                        <div>
                                            <a
                                                href="tel:+152534-468-854"
                                                className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out"
                                            >
                                                +152 534-468-854
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-6 px-0 border-t border-gray-800 dark:border-gray-700">
                <div className="container relative text-center mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 items-center gap-6">
                        <div className="md:text-start text-center">
                            <p className="mb-0 text-gray-300">
                                © Copyright Tsang {new Date().getFullYear()} All Right Reserved.
                            </p>
                        </div>

                        <ul className="list-none md:text-end text-center text-slate-300 text-sm">
                            <li className="inline">
                                <a href="#" className="hover:text-slate-50">
                                    Terms Of Use
                                </a>
                            </li>
                            <li className="inline mx-2"> | </li>
                            <li className="inline">
                                <a href="#" className="hover:text-slate-50">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}