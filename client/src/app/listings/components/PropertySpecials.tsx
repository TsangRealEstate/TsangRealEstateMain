import { useState } from 'react';
import axiosInstance from '@/api/axiosInstance';

// TypeScript interfaces
interface Restriction {
    bed_count?: number[];
    lease_length?: number[][];
}

interface Special {
    _id?: string;
    raw_text: string;
    restrictions?: Restriction;
    created_at: string;
    updated_at: string;
    expires_at?: string;
}

interface PropertyInformation {
    specials?: Special[];
}

interface Property {
    _id: string;
    Information: PropertyInformation;
}
interface PropertySpecialsProps {
    property: Property;
    onUpdate: (updatedSpecials: Special[]) => void;
}

const PropertySpecials = ({ property, onUpdate }: PropertySpecialsProps) => {
    const [editing, setEditing] = useState(false);
    const [specials, setSpecials] = useState<Special[]>(property.Information.specials || []);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const toggleEdit = () => setEditing(!editing);


    const handleCancel = () => {
        setSpecials(property.Information.specials || []);
        setEditing(false);
        setError(null);
    };


    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const response = await axiosInstance.put(
                `/scrape-list/${property._id}/specials`,
                { specials }
            );

            onUpdate(response.data.data);
            setEditing(false);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to save specials");
            console.error("Error saving specials:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSpecialChange = (index: number, field: keyof Special, value: any) => {
        setSpecials(prev => prev.map((special, i) =>
            i === index ? { ...special, [field]: value } : special
        ));
    };


    const handleRestrictionChange = (index: number, field: keyof Restriction, value: any) => {
        setSpecials(prev => prev.map((special, i) =>
            i === index ? {
                ...special,
                restrictions: {
                    ...special.restrictions,
                    [field]: value
                }
            } : special
        ));
    };

    const addNewSpecial = () => {
        setSpecials(prev => [
            ...prev,
            {
                raw_text: "",
                restrictions: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ]);
    };


    const removeSpecial = (index: number) => {
        setSpecials(prev => prev.filter((_, i) => i !== index));
    };


    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-blue-800 flex items-center">
                    Current Specials
                </h4>

                {!editing ? (
                    <button
                        onClick={toggleEdit}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Specials
                    </button>
                ) : (
                    <div className="flex space-x-2">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition-colors"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-800 text-sm rounded-md">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {specials.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                        No specials currently available
                    </div>
                ) : (
                    specials.map((special, index) => (
                        <div key={special._id || index} className="border border-blue-100 rounded-lg p-4 bg-white">
                            <div className="flex items-start">
                                {editing && (
                                    <button
                                        onClick={() => removeSpecial(index)}
                                        className="mr-3 mt-0.5 text-red-500 hover:text-red-700 transition-colors"
                                        title="Remove special"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}

                                <div className="flex-1 min-w-0">
                                    {editing ? (
                                        <textarea
                                            value={special.raw_text}
                                            onChange={(e) => handleSpecialChange(index, 'raw_text', e.target.value)}
                                            className="w-full p-3 border border-blue-200 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter special description"
                                            rows={3}
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-gray-800 break-words whitespace-pre-wrap overflow-hidden">
                                            {special.raw_text || <span className="text-gray-400">No description</span>}
                                        </p>
                                    )}

                                    {/* Restrictions Section */}
                                    {(special.restrictions && (Object.keys(special.restrictions).length > 0 || editing)) && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <h5 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                Restrictions
                                            </h5>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {editing ? (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bed Count</label>
                                                            <input
                                                                type="text"
                                                                value={special.restrictions.bed_count?.join(', ') || ''}
                                                                onChange={(e) => handleRestrictionChange(
                                                                    index,
                                                                    'bed_count',
                                                                    e.target.value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x))
                                                                )}
                                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="0,1,2 (Studio, 1 bed, etc)"
                                                            />
                                                            <p className="mt-1 text-xs text-gray-500">Comma separated numbers (0=Studio)</p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Lease Length (months)</label>
                                                            <input
                                                                type="text"
                                                                value={special.restrictions.lease_length?.flat().join(', ') || ''}
                                                                onChange={(e) => handleRestrictionChange(
                                                                    index,
                                                                    'lease_length',
                                                                    [e.target.value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x))]
                                                                )}
                                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="12,24"
                                                            />
                                                            <p className="mt-1 text-xs text-gray-500">Comma separated numbers</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {special.restrictions.bed_count && (
                                                            <div>
                                                                <p className="text-sm text-gray-700">
                                                                    <span className="font-medium">Bed Count:</span> {special.restrictions.bed_count.map(b => b === 0 ? 'Studio' : `${b} bed`).join(', ')}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {special.restrictions.lease_length && (
                                                            <div>
                                                                <p className="text-sm text-gray-700">
                                                                    <span className="font-medium">Lease Length:</span> {special.restrictions.lease_length.flat().map(l => `${l} months`).join(', ')}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Dates Section */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            {/* {special.created_at && (
                                                <div className={editing ? 'hidden' : ''}>
                                                    <p className="text-gray-500">Created</p>
                                                    <p className="text-gray-800 font-medium">{formatDate(special.created_at)}</p>
                                                </div>
                                            )} */}

                                            <div>
                                                <p className="text-gray-500">Updated</p>
                                                {editing ? (
                                                    <input
                                                        type="date"
                                                        value={new Date(special.updated_at).toISOString().split('T')[0]}
                                                        onChange={(e) => handleSpecialChange(index, 'updated_at', e.target.value)}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                ) : (
                                                    <p className="text-gray-800 font-medium">{formatDate(special.updated_at)}</p>
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-gray-500">Expires</p>
                                                {editing ? (
                                                    <input
                                                        type="date"
                                                        value={special.expires_at ? new Date(special.expires_at).toISOString().split('T')[0] : ''}
                                                        onChange={(e) => handleSpecialChange(index, 'expires_at', e.target.value || undefined)}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                ) : (
                                                    <p className="text-gray-800 font-medium">{formatDate(special.expires_at)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {editing && (
                    <button
                        onClick={addNewSpecial}
                        className="flex items-center justify-center w-full py-2 border-2 border-dashed border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Special
                    </button>
                )}
            </div>
        </div>
    );
};

export default PropertySpecials;