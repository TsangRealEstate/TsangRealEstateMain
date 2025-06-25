import React, { useEffect, useState, FormEvent } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

interface PropertyTextFormProps {
    scrapeListId: string;
    propertyTitle?: string;
}

interface PropertyText {
    specialText: string;
    notes: string;
}

const PropertyTextForm: React.FC<PropertyTextFormProps> = ({ scrapeListId }) => {
    const [formData, setFormData] = useState<PropertyText>({
        specialText: '',
        notes: ''
    });
    const [loading, setLoading] = useState(true);
    const { isAdminViewing } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(false);
    const [initialData, setInitialData] = useState<PropertyText | null>(null);

    useEffect(() => {
        const fetchPropertyText = async () => {
            setLoading(true);
            setError('');
            try {
                const { data } = await axiosInstance.get(`/property-text/${scrapeListId}`);
                const newData = {
                    specialText: data?.specialText || '',
                    notes: data?.notes || ''
                };
                setFormData(newData);
                setInitialData(newData);
                if (!data) {
                    setEditing(true);
                }
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setEditing(true); // Start in edit mode for new entries
                } else {
                    setError('Failed to fetch property text. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (scrapeListId) fetchPropertyText();
    }, [scrapeListId]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!formData.specialText.trim()) {
            setError('Special text is required.');
            return;
        }

        setSubmitting(true);

        try {
            const method = initialData ? 'PUT' : 'POST';
            const url = initialData ? `/property-text/${scrapeListId}` : '/property-text';

            const { data } = await axiosInstance({
                method,
                url,
                data: {
                    scrapeListId,
                    ...formData
                }
            });

            setMessage(data.message || 'Saved successfully');
            setInitialData(formData);
            setEditing(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                specialText: '',
                notes: ''
            });
        }
        setEditing(false);
        setError('');
    };


    const canSave = initialData === null
        ? formData.specialText.trim() !== ''
        : initialData.specialText !== formData.specialText ||
        initialData.notes !== formData.notes;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <FaSpinner className="animate-spin" color="#3b82f6" size={20} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border border-gray-200 shadow-sm mt-5">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Special Text
                </h2>

                {isAdminViewing && !editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-md transition"
                    >
                        <FiEdit2 size={14} /> {initialData ? 'Edit' : 'Add Text'}
                    </button>
                )}
            </div>

            {!editing ? (
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Special Text</h3>
                        <div className="mt-1 bg-gray-50 p-3 rounded">
                            <p className="text-gray-700 whitespace-pre-wrap break-words overflow-x-auto max-w-full">
                                {formData.specialText || 'No special text added yet'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Notes</h3>
                        <div className="mt-1 bg-gray-50 p-3 rounded">
                            <p className="text-gray-700 whitespace-pre-wrap break-words overflow-x-auto max-w-full">
                                {formData.notes || 'No notes added yet'}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Text *</label>
                        <textarea
                            name="specialText"
                            rows={4}
                            value={formData.specialText}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter the special text for this property"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            name="notes"
                            rows={3}
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full border border-gray-300  rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add any additional notes"
                        />
                    </div>

                    {(error || message) && (
                        <div className={`p-3 rounded-md ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {error || message}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={submitting}
                            className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition disabled:opacity-50"
                        >
                            <FiX size={16} /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !canSave}
                            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md transition ${canSave
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {submitting ? (
                                <FaSpinner className="animate-spin" size={16} />
                            ) : (
                                <>
                                    <FiSave size={16} /> Save
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PropertyTextForm;