import axiosInstance from "@/api/axiosInstance";
import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { FaPencilAlt } from "react-icons/fa";

interface Special {
    raw_text: string;
    created_at?: string;
    updated_at?: string;
    highlighted?: boolean;
    expires_at?: string | null;
    estimated_value?: number;
    monthly_price_discount?: number;
    relevant?: boolean;
    special_type?: string;
    restrictions?: Record<string, any>;
    id?: number;
}

interface EditableSpecialProps {
    propertyid: string;
    listing: {
        property_specials: Special[];
    };
}

export default function EditableSpecial({ propertyid, listing }: EditableSpecialProps) {
    const initialText = listing.property_specials[0]?.raw_text.replace("*", "") || "No specials available";

    const [editing, setEditing] = useState(false);
    const [specialText, setSpecialText] = useState(initialText);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    const handleSave = async () => {
        try {
            const originalSpecial = listing.property_specials[0] || [];

            const updatedSpecial: Special = {
                ...originalSpecial,
                raw_text: specialText,
                updated_at: new Date().toISOString(),
            };

            const response = await axiosInstance.put(`/scrape-list/${propertyid}/specials`, {
                specials: [updatedSpecial],
            });

            console.log("Specials updated successfully:", response.data);

            setEditing(false);
        } catch (error: any) {
            console.error("Failed to update specials:", error?.response?.data || error.message);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        }
    };

    const handleBlur = () => {
        handleSave();
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setSpecialText(e.target.value);
    };

    return (
        <div className="relative group w-full">
            {editing ? (
                <textarea
                    ref={inputRef}
                    value={specialText}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className="w-full text-sm mb-2.5 font-medium text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none resize-none"
                    autoFocus
                />
            ) : (
                <p className="text-sm mb-2.5 font-medium text-gray-800 break-words whitespace-pre-wrap overflow-hidden">
                    {specialText}
                </p>
            )}

            {!editing && (
                <button
                    onClick={() => setEditing(true)}
                    className="absolute top-0 right-0 opacity-60 hover:opacity-100 transition-opacity"
                >
                    <FaPencilAlt size={14} className="text-gray-500" />
                </button>
            )}
        </div>
    );
}
