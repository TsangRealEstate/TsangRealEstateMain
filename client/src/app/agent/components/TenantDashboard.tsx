import React, { JSX, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";
import LabelManager from "./LabelManager";
import { AiOutlineEdit, AiOutlineMail, AiOutlinePhone, AiOutlineDollarCircle } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { FiSearch, FiHome, FiCalendar, FiMapPin, FiAlertCircle, FiXCircle } from "react-icons/fi";
import DetailItem from "./DetailItem";
import ActivityLog from "./ActivityLog";
import ResultsModal from "@/app/listings/components/ResultsModal";
import Link from "next/link";

interface TenantModalProps {
    tenant: any;
    onClose: () => void;
}
interface Movement {
    _id: string;
    fromColumn: string;
    toColumn: string;
    movedAt: string;
}

const TenantModal: React.FC<TenantModalProps> = ({ tenant, onClose }) => {
    const [modal, setModal] = useState({
        show: false,
        title: '',
        message: '',
        hasResults: false,
        results: [],
        tenantId: '',
        tenantName: ''
    });
    const [editField, setEditField] = useState<string | null>(null);
    const [editedValue, setEditedValue] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setTenants, setColumns } = useAuth();
    const [movements, setMovements] = useState<Movement[]>([]);
    if (!tenant) return null;

    const handleEditClick = (field: string, value: string) => {
        setEditField(field);
        setEditedValue(value);
    };

    const handleSave = async () => {
        if (!editField) return;

        try {
            await axiosInstance.put(`/tenants/${tenant._id}`, {
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

    const handleDelete = async () => {
        try {
            const confirmed = window.confirm(
                `Are you sure you want to delete ${tenant.firstName} ${tenant.lastName}? This action cannot be undone.`
            );
            if (!confirmed) return;

            await axiosInstance.delete(`/tenants/${tenant._id}`);
            setTenants((prevTenants) => prevTenants.filter((t) => t._id !== tenant._id));
            setColumns((prevColumns) =>
                prevColumns.map((column) => ({
                    ...column,
                    cards: column.cards.filter((card: { id: string }) => card.id !== tenant._id),
                }))
            );
            onClose();
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete tenant");
        }
    };

    const handleApplyFilters = async () => {
        try {
            setLoading(true);
            setError('');

            // Prepare query parameters
            const params = new URLSearchParams();

            // Handle budget range (e.g., "$1400 - $1500") with cleaning
            if (tenant.budget) {
                const cleanedBudget = tenant.budget
                    .replace(/\$/g, '')
                    .replace(/,/g, '') // Remove commas if present
                    .trim();

                const budgetRange = cleanedBudget.split('-')
                    .map((part: string) => parseInt(part.trim(), 10))
                    .filter((num: number) => !isNaN(num));

                if (budgetRange.length === 2) {
                    params.append('minPrice', budgetRange[0].toString());
                    params.append('maxPrice', budgetRange[1].toString());
                } else if (budgetRange.length === 1) {
                    //If single value, use it for both min and max
                    params.append('minPrice', budgetRange[0].toString());
                    params.append('maxPrice', budgetRange[0].toString());
                }
            }

            // Add beds and baths with cleaning
            // if (tenant.bedrooms) {
            //     const cleanedBedrooms = tenant.bedrooms.toString().replace(/\D/g, '');
            //     if (cleanedBedrooms) params.append('beds', cleanedBedrooms);
            // }

            // if (tenant.bathrooms) {
            //     const cleanedBathrooms = tenant.bathrooms.toString().replace(/\D/g, '');
            //     if (cleanedBathrooms) params.append('baths', cleanedBathrooms);
            // }

            // Handle move-in dates with validation
            if (tenant.leaseEndDate && tenant.leaseStartDate) {
                try {
                    const leaseEndDate = new Date(tenant.leaseEndDate);
                    const leaseStartDate = new Date(tenant.leaseStartDate)
                    if (!isNaN(leaseEndDate.getTime()) && !isNaN(leaseStartDate.getTime())) {
                        params.append('earliestMoveInDate', leaseStartDate.toISOString().split('T')[0]);
                        params.append('latestMoveInDate', leaseEndDate.toISOString().split('T')[0]);
                    }
                } catch (error) {
                    console.error('Error processing lease dates:', error);
                }
            }

            // Add amenities with cleaning
            if (tenant.nonNegotiables?.length > 0) {
                const cleanedAmenities = tenant.nonNegotiables
                    .map((amenity: string) => amenity.trim().toLowerCase())
                    .filter((amenity: string | any[]) => amenity.length > 0);

                if (cleanedAmenities.includes('in-unit laundry')) params.append('inUnitLaundry', 'true');
                if (cleanedAmenities.includes('balcony')) params.append('balcony', 'true');
                if (cleanedAmenities.includes('yard')) params.append('yard', 'true');
            }

            // Add areas with cleaning (as before)
            if (tenant.desiredLocation?.length > 0) {
                const cleanedAreas = tenant.desiredLocation
                    .flatMap((area: string) => area.split(','))
                    .map((area: string) => area.trim())
                    .filter((area: string | any[]) => area.length > 0);

                params.append('area', cleanedAreas.join('&'));
            }

            const response = await axiosInstance.get('/scrape-list/filter', { params });

            if (response.data.count === 0) {
                setModal({
                    show: true,
                    title: "No Results Found",
                    message: "No listings match your current filters.",
                    hasResults: false,
                    results: [],
                    tenantName: tenant.firstName || "",
                    tenantId: ""
                });
            } else {
                setModal({
                    tenantId: tenant._id,
                    show: true,
                    title: "Results Found!",
                    message: `We found ${response.data.count} matching properties.`,
                    hasResults: true,
                    results: response.data.data,
                    tenantName: `${tenant.firstName} ${tenant.lastName}`.trim()
                });
            }


        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Filter error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMovements = async () => {
        try {
            const res = await axiosInstance.get(`/movements/${tenant._id}`);
            setMovements(res.data);  // save to state
        } catch (error) {
            console.error('Failed to fetch movements', error);
        }
    };

    useEffect(() => {
        if (tenant?._id) {
            fetchMovements();
        }
    }, [tenant]);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/15 z-50 p-4 cursor-default"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white relative rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between flex-col lg:flex-row items-start mb-4 Top_CTA_BTNS">
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


                    <div className="mt-6 lg:mt-0 flex flex-wrap gap-2">
                        <button
                            onClick={handleApplyFilters}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Search
                        </button>

                        <Link href={`/listings/Tenant/${encodeURIComponent(`${tenant.firstName} ${tenant.lastName}`.trim() || '')}`} target="_blank">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Searched Units
                            </button>
                        </Link>

                        <button
                            onClick={onClose}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Close
                        </button>

                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderDetailItem("Email", "email", tenant.email, <AiOutlineMail className="text-blue-500" />)}
                    {renderDetailItem("Mobile", "mobileNumber", tenant.mobileNumber, <AiOutlinePhone className="text-blue-500" />)}
                    {renderDetailItem("Search Type", "searchType", tenant.searchType, <FiSearch className="text-blue-500" />)}
                    {renderDetailItem("Budget", "budget", tenant.budget, <AiOutlineDollarCircle className="text-blue-500" />)}
                    {renderDetailItem("Bedrooms", "bedrooms", tenant.bedrooms, <FiHome className="text-blue-500" />)}
                    {renderDetailItem("Bathrooms", "bathrooms", tenant.bathrooms, <FiHome className="text-blue-500" />)}
                    {renderDetailItem("Lease Start Date", "leaseStartDate", tenant.leaseStartDate, <FiCalendar className="text-blue-500" />)}
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

                <LabelManager cardId={tenant._id} />

                <ActivityLog
                    movements={movements}
                    title="Recent Activity"
                    emptyMessage="Nothing to show yet"
                    maxHeight="400px"
                    userDisplayName="Alex Tsang"
                    showHeader={false}
                    className="mt-8"
                />

                <ResultsModal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    hasResults={modal.hasResults}
                    results={modal.results}
                    tenantName={modal.tenantName}
                    tenantId={modal.tenantId}
                    onClose={() => setModal({ ...modal, show: false })}
                />

            </div>
        </div>
    );
};

export default TenantModal;