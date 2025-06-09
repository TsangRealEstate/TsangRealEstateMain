import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiX, FiEdit, FiTrash2 } from "react-icons/fi";
import axiosInstance from "@/api/axiosInstance";
import { LabelManagerProps, Label, CardLabel2 } from "@/types/sharedTypes";

const PREDEFINED_COLORS = [
    { name: "Red", value: "#ef4444" },
    { name: "Light Blue", value: "#7dd3fc" },
    { name: "Light Green", value: "#86efac" },
    { name: "Grey", value: "#9ca3af" },
    { name: "Yellow", value: "#fde047" },
    { name: "Purple", value: "#c084fc" },
    { name: "Pink", value: "#f9a8d4" },
    { name: "Orange", value: "#fdba74" },
    { name: "Indigo", value: "#818cf8" },
    { name: "Beige", value: "#f5f5dc" },
];

const LabelManager: React.FC<LabelManagerProps> = ({ cardId }) => {
    const [allLabels, setAllLabels] = useState<Label[]>([]);
    const [cardLabels, setCardLabels] = useState<CardLabel2[]>([]);
    const [showNewLabelForm, setShowNewLabelForm] = useState(false);
    const [newLabelName, setNewLabelName] = useState("");
    const [newLabelColor, setNewLabelColor] = useState(PREDEFINED_COLORS[0].value);
    const [isLoading, setIsLoading] = useState(false);
    const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
    const [editedLabelName, setEditedLabelName] = useState("");

    // Get available colors (not used by other labels)
    const getAvailableColors = useCallback(() => {
        const usedColors = new Set(allLabels.map(label => label.color));
        return PREDEFINED_COLORS.filter(color => !usedColors.has(color.value));
    }, [allLabels]);

    // Fetch all available labels and card-specific assignments
    useEffect(() => {
        const fetchLabels = async () => {
            setIsLoading(true);
            try {
                const [allLabelsRes, cardLabelsRes] = await Promise.all([
                    axiosInstance.get("/labels"),
                    axiosInstance.get(`/labels/card/${cardId}`),
                ]);

                setAllLabels(allLabelsRes.data);
                setCardLabels(cardLabelsRes.data);
            } catch (error) {
                console.error("Failed to fetch labels", error);
                alert("Failed to load labels");
            } finally {
                setIsLoading(false);
            }
        };

        if (cardId) fetchLabels();
    }, [cardId]);

    // Set up hotkey listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            let index = -1;

            if (e.keyCode >= 49 && e.keyCode <= 57) {
                // Keys 1–9
                index = e.keyCode - 49;
            } else if (e.keyCode === 48) {
                // Key 0 maps to index 9 (10th label)
                index = 9;
            }

            if (index >= 0 && index < allLabels.length) {
                toggleLabel(allLabels[index]._id);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [allLabels]);

    // Get full label object from labelId
    const getLabelDetails = (labelId: string | Label): Label | null => {
        if (typeof labelId !== "string") return labelId;
        return allLabels.find((label) => label._id === labelId) || null;
    };

    // Toggle label on/off for this card
    const toggleLabel = async (labelId: string) => {
        try {
            const existingLabel = cardLabels.find((cl) =>
                typeof cl.labelId === "string" ? cl.labelId === labelId : cl.labelId._id === labelId
            );

            const isActive = existingLabel ? !existingLabel.isActive : true;

            const res = await axiosInstance.post("/labels/card", {
                cardId,
                labelId,
                isActive,
            });

            setCardLabels((prev) => {
                const existing = prev.filter((cl) =>
                    typeof cl.labelId === "string" ? cl.labelId !== labelId : cl.labelId._id !== labelId
                );
                return [...existing, res.data];
            });
        } catch (error) {
            console.error("Failed to toggle label", error);
            alert("Failed to update label");
        }
    };

    // Create a new standard label
    const createNewLabel = async () => {
        try {
            if (!newLabelName.trim()) {
                alert("Label name cannot be empty");
                return;
            }

            // Check if color is available
            const availableColors = getAvailableColors();
            if (!availableColors.some(c => c.value === newLabelColor)) {
                alert("This color is already in use. Please select another one.");
                return;
            }

            const res = await axiosInstance.post("/labels", {
                name: newLabelName,
                color: newLabelColor,
            });

            setAllLabels((prev) => [...prev, res.data]);
            setShowNewLabelForm(false);
            setNewLabelName("");
            setNewLabelColor(availableColors[0]?.value || PREDEFINED_COLORS[0].value);
        } catch (error) {
            console.error("Failed to create label", error);
            alert("Failed to create label");
        }
    };

    // Update custom name for a card label
    const updateCustomName = async (labelId: string, customName: string) => {
        try {
            await axiosInstance.post("/labels/card", {
                cardId,
                labelId,
                customName,
                isActive: true, // Keep it active
            });

            setCardLabels((prev) =>
                prev.map((cl) =>
                    (typeof cl.labelId === "string" ? cl.labelId === labelId : cl.labelId._id === labelId)
                        ? { ...cl, customName }
                        : cl
                )
            );
        } catch (error) {
            console.error("Failed to update custom name", error);
        }
    };

    // Check if a label is active for this card
    const isLabelActive = (labelId: string) => {
        const cardLabel = cardLabels.find((cl) =>
            typeof cl.labelId === "string" ? cl.labelId === labelId : cl.labelId._id === labelId
        );
        return cardLabel ? cardLabel.isActive : false;
    };

    const deleteLabel = async (labelId: string) => {
        try {
            const confirmed = window.confirm(
                "Are you sure you want to delete this label? This will remove it from all cards."
            );
            if (!confirmed) return;

            await axiosInstance.delete(`/labels/${labelId}`);

            // Update local state
            setAllLabels((prev) => prev.filter((label) => label._id !== labelId));
            setCardLabels((prev) =>
                prev.filter((cl) =>
                    typeof cl.labelId === "string" ? cl.labelId !== labelId : cl.labelId._id !== labelId
                )
            );
        } catch (error) {
            console.error("Failed to delete label", error);
            alert("Failed to delete label");
        }
    };

    const updateLabel = async (labelId: string, newName: string, newColor: string) => {
        try {
            const confirmed = window.confirm(
                "This will update this label for ALL cards. Are you sure?"
            );
            if (!confirmed) return;

            await axiosInstance.put(`/labels/${labelId}`, {
                name: newName,
                color: newColor,
            });

            // Refresh the labels
            const [allLabelsRes, cardLabelsRes] = await Promise.all([
                axiosInstance.get("/labels"),
                axiosInstance.get(`/labels/card/${cardId}`),
            ]);

            setAllLabels(allLabelsRes.data);
            setCardLabels(cardLabelsRes.data);
            setEditingLabelId(null);
        } catch (error) {
            console.error("Failed to update label", error);
            alert("Failed to update label");
        }
    };

    // Get active labels with full label details
    const activeLabels = cardLabels
        .filter((cl) => cl.isActive)
        .map((cl) => ({
            ...cl,
            labelDetails: getLabelDetails(cl.labelId),
        }))
        .filter((cl) => cl.labelDetails);

    const availableColors = getAvailableColors();

    return (
        <div className="space-y-6">
            {/* Preview Section */}
            <div className="my-8 preview_section">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">Label Preview</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        {activeLabels.length} {activeLabels.length === 1 ? "label" : "labels"} selected
                    </span>
                </div>

                <div
                    className={`flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl min-h-16 border border-gray-200 ${activeLabels.length === 0 ? "hidden" : ""
                        }`}
                >
                    {activeLabels.map(({ _id, labelDetails, customName }) => (
                        <div
                            key={_id}
                            className="flex items-center w-auto px-3 gap-x-2.5 justify-center h-10 rounded-md text-white text-sm font-semibold shadow-xs hover:shadow-sm"
                            style={{ backgroundColor: labelDetails?.color }}
                        >
                            <span className="max-w-[120px] truncate">
                                {customName || labelDetails?.name}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLabel(labelDetails?._id || "");
                                }}
                                className="opacity-70 hover:opacity-100 flex items-center justify-center"
                                aria-label={`Remove ${labelDetails?.name}`}
                            >
                                <FiX size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg mt-5">
                {/* Hotkey Legend */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Keyboard Shortcuts
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {allLabels.slice(0, 10).map((label, index) => (
                            <div
                                key={label._id}
                                className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 hover:shadow transition-shadow"
                            >
                                <span className="font-mono bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-xs font-bold">
                                    {index === 9 ? 0 : index + 1}
                                </span>
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                    {label.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Label Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                    {allLabels.map((label, index) => {
                        const isActive = isLabelActive(label._id);
                        const cardLabel = cardLabels.find((cl) =>
                            typeof cl.labelId === "string" ? cl.labelId === label._id : cl.labelId._id === label._id
                        );
                        const displayName = cardLabel?.customName || label.name;

                        return (
                            <div
                                key={label._id}
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group"
                                onClick={() => toggleLabel(label._id)}
                                style={{ cursor: "pointer" }}
                            >
                                {/* Color Preview with hotkey indicator */}
                                <div className="relative">
                                    <div
                                        className="w-8 h-8 rounded-full border border-gray-200 shadow-sm flex-shrink-0"
                                        style={{ backgroundColor: label.color }}
                                    />
                                    {index < 10 && (
                                        <span className="absolute -top-2 -right-2 bg-white text-xs font-bold border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center">
                                            {index === 9 ? 0 : index + 1}
                                        </span>
                                    )}
                                </div>

                                {/* Label Name */}
                                <div className="flex-grow flex items-center gap-2">
                                    {editingLabelId === label._id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                className="border border-gray-300 p-1 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={editedLabelName}
                                                onChange={(e) => setEditedLabelName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        updateLabel(label._id, editedLabelName, label.color);
                                                    }
                                                }}

                                                autoFocus
                                            />
                                            <input
                                                type="color"
                                                value={label.color}
                                                onChange={(e) => {
                                                    // Update the color in the local state temporarily
                                                    setAllLabels(prev => prev.map(l =>
                                                        l._id === label._id ? { ...l, color: e.target.value } : l
                                                    ));
                                                }}
                                                className="w-6 h-6 cursor-pointer"
                                            />
                                            <button
                                                onClick={() => updateLabel(label._id, editedLabelName, label.color)}
                                                className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingLabelId(null)}
                                                className="text-sm bg-gray-200 px-2 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-sm font-medium truncate">
                                            {displayName}
                                        </span>
                                    )}
                                </div>

                                {/* Edit button */}
                                {isActive && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingLabelId(label._id);
                                            setEditedLabelName(displayName);
                                        }}
                                        className="text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Edit label name"
                                    >
                                        <FiEdit size={14} />
                                    </button>
                                )}

                                {/* Delete button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteLabel(label._id);
                                    }}
                                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete label"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        );
                    })}

                    {/* Add New Label Button - only show if we have available colors */}
                    {availableColors.length > 0 && (
                        <button
                            className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50"
                            onClick={() => setShowNewLabelForm(true)}
                            disabled={isLoading}
                        >
                            <FiPlus className="w-4 h-4" />
                            <span>Add New Label</span>
                        </button>
                    )}
                </div>

                {/* New Label Form */}
                {showNewLabelForm && (
                    <div className="flex flex-col gap-4 mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={newLabelColor}
                                    onChange={(e) => setNewLabelColor(e.target.value)}
                                    className="w-10 h-10 cursor-pointer border border-gray-300 rounded-md"
                                    list="colorOptions"
                                />
                                <datalist id="colorOptions">
                                    {availableColors.map((color) => (
                                        <option key={color.value} value={color.value}>
                                            {color.name}
                                        </option>
                                    ))}
                                </datalist>
                            </div>
                            <input
                                type="text"
                                placeholder="New label name"
                                className="border border-gray-300 p-2 rounded-md flex-grow focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={newLabelName}
                                onChange={(e) => setNewLabelName(e.target.value)}
                                autoFocus
                                maxLength={30}
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                                onClick={() => {
                                    setShowNewLabelForm(false);
                                    setNewLabelName("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={createNewLabel}
                                disabled={!newLabelName.trim()}
                            >
                                Add Label
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LabelManager;