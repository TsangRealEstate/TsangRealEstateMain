import React, { JSX, useState } from "react";
import { AiOutlineMail, AiOutlinePhone, AiOutlineDollarCircle, AiOutlineEdit } from "react-icons/ai";
import { FiSearch, FiHome, FiCalendar, FiMapPin, FiAlertCircle, FiXCircle } from "react-icons/fi";
import DetailItem from "./DetailItem";
import axios from "axios";
import { BsCheckLg } from "react-icons/bs";

const TenantModal = ({ tenant, onClose }: { tenant: any, onClose: () => void }) => {
    const [editField, setEditField] = useState<string | null>(null);
    const [editedValue, setEditedValue] = useState<string>('');

    if (!tenant) return null;

    const handleEditClick = (field: string, value: string) => {
        setEditField(field);
        setEditedValue(value);
    };

    const handleSave = async () => {
        if (!editField) return;

        try {
            await axios.put(`http://localhost:5000/api/v1/tenants/${tenant._id}`, {
                [editField]: editedValue,
            });

            tenant[editField] = editedValue;

            setEditField(null);
            setEditedValue('');
        } catch (error) {
            console.error('Update failed', error);
            alert('Failed to update tenant information.');
        }
    };

    const renderDetailItem = (label: string, field: string, value: any, icon: JSX.Element) => {
        const isEditing = editField === field;
        return (
            <div
                className="relative group cursor-pointer"
                onClick={() => {
                    if (!isEditing) handleEditClick(field, value);
                }}
            >
                <DetailItem
                    label={label}
                    value={
                        isEditing ? (
                            <input
                                className="border border-gray-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        ) : (
                            <span className="pr-10">{value || "N/A"}</span>
                        )
                    }
                    icon={icon}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    {!isEditing ? (
                        <AiOutlineEdit
                            size={22}
                            className="text-gray-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                        />
                    ) : (
                        <button
                            className="text-green-600 hover:text-green-800 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSave();
                            }}
                        >
                            <BsCheckLg size={26} />
                        </button>
                    )}
                </div>
            </div>
        );
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/15 z-50 p-4 cursor-default">
            <div className="bg-white relative rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <span>
                        <h2 className="text-2xl font-semibold capitalize text-blue-500">
                            {tenant.firstName.charAt(0).toUpperCase() + tenant.firstName.slice(1)}{" "}
                            {tenant.lastName.charAt(0).toUpperCase() + tenant.lastName.slice(1)}
                        </h2>
                        <div className="flex lg:flex-col gap-y-1.5 mt-2">
                            <p className="text-sm text-gray-600">
                                Joined :{" "}
                                <span className="font-medium text-blue-600">
                                    {new Date(tenant.createdAt).toLocaleString()}
                                </span>
                            </p>
                            {tenant.updatedAt && tenant.updatedAt !== tenant.createdAt && (
                                <p className="text-sm text-gray-600">
                                    Last updated :{" "}
                                    <span className="font-medium text-blue-600">
                                        {new Date(tenant.updatedAt).toLocaleString()}
                                    </span>
                                </p>
                            )}
                        </div>
                    </span>

                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderDetailItem("Email", "email", tenant.email, <AiOutlineMail className="text-blue-500" />)}
                    {renderDetailItem("Mobile", "mobileNumber", tenant.mobileNumber, <AiOutlinePhone className="text-blue-500" />)}
                    {renderDetailItem("Search Type", "searchType", tenant.searchType, <FiSearch className="text-blue-500" />)}
                    {renderDetailItem("Budget", "budget", tenant.budget, <AiOutlineDollarCircle className="text-blue-500" />)}
                    {renderDetailItem("Bedrooms", "bedrooms", tenant.bedrooms, <FiHome className="text-blue-500" />)}
                    {renderDetailItem("Bathrooms", "bathrooms", tenant.bathrooms, <FiHome className="text-blue-500" />)}
                    {renderDetailItem("Lease End Date", "leaseEndDate", tenant.leaseEndDate, <FiCalendar className="text-blue-500" />)}
                    {renderDetailItem(
                        "Desired Location",
                        "desiredLocation",
                        Array.isArray(tenant.desiredLocation) ? tenant.desiredLocation.join(", ") : "N/A",
                        <FiMapPin className="text-blue-500" />
                    )}
                    {renderDetailItem(
                        "Broken Lease",
                        "brokenLease",
                        Array.isArray(tenant.brokenLease) ? tenant.brokenLease.join(", ") : "None",
                        <FiAlertCircle className="text-blue-500" />
                    )}
                    {renderDetailItem(
                        "Non-Negotiables",
                        "nonNegotiables",
                        Array.isArray(tenant.nonNegotiables) ? tenant.nonNegotiables.join(", ") : "None",
                        <FiXCircle className="text-blue-500" />
                    )}
                    {renderDetailItem("Gross Income", "grossIncome", tenant.grossIncome, <AiOutlineDollarCircle className="text-blue-500" />)}
                </div>

            </div>
        </div>
    );
};

export default TenantModal;