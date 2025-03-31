import { TenantDashboardProps } from "@/types/sharedTypes";
import React from "react";
import { AiOutlineMail, AiOutlinePhone, AiOutlineDollarCircle } from "react-icons/ai";
import { FiSearch, FiHome, FiCalendar, FiMapPin, FiAlertCircle, FiXCircle } from "react-icons/fi";
import DetailItem from "./DetailItem";


const TenantDashboard: React.FC<TenantDashboardProps> = ({ tenants, currentCardIndex, swipeHandlers, setCurrentCardIndex, handleSendInvite }) => {
    if (tenants.length === 0) return null;

    const tenant = tenants[currentCardIndex];

    return (
        <div className="space-y-8 max-w-[80%] mx-auto my-[2rem]">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Tenant Dashboard</h2>
                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                    {tenants.length} tenant{tenants.length !== 1 ? "s" : ""}
                </span>
            </div>

            <div {...swipeHandlers} className="overflow-hidden">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-600">
                    <h3 className="text-2xl font-semibold">
                        {tenant.firstName} {tenant.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                        Joined {new Date(tenant.createdAt).toLocaleDateString()}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <DetailItem label="Email" value={tenant.email} icon={<AiOutlineMail />} />
                        <DetailItem label="Mobile" value={tenant.mobileNumber} icon={<AiOutlinePhone />} />
                        <DetailItem label="Search Type" value={tenant.searchType} icon={<FiSearch />} />
                        <DetailItem label="Budget" value={tenant.budget} icon={<AiOutlineDollarCircle />} />
                        <DetailItem label="Bedrooms" value={tenant.bedrooms} icon={<FiHome />} />
                        <DetailItem label="Bathrooms" value={tenant.bathrooms} icon={<FiHome />} />
                        <DetailItem label="Lease End Date" value={tenant.leaseEndDate} icon={<FiCalendar />} />
                        <DetailItem label="Desired Location" value={tenant.desiredLocation?.join(", ") || "N/A"} icon={<FiMapPin />} />
                        <DetailItem label="Broken Lease" value={tenant.brokenLease?.join(", ") || "None"} icon={<FiAlertCircle />} />
                        <DetailItem label="Non-Negotiables" value={tenant.nonNegotiables?.join(", ") || "None"} icon={<FiXCircle />} />
                        <DetailItem label="Gross Income" value={tenant.grossIncome} icon={<AiOutlineDollarCircle />} />

                        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                            <button
                                onClick={() => handleSendInvite(tenant._id, tenant.firstName, tenant.lastName)}
                                className="inline-block rounded-md bg-blue-600 px-5 py-2.5 font-normal text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Send Meeting Invite
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={() => setCurrentCardIndex((prev) => Math.max(0, prev - 1))}
                            disabled={currentCardIndex === 0}
                            className="bg-gray-200 px-4 py-2 rounded-lg"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentCardIndex((prev) => Math.min(tenants.length - 1, prev + 1))}
                            disabled={currentCardIndex === tenants.length - 1}
                            className="bg-gray-200 px-4 py-2 rounded-lg"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantDashboard;
