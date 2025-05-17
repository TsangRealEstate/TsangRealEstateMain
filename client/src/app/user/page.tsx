"use client";
import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import {
    FaHome, FaBed, FaBath, FaRulerCombined,
    FaCalendarAlt, FaExternalLinkAlt
} from 'react-icons/fa';
import Link from 'next/link';

interface SavedUnit {
    unitId: string;
    propertyName: string;
    propertyArea: string;
    unitName: string;
    price: number;
    sqft: number;
    availableDate: string;
    scrapeListId: string;
    _id: string;
    bed: number;
    bath: number;
}

interface PropertyGroup {
    propertyName: string;
    propertyArea: string;
    scrapeListId: string;
    units: SavedUnit[];
}

export default function TenantListingsPage() {
    const [tenantName, setTenantName] = useState('');
    const [userId, setUserId] = useState('');
    const [savedUnits, setSavedUnits] = useState<SavedUnit[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'price' | 'sqft'>('price');

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const tenant = params.get('tenant');
        const id = params.get('userId');

        if (tenant) setTenantName(tenant);
        if (id) setUserId(id);
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchSavedUnits = async () => {
            try {
                const res = await axiosInstance.get(`/saved-units/${userId}`);
                const allUnits = res.data.flatMap((doc: any) => doc.selectedUnits);
                setSavedUnits(allUnits);
            } catch (err) {
                console.error('Error fetching saved units:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedUnits();
    }, [userId]);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);

    const formatAvailability = (dateString?: string) => {
        if (!dateString) return 'Available now';
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) return 'Available now';

        return `Available ${date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        })}`;
    };

    // Group units by scrapeListId (since this is what we use to fetch details)
    const groupedUnits = savedUnits.reduce((acc, unit) => {
        if (!acc[unit.scrapeListId]) {
            acc[unit.scrapeListId] = {
                propertyName: unit.propertyName,
                propertyArea: unit.propertyArea,
                scrapeListId: unit.scrapeListId,
                units: []
            };
        }
        acc[unit.scrapeListId].units.push(unit);
        return acc;
    }, {} as Record<string, PropertyGroup>);

    // Sort units within each property group
    Object.values(groupedUnits).forEach(group => {
        group.units.sort((a, b) =>
            sortBy === 'price' ? a.price - b.price : a.sqft - b.sqft
        );
    });

    // Sort properties alphabetically by area then property name
    const sortedProperties = Object.values(groupedUnits).sort((a, b) => {
        if (a.propertyArea === b.propertyArea) {
            return a.propertyName.localeCompare(b.propertyName);
        }
        return a.propertyArea.localeCompare(b.propertyArea);
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 flex justify-between flex-col lg:flex-row lg:items-center">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Saved Properties for {tenantName}
                        </h1>
                        <div className="flex space-x-4 mt-6 lg:mt-0">
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

                    {/* Content */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
                                <p className="text-gray-600">Loading saved properties...</p>
                            </div>
                        ) : sortedProperties.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FaHome className="text-gray-300 text-4xl mb-4" />
                                <h3 className="text-lg font-medium text-gray-700">No saved properties yet</h3>
                                <p className="text-gray-500 mt-1">Properties will appear here when saved</p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {sortedProperties.map((group) => (
                                    <div key={group.scrapeListId}>
                                        <div className="flex justify-between border-b pb-4 mb-4 flex-col lg:flex-row lg:items-center">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800">
                                                    {group.propertyArea}
                                                </h2>
                                            </div>

                                            <Link href={`/listings/${group.scrapeListId}`}>
                                                <button
                                                    type="button"
                                                    className="inline-flex mt-6 lg:mt-0 items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    View Details
                                                    <FaExternalLinkAlt className="ml-2 h-4 w-4" />
                                                </button>
                                            </Link>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {group.units.map((unit) => (
                                                <div key={unit.unitId} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3 text-white">
                                                            <FaHome className="h-5 w-5" />
                                                        </div>

                                                        <div className="ml-4 flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-800">
                                                                Unit: {unit.unitName}
                                                            </h3>

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
                                                                        {formatAvailability(unit.availableDate)}
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
                </div>
            </div>
        </div>
    );
}