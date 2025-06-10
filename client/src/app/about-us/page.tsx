import Link from 'next/link';
import React from 'react';
import {
    FaLightbulb,
    FaClock,
    FaHandshake,
    FaBuilding,
    FaHome,
    FaChartLine
} from 'react-icons/fa';
import { GiHouseKeys } from 'react-icons/gi';

const AboutPage = () => {
    return (
        <main>
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-400/10 -rotate-1 transform scale-110 rounded-b-3xl"></div>
                <div className="relative text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        About <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Tsang Real Estate</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-xl mx-auto">
                        Where exceptional service meets unicorn magic in San Antonio real estate
                    </p>
                </div>
            </section>

            {/* Content Sections */}
            <div className="max-w-7xl mt-14 mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-20">
                {/* Origin Story */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Our Origin Story</h2>
                        <p className="text-lg text-gray-600">
                            In 2021, Alexander "Alex" Tsang arrived in San Antonio with zero connections but a truckload of determination. Within months, he rocketed to <strong className="text-blue-600">#7 out of 86 agents</strong> at Texas Relocation Experts.
                        </p>
                        <p className="text-lg text-gray-600">
                            By 2022? <strong className="text-blue-600">Consistently ranked #2</strong> at the brokerage—proving that hustle beats complacency every time.
                        </p>
                        <p className="text-lg text-gray-600">
                            Frustrated by an industry plagued by lazy apartment locators who treat clients as afterthoughts, Alex built something different: <strong className="text-blue-600">a team that answers calls at midnight, thrives on challenges, and treats every client like royalty</strong>.
                        </p>
                    </div>
                    <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-xl border-4 border-white">
                        <img
                            src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGFkdmVudHVyZXxlbnwwfHx8fDE2OTY5NzQ1NTg&ixlib=rb-4.0.3&q=80&w=1080"
                            alt="Alex Tsang with team members"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-blue-400/20"></div>
                    </div>
                </section>

                {/* Why We're Different */}
                <section className="py-16 bg-gradient-to-br from-blue-50 to-white rounded-2xl px-8 shadow-inner border border-blue-100">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Why We're Different
                        </span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                title: "Problem-Solving Pizzazz",
                                content: "We don't just send templated lists—we diagnose your needs in 10-minute conversations and craft custom solutions.",
                                icon: <FaLightbulb className="w-12 h-12 text-blue-500" />,
                                bg: "bg-blue-50"
                            },
                            {
                                title: "24/7 Availability",
                                content: "Business hours? Never heard of them. We're available whenever you need us—nights, weekends, holidays.",
                                icon: <FaClock className="w-12 h-12 text-blue-500" />,
                                bg: "bg-blue-50"
                            },
                            {
                                title: "Transparent Partnerships",
                                content: "If we can't help, we'll connect you with someone who can. No smoke and mirrors—just honest guidance.",
                                icon: <FaHandshake className="w-12 h-12 text-blue-500" />,
                                bg: "bg-blue-50"
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`${item.bg} p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-100`}
                            >
                                <div className="flex justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">{item.title}</h3>
                                <p className="text-gray-600 text-center">{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Services */}
                <section className="space-y-12">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Our Services
                        </span>
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Apartment Locating", icon: <FaBuilding className="w-8 h-8 text-blue-500 mx-auto mb-4" /> },
                            { name: "Home Rentals", icon: <FaHome className="w-8 h-8 text-blue-500 mx-auto mb-4" /> },
                            { name: "Property Sales", icon: <GiHouseKeys className="w-8 h-8 text-blue-500 mx-auto mb-4" /> },
                            { name: "Investment Consulting", icon: <FaChartLine className="w-8 h-8 text-blue-500 mx-auto mb-4" /> }
                        ].map((service, index) => (
                            <div
                                key={index}
                                className="bg-white border border-blue-100 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                {service.icon}
                                <h3 className="text-xl font-medium text-gray-800">{service.name}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl text-white shadow-xl">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Real Estate Magic?</h2>
                        <p className="text-xl mb-8">
                            Get in touch today and let us sprinkle some fairy dust on your property journey!
                        </p>
                        <Link href="/apply" >
                            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-md">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default AboutPage;