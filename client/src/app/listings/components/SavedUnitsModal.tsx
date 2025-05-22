'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import {
    FaTimes,
    FaHome,
    FaBed,
    FaBath,
    FaRulerCombined,
    FaCalendarAlt,
    FaTrash,
} from 'react-icons/fa';
import { formatAvailabilityDate } from '@/utils/dateUtils';

interface SavedUnit {
    unitId: string;
    propertyId: string;
    propertyName: string;
    propertyArea: string;
    unitName: string;
    price: number;
    sqft: number;
    availableDate: string;
    bed: number;
    bath: number;
}

interface Props {
    tenantId: string;
    tenantName: string;
    onClose: () => void;
}

export default function SavedUnitsModal({ tenantId, tenantName, onClose }: Props) {
    const [savedUnits, setSavedUnits] = useState<SavedUnit[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'price' | 'sqft'>('price');

    useEffect(() => {
        if (!tenantId) return;

        const fetchSavedUnits = async () => {
            try {
                const res = await axiosInstance.get(`/saved-units/${tenantId}`);
                const allUnits = res.data.flatMap((doc: any) => doc.selectedUnits);
                setSavedUnits(allUnits);
            } catch (err) {
                console.error('Error fetching saved units:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedUnits();
    }, [tenantId]);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);


    const sendUnitToTenant = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.post(`/meetings/${tenantId}/send-units`);
            alert(`✅ Successfully sent ${res.data.count} property areas to tenant!`);
        } catch (err: any) {
            console.error('Error sending units to tenant:', err.response?.data || err.message);
            alert(err.response?.data?.error || 'Failed to send units to tenant');
        } finally {
            setLoading(false);
        }
    };

    const sortedUnits = [...savedUnits].sort((a, b) =>
        sortBy === 'price' ? a.price - b.price : a.sqft - b.sqft
    );

    const handleDeleteUnit = async (unitId: string) => {
        if (!window.confirm('Are you sure you want to remove this unit?')) return;

        try {
            await axiosInstance.delete(`/saved-units/${tenantId}`, {
                data: { unitIds: [unitId] }
            });

            setSavedUnits(prevUnits => prevUnits.filter(unit => unit.unitId !== unitId));
        } catch (err) {
            console.error('Error deleting unit:', err);
            alert('Failed to delete unit. Please try again.');
        }
    };

    const groupedUnits = sortedUnits.reduce<Record<string, SavedUnit[]>>((acc, unit) => {
        acc[unit.propertyArea] = acc[unit.propertyArea] || [];
        acc[unit.propertyArea].push(unit);
        return acc;
    }, {});

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
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
                            <FaTimes size={24} />
                        </button>
                    </div>

                    {/* Sorting controls */}
                    <div className="mt-4 flex space-x-4">
                        {['price', 'sqft'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSortBy(type as 'price' | 'sqft')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === type
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Sort by {type === 'price' ? 'Price' : 'Size'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
                            <p className="text-gray-600">Loading your saved units...</p>
                        </div>
                    ) : sortedUnits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FaHome className="text-gray-300 text-4xl mb-4" />
                            <h3 className="text-lg font-medium text-gray-700">No saved units yet</h3>
                            <p className="text-gray-500 mt-1">Units you save will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries(groupedUnits).map(([area, units]) => (
                                <div key={area}>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{area}</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {units.map((unit) => (
                                            <div
                                                key={unit.unitId}
                                                className="border relative border-gray-200 rounded-xl p-5 hover:shadow-md transition-all hover:border-blue-200"
                                            >
                                                <button
                                                    onClick={() => handleDeleteUnit(unit.unitId)}
                                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Remove unit"
                                                    aria-label="Remove unit"
                                                >
                                                    <FaTrash className="h-4 w-4" />
                                                </button>

                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3 text-white">
                                                        <FaHome className="h-6 w-6" />
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                                                            {unit.propertyName}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm mt-1 line-clamp-1">{unit.unitName}</p>

                                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                                            <div className="flex items-center">
                                                                <FaBed className="text-gray-400 mr-2" />
                                                                <span className="text-sm text-gray-700">
                                                                    {unit.bed} {unit.bed === 1 ? 'Bed' : 'Beds'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <FaBath className="text-gray-400 mr-2" />
                                                                <span className="text-sm text-gray-700">
                                                                    {unit.bath} {unit.bath === 1 ? 'Bath' : 'Baths'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <FaRulerCombined className="text-gray-400 mr-2" />
                                                                <span className="text-sm text-gray-700">{unit.sqft} sqft</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <FaCalendarAlt className="text-gray-400 mr-2" />
                                                                <span className="text-sm text-gray-700">
                                                                    Available: {formatAvailabilityDate(unit.availableDate)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 flex justify-between items-center">
                                                            <span className="text-xl font-bold text-blue-600">
                                                                {formatPrice(unit.price)}
                                                            </span>
                                                            {sortBy === 'price' &&
                                                                unit.price === Math.min(...savedUnits.map((u) => u.price)) && (
                                                                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                                                                        Best Value
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 flex justify-between border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    {
                        Object.keys(groupedUnits).length > 0 && (
                            <button
                                onClick={sendUnitToTenant}
                                disabled={loading}
                                className="w-full lg:w-[30%] py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                {loading ? 'Sending...' : 'Send Units to Client Mail'}
                            </button>
                        )
                    }

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
