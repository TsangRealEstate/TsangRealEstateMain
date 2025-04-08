import React, { JSX, useEffect, useState } from "react";
import { AiOutlineMail, AiOutlinePhone, AiOutlineDollarCircle, AiOutlineEdit } from "react-icons/ai";
import { FiSearch, FiHome, FiCalendar, FiMapPin, FiAlertCircle, FiXCircle, FiPlus, FiX } from "react-icons/fi";
import DetailItem from "./DetailItem";
import { BsCheckLg } from "react-icons/bs";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";
import { defaultColors } from "@/data/defaultColors";
import ActivityLog from "./ActivityLog";


const TenantModal = ({ tenant, onClose }: { tenant: any, onClose: () => void }) => {
    const [editField, setEditField] = useState<string | null>(null);
    const [editedValue, setEditedValue] = useState<string>('');
    const [colors, setColors] = useState(defaultColors);
    const [selectedLabels, setSelectedLabels] = useState<{ id: string; text: string; customColor?: string }[]>([]);
    const [inputTexts, setInputTexts] = useState<{ [key: string]: string }>({});
    const [showNewLabelInput, setShowNewLabelInput] = useState(false);
    const [newLabelText, setNewLabelText] = useState("");
    const [newLabelColor, setNewLabelColor] = useState("#000000");
    const { setTenants, setColumns } = useAuth();
    interface Movement {
        _id: string;
        fromColumn: string;
        toColumn: string;
        movedAt: string;
    }

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

    const toggleLabel = (id: string) => {
        if (selectedLabels.find((label) => label.id === id)) {
            setSelectedLabels((prev) => prev.filter((label) => label.id !== id));
        } else {
            const foundColor = colors.find(c => c.id === id);
            const isCustom = id.startsWith("custom-");
            setSelectedLabels((prev) => [
                ...prev,
                {
                    id,
                    text: inputTexts[id] || "",
                    customColor: isCustom ? inputTexts[id + "-color"] : undefined,
                },
            ]);
        }
    };

    const handleInputChange = (id: string, value: string) => {
        setInputTexts((prev) => ({ ...prev, [id]: value }));
        setSelectedLabels((prev) =>
            prev.map((label) =>
                label.id === id ? { ...label, text: value } : label
            )
        );
    };

    const handleAddNewLabel = () => {
        if (!newLabelText.trim()) return;

        const newId = `custom-${Date.now()}`;
        setColors((prev) => [...prev, { id: newId, color: "" }]); // Just add the ID
        setInputTexts((prev) => ({
            ...prev,
            [newId]: newLabelText,
            [newId + "-color"]: newLabelColor,
        }));

        setSelectedLabels((prev) => [
            ...prev,
            { id: newId, text: newLabelText, customColor: newLabelColor },
        ]);

        setShowNewLabelInput(false);
        setNewLabelText("");
        setNewLabelColor("#000000");
    };

    const handleDelete = async () => {
        try {
            const confirmed = window.confirm(`Are you sure you want to delete ${tenant.firstName} ${tenant.lastName}? This action cannot be undone.`);
            if (!confirmed) return;
            await axiosInstance.delete(`/tenants/${tenant._id}`);
            setTenants(prevTenants => prevTenants.filter(t => t._id !== tenant._id));
            setColumns(prevColumns =>
                prevColumns.map(column => ({
                    ...column,
                    cards: column.cards.filter((card: { id: string; }) => card.id !== tenant._id)
                }))
            ); onClose();
        } catch (error) {
            console.error('Delete failed', error);
            alert('Failed to delete tenant.');
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

                    <div>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 mr-3 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="my-8">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">Label Preview</h3>
                        {selectedLabels.length > 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                {selectedLabels.length} {selectedLabels.length === 1 ? 'label' : 'labels'} selected
                            </span>
                        )}
                    </div>

                    <div className={`flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl min-h-auto border border-gray-200 transition-all duration-200 ${selectedLabels.length === 0 ? 'hidden' : ''}`}>
                        {selectedLabels && (
                            selectedLabels.map(({ id, text, customColor }) => {
                                const foundColor = colors.find((c) => c.id === id)?.color;
                                return (
                                    <div
                                        key={id}
                                        className={`flex items-center w-auto px-2 gap-x-2.5 justify-center h-[40px] rounded-md text-white text-[13px] font-semibold shadow-xs hover:shadow-sm transition-all ${!id.startsWith("custom-") ? foundColor : ''}`}
                                        style={{
                                            backgroundColor: id.startsWith("custom-") ? customColor : undefined,
                                        }}
                                    >
                                        <span className="max-w-[120px] truncate">
                                            {text || "Unnamed Label"}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLabel(id);
                                            }}
                                            className="opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center"
                                            aria-label={`Remove ${text || 'unnamed label'}`}
                                        >
                                            <FiX size={20} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
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

                <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg mt-5">
                    {/* Label Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {colors.map(({ id, color }) => (
                            <div key={id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                {/* Color Preview */}
                                <div
                                    className="w-8 h-8 rounded-full border border-gray-200 shadow-sm flex-shrink-0"
                                    style={{
                                        backgroundColor: id.startsWith("custom-")
                                            ? inputTexts[id + "-color"]
                                            : undefined,
                                    }}
                                >
                                    {!id.startsWith("custom-") && (
                                        <div className={`${color} w-full h-full rounded-full`} />
                                    )}
                                </div>

                                {/* Toggle Switch */}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={selectedLabels.some((label) => label.id === id)}
                                        onChange={() => toggleLabel(id)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                </label>

                                {/* Label Text Input */}
                                <input
                                    type="text"
                                    placeholder="Enter label"
                                    className="border border-gray-300 p-2 rounded-md text-sm flex-grow focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={inputTexts[id] || ""}
                                    onChange={(e) => handleInputChange(id, e.target.value)}
                                    disabled={!selectedLabels.find((label) => label.id === id)}
                                />
                            </div>
                        ))}

                        {/* Add New Label Button */}
                        <button
                            className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all"
                            onClick={() => setShowNewLabelInput(true)}
                        >
                            <FiPlus className="w-4 h-4" />
                            <span>Add New Label</span>
                        </button>
                    </div>

                    {/* New Label Form */}
                    {showNewLabelInput && (
                        <div className="flex flex-col gap-4 mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={newLabelColor}
                                    onChange={(e) => setNewLabelColor(e.target.value)}
                                    className="w-10 h-10 cursor-pointer border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="New label name"
                                    className="border border-gray-300 p-2 rounded-md flex-grow focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={newLabelText}
                                    onChange={(e) => setNewLabelText(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                                    onClick={() => {
                                        setShowNewLabelInput(false);
                                        setNewLabelText("");
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleAddNewLabel}
                                    disabled={!newLabelText.trim()}
                                >
                                    Add Label
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <ActivityLog
                    movements={movements}
                    title="Recent Activity"
                    emptyMessage="Nothing to show yet"
                    maxHeight="400px"
                    userDisplayName="Alex Tsang"
                    showHeader={false}
                    className="mt-8"
                />

            </div>
        </div>
    );
};

export default TenantModal;