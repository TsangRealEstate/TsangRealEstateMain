import Link from 'next/link';
import React from 'react';
import { FaQuestionCircle, FaMoneyBillWave, FaSearch, FaClipboardCheck, FaTruckMoving } from 'react-icons/fa';
import { GiHouseKeys } from 'react-icons/gi';


const HowIsThisFreePage = () => {
    return (
        <main>
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-400/10 -rotate-1 transform scale-110 rounded-b-3xl"></div>
                <div className="relative text-center my">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            How Our Service Is Free
                        </span>
                    </h1>

                    <div className="bg-white inline-block px-6 py-3 rounded-full shadow-md mb-6">
                        <p className="text-xl md:text-2xl font-semibold text-gray-700 flex items-center justify-center gap-3">
                            <FaQuestionCircle className="text-blue-500 w-6 h-6" />
                            No Hidden Costs • No Compromises
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto bg-white/80 p-6 rounded-lg shadow-sm border border-blue-100">
                        <p className="text-xl text-gray-700">
                            <span className="font-bold text-blue-600">Here's the simple truth:</span> Property owners pay us from their
                            marketing budget when we bring qualified tenants. You get the <strong>exact same rates and specials</strong>
                            as if you walked in directly, plus the benefit of our expertise.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16 mt-14">
                {/* How It Works Section */}
                <section className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
                    <div className="p-8 md:p-12 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                            <GiHouseKeys className="w-8 h-8" /> How We Work
                        </h2>
                        <p className="text-xl">
                            All our agents are licensed real estate agents with the Texas Relocation Expert brokerage.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                                    <FaMoneyBillWave className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Marketing Budget Pays Us</h3>
                                    <p className="text-gray-600">
                                        Most apartment complexes have a marketing budget that covers our referral fee when we bring a tenant.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                                    <FaSearch className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">No Cost to You</h3>
                                    <p className="text-gray-600">
                                        Your rents, specials, pricing, and availability <strong>do not change</strong> because you use our services.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                                    <FaClipboardCheck className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">How You Help</h3>
                                    <p className="text-gray-600">
                                        Put your agent's name in the referral section of the application and tell the property you're working with us.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                                    <FaTruckMoving className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Bonus: Free Movers</h3>
                                    <p className="text-gray-600">
                                        Some properties qualify for <strong>2 hours of free movers</strong> that we cover for you!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Referral Instructions */}
                <section className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 md:p-12 shadow-inner border border-blue-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            How To List Us As Your Agent
                        </span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                            <h3 className="text-xl font-semibold text-blue-600 mb-4">On The Application:</h3>
                            <ol className="space-y-4 list-decimal pl-5 text-gray-700">
                                <li>Put your agent's <strong>first and last name</strong> in the referral section</li>
                                <li>If there's a dropdown menu, select:
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>"APARTMENT LOCATOR"</li>
                                        <li>"LOCATOR SERVICE"</li>
                                        <li>"REALTOR"</li>
                                        <li>"REAL ESTATE AGENT"</li>
                                    </ul>
                                </li>
                                <li>Take a screenshot of where you listed us (required for free movers)</li>
                            </ol>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                            <h3 className="text-xl font-semibold text-blue-600 mb-4">In Person:</h3>
                            <ul className="space-y-4 list-disc pl-5 text-gray-700">
                                <li><strong>Verbally tell</strong> every property you visit that you're working with us</li>
                                <li>Mention your agent by name if possible</li>
                                <li>Ask them to note it in their system</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Free Movers Section */}
                <section className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
                    <div className="p-8 md:p-12 bg-gradient-to-r from-blue-500 to-blue-300 text-white">
                        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <FaTruckMoving className="w-8 h-8" /> Free Moving Assistance
                        </h2>
                        <p className="text-xl">
                            We cover the cost of movers for the first 2 hours as our gift to you!
                        </p>
                    </div>

                    <div className="p-8 md:p-12 grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">How It Works:</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                                    Some properties qualify for this benefit
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                                    We cover the charge for the <strong>first two hours</strong>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                                    Any time beyond 2 hours is paid directly to movers at market rate
                                </li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-600 mb-3">Important Requirement:</h3>
                            <p className="text-gray-700">
                                You <strong>must provide a screenshot</strong> showing where you listed your agent in the application to qualify for free movers.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl text-white shadow-xl">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Place?</h2>
                        <p className="text-xl mb-8">
                            Let us do the hard work for you - completely free!
                        </p>

                        <Link href="/apply">
                            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-md">
                                Start Your Free Search Now
                            </button>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default HowIsThisFreePage;