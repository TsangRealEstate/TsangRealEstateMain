import axiosInstance from '@/api/axiosInstance';
import { useState } from 'react';
import { FaTimes, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

interface AddPropertyEmailModalProps {
    listingId: string;
    onClose: () => void;
    onSuccess: () => void;
    listingName: string;
}

const AddPropertyEmailModal = ({ listingId, onClose, onSuccess, listingName }: AddPropertyEmailModalProps) => {
    const [email, setEmail] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await axiosInstance.post('/property-emails', {
                email,
                scrapeListId: listingId,
                scrapeListName: listingName,
            });
            setSuccess(true);
            onSuccess();
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add email');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/15 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-fit">
                <div className="flex justify-between items-center border-b p-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FaEnvelope className="text-blue-500" />
                        Add Property Email for {listingName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 ml-5 hover:text-gray-700"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-6">
                            <div className="text-green-500 mb-2">
                                <FaPaperPlane className="inline-block text-3xl" />
                            </div>
                            <p className="font-medium">Email added successfully!</p>
                            <p className="text-sm text-gray-500 mt-1">This window will close shortly.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    placeholder="owner@example.com"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        'Adding...'
                                    ) : (
                                        <>
                                            <FaPaperPlane /> Add Email
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddPropertyEmailModal;