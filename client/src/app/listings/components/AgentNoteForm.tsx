import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { FiSave, FiX } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

interface AgentNoteFormProps {
    tenantId: string;
    scrapeListId: string;
    propertyArea: string;
    onClose: () => void;
}

const AgentNoteForm: React.FC<AgentNoteFormProps> = ({
    tenantId,
    scrapeListId,
    propertyArea,
    onClose
}) => {
    const [note, setNote] = useState('');
    const [existingNote, setExistingNote] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExistingNote = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(
                    `/agent-notes/${tenantId}/${scrapeListId}`
                );
                if (response.data.length > 0) {
                    setExistingNote(response.data[0]);
                    setNote(response.data[0].propertyNote);
                }
            } catch (err) {
                console.error('Error fetching note:', err);
                setError('Failed to load existing note');
            } finally {
                setLoading(false);
            }
        };

        fetchExistingNote();
    }, [tenantId, scrapeListId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setMessage('');

        try {
            const payload = {
                tenantId,
                scrapeListId,
                propertyArea,
                propertyNote: note
            };

            const response = existingNote
                ? await axiosInstance.put(`/agent-notes/${existingNote._id}`, payload)
                : await axiosInstance.post('/agent-notes', payload);

            setMessage(response.data.message || 'Note saved successfully');
            setExistingNote(response.data.data);
            setTimeout(() => setMessage(''), 3000);
        } catch (err: any) {
            console.error('Error saving note:', err);
            setError(err.response?.data?.error || 'Failed to save note');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!existingNote) return;

        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/agent-notes/${existingNote._id}`);
            setMessage('Note deleted successfully');
            setExistingNote(null);
            setNote('');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err: any) {
            console.error('Error deleting note:', err);
            setError(err.response?.data?.error || 'Failed to delete note');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <FaSpinner className="animate-spin text-blue-500" size={24} />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Area
                </label>
                <p className="text-gray-900 font-medium">{propertyArea}</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note *
                </label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={5}
                    placeholder="Enter your notes about this property..."
                    required
                />
            </div>

            {(error || message) && (
                <div className={`p-3 rounded-md ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {error || message}
                </div>
            )}

            <div className="flex justify-between items-center pt-2">
                <div>
                    {existingNote && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Delete Note
                        </button>
                    )}
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition disabled:opacity-50"
                    >
                        <FiX size={16} /> Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || !note.trim()}
                        className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md transition ${note.trim()
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
            </div>
        </form>
    );
};

export default AgentNoteForm;