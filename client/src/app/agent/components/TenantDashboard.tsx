import React from "react";
import { AiOutlineMail, AiOutlinePhone, AiOutlineDollarCircle } from "react-icons/ai";
import { FiSearch, FiHome, FiCalendar, FiMapPin, FiAlertCircle, FiXCircle } from "react-icons/fi";
import DetailItem from "./DetailItem";


const TenantModal = ({ tenant, onClose }: { tenant: any, onClose: () => void }) => {
    if (!tenant) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/15 z-50 p-4 cursor-default">
            <div className="bg-white relative rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                    <span>
                        <h2 className="text-2xl font-bold">
                            {tenant.firstName} {tenant.lastName}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Joined {new Date(tenant.createdAt).toLocaleDateString()}
                        </p>

                    </span>
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
            </div>
        </div>
    );
};

export default TenantModal;