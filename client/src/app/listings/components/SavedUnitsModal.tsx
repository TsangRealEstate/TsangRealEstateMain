'use client';

import axiosInstance from '@/api/axiosInstance';
import { useEffect, useState } from 'react';
import { FaTimes, FaHome, FaBed, FaBath, FaRulerCombined, FaCalendarAlt } from 'react-icons/fa';

interface SavedUnit {
    unitId: string;
    propertyId: string;
    propertyName: string;
    unitName: string;
    price: number;
    sqft: number;
    availableDate: string;
    bed: number;
    bath: number;
}

export default function SavedUnitsModal({ tenantId, onClose, tenantName }: {
    tenantId: string;
    tenantName: string;
    onClose: () => void
}) {
    const [savedUnits, setSavedUnits] = useState<SavedUnit[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'price' | 'sqft'>('price');

    useEffect(() => {
        const fetchSavedUnits = async () => {
            try {
                const response = await axiosInstance.get(`/saved-units/${tenantId}`);
                const data = response.data;
                const allUnits = data.flatMap((doc: any) => doc.selectedUnits);
                setSavedUnits(allUnits);
            } catch (error) {
                console.error('Error fetching saved units:', error);
            } finally {
                setLoading(false);
            }
        };

        if (tenantId) {
            fetchSavedUnits();
        }
    }, [tenantId]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatAvailability = (dateString?: string) => {
        if (!dateString) return 'Available now';
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) {
            return 'Available now';
        }

        return `Available ${date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        })}`;
    };

    // Sort units by selected criteria
    const sortedUnits = [...savedUnits].sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        return a.sqft - b.sqft;
    });

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Saved Units</h2>
                            <p className="text-gray-600 mt-1">For {tenantName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Close modal"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    {/* Sorting controls */}
                    <div className="mt-4 flex space-x-4">
                        <button
                            onClick={() => setSortBy('price')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'price'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Sort by Price
                        </button>
                        <button
                            onClick={() => setSortBy('sqft')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'sqft'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Sort by Size
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-gray-600">Loading your saved units...</p>
                        </div>
                    ) : sortedUnits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FaHome className="text-gray-300 text-4xl mb-4" />
                            <h3 className="text-lg font-medium text-gray-700">No saved units yet</h3>
                            <p className="text-gray-500 mt-1">Units you save will appear here</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {sortedUnits.map((unit) => (
                                <div
                                    key={unit.unitId}
                                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all hover:border-blue-200"
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3 text-white">
                                            <FaHome className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                                                {unit.propertyName}
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                                                {unit.unitName}
                                            </p>

                                            <div className="mt-4 grid grid-cols-2 gap-3">
                                                <div className="flex items-center">
                                                    <FaBed className="text-gray-400 mr-2 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">
                                                        {unit.bed} {unit.bed === 1 ? 'Bed' : 'Beds'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaBath className="text-gray-400 mr-2 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">
                                                        {unit.bath} {unit.bath === 1 ? 'Bath' : 'Baths'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaRulerCombined className="text-gray-400 mr-2 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">
                                                        {unit.sqft} sqft
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaCalendarAlt className="text-gray-400 mr-2 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">
                                                        {formatAvailability(unit.availableDate)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-between items-center">
                                                <span className="text-xl font-bold text-blue-600">
                                                    {formatPrice(unit.price)}
                                                </span>
                                                {sortBy === 'price' && (
                                                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                                                        {unit.price === Math.min(...savedUnits.map(u => u.price)) ? 'Best Value' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 flex justify-between border-t border-gray-200 bg-gray-50 rounded-b-xl">

                    <button
                        onClick={() => alert("This feature is not yet implemented.")}
                        className="w-full lg:w-[30%] py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Send to Client Mail
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full lg:w-[30%] py-2 px-4 bg-red-600 mx-3 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>
    );
}