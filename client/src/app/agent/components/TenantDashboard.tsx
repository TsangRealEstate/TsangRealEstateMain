import React, { JSX, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";
import LabelManager from "./LabelManager";
import { AiOutlineEdit, AiOutlineMail, AiOutlinePhone, AiOutlineDollarCircle } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { FiSearch, FiHome, FiCalendar, FiMapPin, FiAlertCircle, FiXCircle, FiClock, FiDollarSign, FiAlertTriangle } from "react-icons/fi";
import DetailItem from "./DetailItem";
import ActivityLog from "./ActivityLog";
import ResultsModal from "@/app/listings/components/ResultsModal";
import Link from "next/link";
import { FaCheck, FaTimes, FaUsers } from "react-icons/fa";
import { getLocalBrokenLease, getLocalBudget, getLocalDesiredLocations, getLocalNonNegotiables, setLocalBrokenLease, setLocalBudget, setLocalDesiredLocations, setLocalNonNegotiables } from "@/utils/localStorageUtils";
import MultiSelectModal from "./MultiSelectModal";
import TenantComments from "./TenantComments";
import { sanAntonioAreas } from "@/data/sanAntonioAreas";
import { allLocationOptions } from "@/data/allLocations";
import { logMovement } from "./Agent";

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
    const [showNonNegotiablesModal, setShowNonNegotiablesModal] = useState(false);
    const [editedValue, setEditedValue] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setTenants, setColumns, columns, searchedResults, fetchSearchedResults } = useAuth();
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

    const handleColumnChange = (selectedColumnId: string) => {
        if (!tenant) return;

        const currentColumnIndex = columns.findIndex(col =>
            col.cards.some((card: { id: any; }) => card.id === tenant._id)
        );

        if (currentColumnIndex === -1) return;

        const targetColumnIndex = columns.findIndex(col => col.id === selectedColumnId);
        if (targetColumnIndex === -1) return;

        if (currentColumnIndex === targetColumnIndex) return;

        const updatedColumns = [...columns];
        const currentColumn = updatedColumns[currentColumnIndex];
        const targetColumn = updatedColumns[targetColumnIndex];

        const cardIndex = currentColumn.cards.findIndex((card: { id: any; }) => card.id === tenant._id);
        if (cardIndex === -1) return;

        const [movedCard] = currentColumn.cards.splice(cardIndex, 1);

        targetColumn.cards.push(movedCard);

        // Update state
        setColumns(updatedColumns);

        logMovement(tenant._id, currentColumn.title, targetColumn.title);
    };

    const renderDetailItem = (label: string, field: string, value: any, icon: JSX.Element) => {
        const isEditing = editField === field;

        if (field === 'nonNegotiables') {
            const allNonNegotiableOptions = [
                "1st floor",
                "2nd floor",
                "3rd floor or top floor",
                "Washer/dryer connections",
                "Washer/dryer included",
                "Patio/Balcony",
                "No carpet in living room",
                "Yard",
            ];

            const [currentSelected, setCurrentSelected] = useState<string[]>(() => {
                const localItems = getLocalNonNegotiables(tenant._id);
                if (localItems.length > 0) return localItems;

                // Handle tenant.nonNegotiables whether it's string or array
                if (typeof tenant.nonNegotiables === 'string') {
                    return tenant.nonNegotiables.split(',')
                        .map((item: string) => item.trim())
                        .filter((item: any) => item);
                } else if (Array.isArray(tenant.nonNegotiables)) {
                    return tenant.nonNegotiables;
                }
                return [];
            });

            const handleSaveNonNegotiables = (selected: string[]) => {
                setLocalNonNegotiables(tenant._id, selected);
                setCurrentSelected(selected);
                setShowNonNegotiablesModal(false);
            };

            return (
                <>
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => setShowNonNegotiablesModal(true)}
                    >
                        <DetailItem
                            label={label}
                            value={
                                <div className="flex flex-wrap gap-2 pr-10">
                                    {currentSelected.length > 0
                                        ? currentSelected.map((item, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                            >
                                                {item}
                                            </span>
                                        ))
                                        : 'N/A'}
                                </div>
                            }
                            icon={icon}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            <AiOutlineEdit
                                size={22}
                                className="text-gray-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                            />
                        </div>
                    </div>

                    {showNonNegotiablesModal && (
                        <MultiSelectModal
                            title="Edit Non-Negotiables"
                            items={allNonNegotiableOptions} // Show all available options
                            selectedItems={currentSelected} // Current selections will be checked
                            onSave={handleSaveNonNegotiables}
                            onClose={() => setShowNonNegotiablesModal(false)}
                        />
                    )}
                </>
            );
        }

        if (field === "desiredLocation") {

            const [currentLocations, setCurrentLocations] = useState<string[]>(() => {
                const local = getLocalDesiredLocations(tenant._id);
                if (local.length > 0) return local;

                if (typeof tenant.desiredLocation === 'string') {
                    return tenant.desiredLocation.split(',')
                        .map((i: string) => i.trim())
                        .filter(Boolean);
                } else if (Array.isArray(tenant.desiredLocation)) {
                    return tenant.desiredLocation;
                }
                return [];
            });

            const [showLocationModal, setShowLocationModal] = useState(false);

            const handleSaveLocations = (selected: string[]) => {
                setLocalDesiredLocations(tenant._id, selected);
                setCurrentLocations(selected);
                setShowLocationModal(false);
            };

            return (
                <>
                    <div className="relative group cursor-pointer" onClick={() => setShowLocationModal(true)}>
                        <DetailItem
                            label="Desired Location"
                            value={
                                <div className="flex flex-wrap gap-2 pr-10">
                                    {currentLocations.length > 0
                                        ? currentLocations.map((loc, index) => (
                                            <span
                                                key={index}
                                                className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                            >
                                                {loc}
                                            </span>
                                        ))
                                        : "N/A"}
                                </div>
                            }
                            icon={<FiMapPin className="text-blue-500" />}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            <AiOutlineEdit
                                size={22}
                                className="text-gray-400 group-hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100"
                            />
                        </div>
                    </div>

                    {showLocationModal && (
                        <MultiSelectModal
                            title="Edit Desired Locations"
                            items={allLocationOptions}
                            selectedItems={currentLocations}
                            onSave={handleSaveLocations}
                            onClose={() => setShowLocationModal(false)}
                        />
                    )}
                </>
            );
        }

        if (field === "budget") {
            const budgetOptions = (() => {
                if (typeof tenant.budget === "string") {
                    try {
                        const parts = tenant.budget.replace(/\$/g, '').trim().split('-');
                        if (parts.length === 2) {
                            const min = parts[0].trim();
                            const max = parts[1].trim();
                            return [min, max];
                        }
                    } catch (err) {
                        console.error("Error parsing budget:", err);
                    }
                }
                return [];
            })();

            const [currentBudget, setCurrentBudget] = useState<string[]>(() => {
                const local = getLocalBudget(tenant._id);
                if (Array.isArray(local) && local.length > 0) return local;
                return budgetOptions;
            });

            const [showBudgetModal, setShowBudgetModal] = useState(false);
            const [isEditing, setIsEditing] = useState(false);
            const [editMinValue, setEditMinValue] = useState(currentBudget[0] || '');
            const [editMaxValue, setEditMaxValue] = useState(currentBudget[1] || '');
            const [isSaving, setIsSaving] = useState(false);

            const handleSaveBudget = (selected: string[]) => {
                setLocalBudget(tenant._id, selected);
                setCurrentBudget(selected);
                setShowBudgetModal(false);
            };

            const handleInlineSave = async () => {
                try {
                    setIsSaving(true);
                    const min = editMinValue.trim();
                    const max = editMaxValue.trim();

                    if (min && max) {
                        const newBudget = [min, max];
                        const budgetString = newBudget.join('-');

                        await axiosInstance.put(`/tenants/${tenant._id}`, {
                            budget: `$${budgetString}`
                        });

                        setLocalBudget(tenant._id, newBudget);
                        setCurrentBudget(newBudget);
                        tenant.budget = `$${budgetString}`;
                    }
                } catch (err) {
                    console.error("Error saving budget:", err);
                    alert('Failed to update budget.');
                } finally {
                    setIsSaving(false);
                    setIsEditing(false);
                }
            };

            const formatBudget = (value: string) => {
                return value ? `$${value}` : "N/A";
            };

            return (
                <>
                    <div className="relative group">
                        <DetailItem
                            label="Budget"
                            value={
                                isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-2 w-fit">
                                            <input
                                                type="text"
                                                placeholder="Min"
                                                value={editMinValue}
                                                onChange={(e) => setEditMinValue(e.target.value.replace(/[^0-9]/g, ''))}
                                                onKeyDown={(e) => e.key === 'Enter' && handleInlineSave()}
                                                autoFocus
                                                className="border px-2 border-blue-500 w-[80px]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Max"
                                                value={editMaxValue}
                                                onChange={(e) => setEditMaxValue(e.target.value.replace(/[^0-9]/g, ''))}
                                                onKeyDown={(e) => e.key === 'Enter' && handleInlineSave()}
                                                className="border px-2 border-blue-500 w-[80px]"
                                            />
                                        </div>
                                        {isSaving ? (
                                            <span className="text-sm text-gray-500">Saving...</span>
                                        ) : (
                                            <button
                                                onClick={handleInlineSave}
                                                className="text-sm text-blue-500 hover:text-blue-700 whitespace-nowrap"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    `${formatBudget(currentBudget[0] || '')} - ${formatBudget(currentBudget[1] || '')}`
                                )
                            }
                            icon={<FiDollarSign className="text-blue-500" />}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            <button
                                onClick={() => {
                                    if (isEditing) {
                                        setIsEditing(false);
                                    } else {
                                        setEditMinValue(currentBudget[0] || '');
                                        setEditMaxValue(currentBudget[1] || '');
                                        setIsEditing(true);
                                    }
                                }}
                                className="p-1 rounded-full hover:bg-gray-100"
                                disabled={isSaving}
                            >
                                <AiOutlineEdit
                                    size={25}
                                    className={
                                        isEditing ? "text-blue-400" :
                                            isSaving ? "text-blue-400" :
                                                "text-blue-500 group-hover:text-green-600 transition-colors"
                                    }
                                />
                            </button>

                            <button
                                onClick={() => setShowBudgetModal(true)}
                                className="text-xs text-blue-500 hidden hover:text-blue-700"
                                disabled={isSaving}
                            >
                                Range
                            </button>
                        </div>
                    </div>

                    {showBudgetModal && (
                        <MultiSelectModal
                            title="Edit Budget Range"
                            items={budgetOptions}
                            selectedItems={currentBudget}
                            onSave={handleSaveBudget}
                            onClose={() => setShowBudgetModal(false)}
                        />
                    )}
                </>
            );
        }

        if (field === "leaseStartDate" || field === "leaseEndDate") {
            let dateValue = "";
            if (value) {
                const parsedDate = new Date(value);
                if (!isNaN(parsedDate.getTime())) {
                    dateValue = parsedDate.toISOString().slice(0, 10);
                }
            }

            return (
                <div
                    className="relative group cursor-pointer"
                    onClick={() => {
                        if (!isEditing) handleEditClick(field, dateValue);
                    }}
                >
                    <DetailItem
                        label={label}
                        value={
                            isEditing ? (
                                <input
                                    type="date"
                                    className="border border-gray-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editedValue || dateValue}
                                    onChange={(e) => setEditedValue(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                />
                            ) : (
                                <div className="flex items-center space-x-2 text-blue-600">

                                    <span>{formatDate(value)}</span>
                                </div>
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
        }

        if (field === "brokenLease") {
            const allBrokenLeaseOptions = [
                "Broken lease/Owe money to a property",
                "Owe a property money",
                "Eviction",
                "Felony",
                "Misdemeanor"
            ];

            const [currentSelections, setCurrentSelections] = useState<string[]>(() => {
                const local = getLocalBrokenLease(tenant._id);
                if (local.length > 0) return local;

                if (typeof tenant.brokenLease === 'string') {
                    return tenant.brokenLease.split(',')
                        .map((i: string) => i.trim())
                        .filter(Boolean);
                } else if (Array.isArray(tenant.brokenLease)) {
                    return tenant.brokenLease;
                }
                return [];
            });

            const [showModal, setShowModal] = useState(false);

            const handleSaveSelections = (selected: string[]) => {
                setLocalBrokenLease(tenant._id, selected);
                setCurrentSelections(selected);
                setShowModal(false);
            };

            return (
                <>
                    <div className="relative group cursor-pointer" onClick={() => setShowModal(true)}>
                        <DetailItem
                            label="Broken Lease/History"
                            value={
                                <div className="flex flex-wrap gap-2 pr-10">
                                    {currentSelections.length > 0
                                        ? currentSelections.map((item, index) => (
                                            <span
                                                key={index}
                                                className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                            >
                                                {item}
                                            </span>
                                        ))
                                        : "N/A"}
                                </div>
                            }
                            icon={<FiAlertTriangle className="text-red-500" />}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            <AiOutlineEdit
                                size={22}
                                className="text-gray-400 group-hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100"
                            />
                        </div>
                    </div>

                    {showModal && (
                        <MultiSelectModal
                            title="Edit Broken Lease/History"
                            items={allBrokenLeaseOptions}
                            selectedItems={currentSelections}
                            onSave={handleSaveSelections}
                            onClose={() => setShowModal(false)}
                        />
                    )}
                </>
            );
        }


        return (
            <div
                className="relative group cursor-pointer"
                onClick={() => {
                    if (!isEditing) handleEditClick(field, value);
                }}

                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.stopPropagation();
                        handleSave();
                    }
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

            //Budget handling
            const localBudget = getLocalBudget(tenant._id);

            let budgetString = "";
            if (Array.isArray(localBudget)) {
                if (localBudget.length === 2) {
                    budgetString = `$${localBudget[0]} - $${localBudget[1]}`;
                } else if (localBudget.length === 1) {
                    budgetString = `$${localBudget[0]}`;
                } else {
                    budgetString = "";
                }
            } else if (typeof tenant.budget === "string") {
                budgetString = tenant.budget;
            }

            if (budgetString && budgetString !== "N/A") {
                const cleanedBudget = budgetString
                    .replace(/\$/g, '')
                    .replace(/,/g, '')
                    .trim();

                const budgetRange = cleanedBudget
                    .split('-')
                    .map(part => parseInt(part.trim(), 10))
                    .filter(num => !isNaN(num));

                if (budgetRange.length === 2) {
                    const minVal = Math.min(budgetRange[0], budgetRange[1]);
                    const maxVal = Math.max(budgetRange[0], budgetRange[1]);
                    params.append('minPrice', minVal.toString());
                    params.append('maxPrice', maxVal.toString());
                } else if (budgetRange.length === 1) {
                    params.append('maxPrice', budgetRange[0].toString());
                }
            }

            // Add beds and baths with cleaning
            if (tenant.bedrooms) {
                const cleanedBedrooms = tenant.bedrooms.toString().replace(/\D/g, '');
                if (cleanedBedrooms) params.append('beds', cleanedBedrooms);
            }

            if (tenant.bathrooms) {
                const cleanedBathrooms = tenant.bathrooms.toString().replace(/\D/g, '');
                if (cleanedBathrooms) params.append('baths', cleanedBathrooms);
            }

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
            const localNonNegotiables = getLocalNonNegotiables(tenant._id);
            const tenantNonNegotiables = Array.isArray(tenant.nonNegotiables) ? tenant.nonNegotiables : [];
            const selectedNonNegotiables = localNonNegotiables.length > 0 ? localNonNegotiables : tenantNonNegotiables;

            // if (selectedNonNegotiables.length > 0) {
            //     const cleanedAmenities = selectedNonNegotiables
            //         .map((item: string) => item.trim().toLowerCase())
            //         .filter((item: string) => item.length > 0);

            //     if (cleanedAmenities.includes('in-unit laundry')) {
            //         params.append('inUnitLaundry', 'true');
            //     }
            //     if (cleanedAmenities.includes('balcony')) {
            //         params.append('balcony', 'true');
            //     }
            //     if (cleanedAmenities.includes('yard')) {
            //         params.append('yard', 'true');
            //     }
            // }


            // Add areas with cleaning (as before)
            const localLocations = getLocalDesiredLocations(tenant._id);
            const tenantLocations = Array.isArray(tenant.desiredLocation) ? tenant.desiredLocation : [];
            const desiredLocations = localLocations.length > 0 ? localLocations : tenantLocations;

            if (desiredLocations?.length > 0) {
                // Clean and split the locations
                const cleanedAreas = desiredLocations
                    .flatMap((area: string) => area.split(','))
                    .map((area: string) => area.trim())
                    .filter((area: string) => area.length > 0);

                // Convert area names to zip codes and remove duplicates
                const selectedZips = cleanedAreas
                    .flatMap((area: string) => {
                        const matchedArea = sanAntonioAreas.find(a =>
                            a.area_name.toLowerCase().includes(area.toLowerCase())
                        );
                        return matchedArea?.zip_codes || [];
                    })
                    .filter((zip: any, index: any, self: string | any[]) => self.indexOf(zip) === index); // Remove duplicates

                // Only append if we found matching zips
                if (selectedZips.length > 0) {
                    params.append('area', selectedZips.join(','));
                }
            }

            const response = await axiosInstance.get('/scrape-list/filter', { params });

            console.log("Created Params:", params.toString())

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

    const handleSendInvite = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post(
                `/meetings/send-invite/${tenant._id}`
            );

            // Success case
            alert(`✅ Success!\nMeeting invite sent to:\n${tenant.firstName} ${tenant.lastName}\n(${tenant.email})`);
        } catch (error: any) {
            console.error("Error sending meeting invite:", error.response?.data || error.message);

            // Special handling for default email case
            if (error.response?.data?.requiresEmailUpdate) {
                alert(
                    `⚠️ Cannot Send Invite\n\nThis tenant has a default email address.\n\nPlease update their emailto a valid one.`
                )
            }

            else {
                alert(`❌ Failed to Send Invite\n\n${error.response?.data?.error ||
                    error.response?.data?.message ||
                    'Please try again later'
                    }`);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: { key: string; }) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    useEffect(() => {
        if (tenant?._id) {
            fetchMovements();
            fetchSearchedResults(`${tenant.firstName || ""} ${tenant.lastName || ""}`);
        }
    }, [tenant]);

    const formatDate = (dateString: string | number | Date) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);

        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/15 z-50 p-4 cursor-default"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white relative rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between flex-col lg:flex-row items-start mb-4 Top_CTA_BTNS">
                    <span>

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold capitalize text-blue-500">
                                {tenant.firstName.charAt(0).toUpperCase() + tenant.firstName.slice(1)}{" "}
                                {tenant.lastName.charAt(0).toUpperCase() + tenant.lastName.slice(1)}
                            </h2>

                            <div className="relative w-48 ml-5">
                                <select
                                    id="column-select"
                                    onChange={(e) => handleColumnChange(e.target.value)}
                                    className="block appearance-none w-full bg-white border border-blue-400 hover:border-gray-300 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    value={columns.find(col =>
                                        col.cards.some((card: { id: any; }) => card.id === tenant._id)
                                    )?.id || ""}
                                >
                                    {columns.map(column => (
                                        <option key={column.id} value={column.id}>
                                            {column.title}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

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

                    <div className="mt-6 lg:mt-0 flex flex-wrap gap-2 items-center main-cta-btns">
                        <button
                            onClick={handleApplyFilters}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>

                        {searchedResults.count > 0 && (
                            <Link
                                href={`/listings/Tenant/${encodeURIComponent(`${tenant.firstName || ""} ${tenant.lastName || ""}`.trim())}`}
                                target="_blank"
                            >
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Searched Units
                                </button>
                            </Link>
                        )}


                        <button
                            onClick={() => handleSendInvite()}
                            disabled={loading}
                            className="inline-block rounded-md bg-blue-600 px-5 py-2.5 font-normal text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {loading ? 'Sending...' : 'Send Meeting Invite'}
                        </button>

                        <button
                            onClick={onClose}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            X
                        </button>

                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 renderDetails">
                    {tenant.OtherOnLease === "yes" &&
                        renderDetailItem(
                            "Other Adults On The Lease",
                            "othersOnLeasevalue",
                            tenant.othersOnLeasevalue,
                            <FaUsers className="text-blue-500" />
                        )
                    }

                    {renderDetailItem("Email", "email", tenant.email, <AiOutlineMail className="text-blue-500" />)}
                    {renderDetailItem("Mobile", "mobileNumber", tenant.mobileNumber, <AiOutlinePhone className="text-blue-500" />)}
                    {renderDetailItem("Search Type", "searchType", tenant.searchType, <FiSearch className="text-blue-500" />)}
                    {renderDetailItem("Budget", "budget", tenant.budget, <AiOutlineDollarCircle className="text-blue-500" />)}
                    {renderDetailItem("Bedrooms", "bedrooms", tenant.bedrooms, <FiHome className="text-blue-500" />)}
                    {renderDetailItem("Bathrooms", "bathrooms", tenant.bathrooms, <FiHome className="text-blue-500" />)}

                    {tenant.searchType === "rent" && (
                        <>
                            {renderDetailItem(
                                "Lease Start Date",
                                "leaseStartDate",
                                formatDate(tenant.leaseStartDate),
                                <FiCalendar className="text-blue-500" />
                            )}
                            {renderDetailItem(
                                "Lease End Date",
                                "leaseEndDate",
                                formatDate(tenant.leaseEndDate),
                                <FiCalendar className="text-blue-500" />
                            )}

                            {renderDetailItem(
                                "Issues",
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

                        </>
                    )}

                    {(tenant.searchType === "purchase") && (
                        <>
                            {renderDetailItem("Pre-Approval", "preApproval", tenant.preApproval, <FaCheck className="text-blue-500" />)}
                            {renderDetailItem("Pre-Approval Amount", "preApprovalAmount", tenant.preApprovalAmount, <AiOutlineDollarCircle className="text-blue-500" />)}
                            {renderDetailItem("Closing Timeline", "closingTimeline", formatDate(tenant.closingTimeline), <FiClock className="text-blue-500" />)}
                        </>
                    )}

                    {renderDetailItem(
                        "Desired Location",
                        "desiredLocation",
                        Array.isArray(tenant.desiredLocation) ? tenant.desiredLocation.join(", ") : "N/A",
                        <FiMapPin className="text-blue-500" />
                    )}


                    {renderDetailItem(
                        "Other-OnLease",
                        "OtherOnLease",
                        tenant.OtherOnLease,
                        tenant.OtherOnLease === "yes"
                            ? <FaCheck className="text-green-500" />
                            : <FaTimes className="text-red-500" />
                    )}
                    {renderDetailItem("Availability-Date", "AvailabilityDate", formatDate(tenant.AvailabilityDate), <FiCalendar className="text-blue-500" />)}
                    {renderDetailItem("Time-For-Call", "timeForCall", tenant.timeForCall, <FiClock className="text-blue-500" />)}
                </div>

                <LabelManager cardId={tenant._id} />

                <TenantComments tenantId={tenant._id} />

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