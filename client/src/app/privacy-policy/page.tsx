"use client"
import React, { useState } from 'react';
// import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const toggleSection = (section: string): void => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* <Helmet>
             <title>Privacy Policy | Tsang Real Estate</title>
             <meta name="description" content="Learn how Tsang Real Estate protects your personal information and privacy." />
              </Helmet> 
        */}

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Privacy Policy
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">
                        Effective Date: April 16, 2025
                    </p>
                </div>

                {/* Policy Content */}
                <div className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200">
                    {/* Introduction */}
                    <div className="px-6 py-5">
                        <p className="text-gray-700">
                            Tsang Real Estate ("we," "our," or "us") respects your privacy and is committed to protecting
                            the personal information you provide while using our website and apartment locating services.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
                        </p>
                    </div>

                    {/* Section 1 */}
                    <div className="px-6 py-5">
                        <button
                            onClick={() => toggleSection('section1')}
                            className="flex justify-between items-center w-full text-left"
                        >
                            <h2 className="text-xl font-semibold text-blue-500">
                                1. Information We Collect
                            </h2>
                            <svg
                                className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'section1' ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeSection === 'section1' && (
                            <div className="mt-4 text-gray-700 space-y-4">
                                <p>We may collect the following types of information:</p>

                                <div>
                                    <h3 className="font-medium">Personal Information</h3>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>Full name</li>
                                        <li>Email address</li>
                                        <li>Phone number</li>
                                        <li>Current address</li>
                                        <li>Desired location and apartment preferences</li>
                                        <li>Budget and move-in timeframe</li>
                                        <li>Any other information you voluntarily provide (e.g., pet ownership, credit/background info)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium">Non-Personal Information</h3>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>Browser type and version</li>
                                        <li>IP address</li>
                                        <li>Device type</li>
                                        <li>Website usage data (e.g., pages visited, time spent)</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 2 */}
                    <div className="px-6 py-5">
                        <button
                            onClick={() => toggleSection('section2')}
                            className="flex justify-between items-center w-full text-left"
                        >
                            <h2 className="text-xl font-semibold text-blue-500">
                                2. How We Use Your Information
                            </h2>
                            <svg
                                className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'section2' ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeSection === 'section2' && (
                            <div className="mt-4 text-gray-700 space-y-2">
                                <p>We use the information we collect to:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Help you locate suitable apartments based on your preferences</li>
                                    <li>Contact you with listings, updates, and responses to inquiries</li>
                                    <li>Send relevant marketing communications (with your consent)</li>
                                    <li>Improve our services and website functionality</li>
                                    <li>Comply with legal obligations</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Section 3 */}
                    <div className="px-6 py-5">
                        <button
                            onClick={() => toggleSection('section3')}
                            className="flex justify-between items-center w-full text-left"
                        >
                            <h2 className="text-xl font-semibold text-blue-500">
                                3. How We Share Your Information
                            </h2>
                            <svg
                                className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'section3' ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeSection === 'section3' && (
                            <div className="mt-4 text-gray-700 space-y-4">
                                <p>We do not sell your information. However, we may share your information with:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Apartment communities, property managers, or landlords to assist in your apartment search</li>
                                    <li>Service providers who help operate our website and communications (e.g., CRM platforms, email providers)</li>
                                    <li>Legal authorities, when required by law or to protect our rights</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Section 4 */}
                    <div className="px-6 py-5">
                        <button
                            onClick={() => toggleSection('section4')}
                            className="flex justify-between items-center w-full text-left"
                        >
                            <h2 className="text-xl font-semibold text-blue-500">
                                4. Cookies and Tracking Technologies
                            </h2>
                            <svg
                                className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'section4' ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeSection === 'section4' && (
                            <div className="mt-4 text-gray-700">
                                <p>We use cookies and similar technologies to enhance your browsing experience and analyze website traffic. You can control cookie settings through your browser preferences.</p>
                            </div>
                        )}
                    </div>

                    {/* Section 5 */}
                    <div className="px-6 py-5">
                        <button
                            onClick={() => toggleSection('section5')}
                            className="flex justify-between items-center w-full text-left"
                        >
                            <h2 className="text-xl font-semibold text-blue-500">
                                5. Your Privacy Rights
                            </h2>
                            <svg
                                className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'section5' ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeSection === 'section5' && (
                            <div className="mt-4 text-gray-700 space-y-4">
                                <p>You have the right to:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Access the personal information we have about you</li>
                                    <li>Request corrections or updates to your information</li>
                                    <li>Request deletion of your personal data (subject to legal exceptions)</li>
                                    <li>Opt out of marketing emails at any time by clicking "unsubscribe"</li>
                                </ul>
                                <p>To exercise any of these rights, please contact us at <a href="mailto:tsangrealestatecorp@gmail.com" className="text-blue-600 hover:underline">tsangrealestatecorp@gmail.com</a>.</p>
                            </div>
                        )}
                    </div>

                    {/* Section 6 */}
                    <div className="px-6 py-5">
                        <button
                            onClick={() => toggleSection('section6')}
                            className="flex justify-between items-center w-full text-left"
                        >
                            <h2 className="text-xl font-semibold text-blue-500">
                                6. Data Security
                            </h2>
                            <svg
                                className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'section6' ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeSection === 'section6' && (
                            <div className="mt-4 text-gray-700">
                                <p>We implement appropriate technical and organizational security measures to protect your information. However, no method of transmission over the internet is 100% secure, so we cannot guarantee absolute security.</p>
                            </div>
                        )}
                    </div>

                    {/* Section 7 */}
                    <div className="px-6 py-5">
                        <button
                            onClick={() => toggleSection('section7')}
                            className="flex justify-between items-center w-full text-left"
                        >
                            <h2 className="text-xl font-semibold text-blue-500">
                                7. Third-Party Links
                            </h2>
                            <svg
                                className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'section7' ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeSection === 'section7' && (
                            <div className="mt-4 text-gray-700">
                                <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.</p>
                            </div>
                        )}
                    </div>

                    {/* Section 8 */}
                    <div className="px-6 py-5">
                        <button
                            onClick={() => toggleSection('section8')}
                            className="flex justify-between items-center w-full text-left"
                        >
                            <h2 className="text-xl font-semibold text-blue-500">
                                8. Children's Privacy
                            </h2>
                            <svg
                                className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'section8' ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeSection === 'section8' && (
                            <div className="mt-4 text-gray-700">
                                <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors.</p>
                            </div>
                        )}
                    </div>

                    {/* Section 9 */}
                    <div className="px-6 py-5">
                        <button
                            onClick={() => toggleSection('section9')}
                            className="flex justify-between items-center w-full text-left"
                        >
                            <h2 className="text-xl font-semibold text-blue-500">
                                9. SMS Privacy Policy
                            </h2>
                            <svg
                                className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'section9' ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeSection === 'section9' && (
                            <div className="mt-4 text-gray-700 space-y-4">
                                <p>Tsang Real Estate Corporation may disclose Personal Data and other information as follows:</p>

                                <div>
                                    <h3 className="font-medium">Third Parties that Help Provide the Messaging Service:</h3>
                                    <p>We will not share your opt-in to an SMS short code campaign with a third party for purposes unrelated to supporting you in connection with that campaign. We may share your Personal Data with third parties that help us provide the messaging service, including, but not limited to, platform providers, phone companies, and other vendors who assist us in the delivery of text messages.</p>
                                </div>

                                <div>
                                    <h3 className="font-medium">Additional Disclosures:</h3>
                                    <p><strong>Affiliates:</strong> We may disclose the Personal Data to our affiliates or subsidiaries; however, if we do so, their use and disclosure of your Personal Data will be subject to this Policy. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 10 */}
                    <div className="px-6 py-5">
                        <button
                            onClick={() => toggleSection('section10')}
                            className="flex justify-between items-center w-full text-left"
                        >
                            <h2 className="text-xl font-semibold text-blue-500">
                                10. Changes to This Policy
                            </h2>
                            <svg
                                className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'section10' ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeSection === 'section10' && (
                            <div className="mt-4 text-gray-700">
                                <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Effective Date."</p>
                            </div>
                        )}
                    </div>

                    {/* Section 11 */}
                    <div className="px-6 py-5">
                        <button
                            onClick={() => toggleSection('section11')}
                            className="flex justify-between items-center w-full text-left"
                        >
                            <h2 className="text-xl font-semibold text-blue-500">
                                11. Contact Us
                            </h2>
                            <svg
                                className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'section11' ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeSection === 'section11' && (
                            <div className="mt-4 text-gray-700 space-y-4">
                                <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>

                                <div className="space-y-2">
                                    <div className="flex items-start">
                                        <span className="mr-3 text-gray-500">🏢</span>
                                        <div>
                                            <h3 className="font-medium">Tsang Real Estate</h3>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="mr-3 text-gray-500">✉️</span>
                                        <a href="mailto:tsangrealestatecorp@gmail.com" className="text-blue-600 hover:underline">tsangrealestatecorp@gmail.com</a>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="mr-3 text-gray-500">📞</span>
                                        <a href="tel:210-975-9800" className="text-blue-600 hover:underline">210-975-9800</a>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="mr-3 text-gray-500">📍</span>
                                        <address className="not-italic">802 Montana St #2, San Antonio, TX 78203</address>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;