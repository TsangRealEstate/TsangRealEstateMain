// components/LabelManager.tsx
import React, { useState, useEffect } from "react";
import { FiPlus, FiX, FiEdit, FiTrash2 } from "react-icons/fi";
import axiosInstance from "@/api/axiosInstance";

interface Label {
    _id: string;
    name: string;
    color: string;
    isPredefined?: boolean;
}

interface CardLabel {
    _id: string;
    labelId: Label | string;
    isActive: boolean;
    customName?: string;
}

interface LabelManagerProps {
    cardId: string;
    onClose?: () => void;
    onDelete?: () => void;
}

const LabelManager: React.FC<LabelManagerProps> = ({ cardId, onClose, onDelete }) => {
    const [allLabels, setAllLabels] = useState<Label[]>([]);
    const [cardLabels, setCardLabels] = useState<CardLabel[]>([]);
    const [showNewLabelForm, setShowNewLabelForm] = useState(false);
    const [newLabelName, setNewLabelName] = useState("");
    const [newLabelColor, setNewLabelColor] = useState("#3b82f6");
    const [isLoading, setIsLoading] = useState(false);
    const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
    const [editedLabelName, setEditedLabelName] = useState("");

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

            const res = await axiosInstance.post("/labels", {
                name: newLabelName,
                color: newLabelColor,
            });

            setAllLabels((prev) => [...prev, res.data]);
            setShowNewLabelForm(false);
            setNewLabelName("");
            setNewLabelColor("#3b82f6");
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

    // Get active labels with full label details
    const activeLabels = cardLabels
        .filter((cl) => cl.isActive)
        .map((cl) => ({
            ...cl,
            labelDetails: getLabelDetails(cl.labelId),
        }))
        .filter((cl) => cl.labelDetails);

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
                {/* Label Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {allLabels.map((label) => {
                        const isActive = isLabelActive(label._id);
                        const cardLabel = cardLabels.find((cl) =>
                            typeof cl.labelId === "string" ? cl.labelId === label._id : cl.labelId._id === label._id
                        );
                        const displayName = cardLabel?.customName || label.name;

                        return (
                            <div
                                key={label._id}
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                            >
                                {/* Color Preview */}
                                <div
                                    className="w-8 h-8 rounded-full border border-gray-200 shadow-sm flex-shrink-0"
                                    style={{ backgroundColor: label.color }}
                                />

                                {/* Toggle Switch */}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isActive}
                                        onChange={() => toggleLabel(label._id)}
                                        disabled={isLoading}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5"></div>
                                </label>

                                {/* Label Name */}
                                <div className="flex-grow flex items-center gap-2">
                                    {editingLabelId === label._id ? (
                                        <input
                                            type="text"
                                            className="border border-gray-300 p-1 rounded-md text-sm flex-grow focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={editedLabelName}
                                            onChange={(e) => setEditedLabelName(e.target.value)}
                                            onBlur={() => {
                                                if (label.isPredefined) {
                                                    updateCustomName(label._id, editedLabelName);
                                                }
                                                setEditingLabelId(null);
                                            }}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    if (label.isPredefined) {
                                                        updateCustomName(label._id, editedLabelName);
                                                    }
                                                    setEditingLabelId(null);
                                                }
                                            }}
                                            autoFocus
                                        />
                                    ) : (
                                        <span className="text-sm font-medium truncate">
                                            {displayName}
                                        </span>
                                    )}

                                    {isActive && (
                                        <button
                                            onClick={() => {
                                                setEditingLabelId(label._id);
                                                setEditedLabelName(displayName);
                                            }}
                                            className="text-gray-500 hover:text-gray-700"
                                            title="Edit label name"
                                        >
                                            <FiEdit size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Delete button - only for non-predefined labels */}
                                {!label.isPredefined && (
                                    <button
                                        onClick={() => deleteLabel(label._id)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                        title="Delete label"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}

                    {/* Add New Label Button */}
                    <button
                        className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50"
                        onClick={() => setShowNewLabelForm(true)}
                        disabled={isLoading}
                    >
                        <FiPlus className="w-4 h-4" />
                        <span>Add New Label</span>
                    </button>
                </div>

                {/* New Label Form */}
                {showNewLabelForm && (
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