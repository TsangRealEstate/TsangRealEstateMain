import { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiResponse, ListingFormData } from '@/types/sharedTypes';
import axiosInstance from '@/api/axiosInstance';

interface AddListingModalProps {
    onClose: () => void;
    onSuccess: (response: ApiResponse) => void;
}

export default function AddListingModal({ onClose, onSuccess }: AddListingModalProps) {
    const [formData, setFormData] = useState<ListingFormData>({
        title: '',
        destinationURL: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await axiosInstance.post<ApiResponse>('/scrape-list', formData);
            onSuccess(response.data);
            onClose();
        } catch (err) {
            const error = err as AxiosError<ApiResponse>;
            setError(error.response?.data?.message || 'Failed to add listing');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add New Listing</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 text-4xl hover:text-gray-700"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title (Optional)
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="E.g., San Antonio Luxury Apartments"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="destinationURL" className="block text-sm font-medium text-gray-700 mb-1">
                            Listing URL *
                        </label>
                        <input
                            type="url"
                            id="destinationURL"
                            name="destinationURL"
                            value={formData.destinationURL}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://www.apartmentlist.com/tx/san-antonio/..."
                            pattern="https:\/\/www\.apartmentlist\.com\/.+"
                            title="Must be a valid ApartmentList.com URL"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Must be a valid ApartmentList.com URL
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            disabled={isSubmitting || !formData.destinationURL}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}