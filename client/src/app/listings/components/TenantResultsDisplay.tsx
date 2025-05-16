'use client';

import { useEffect, useState } from 'react';
import { FaBed, FaBath, FaRulerCombined, FaCalendarAlt, FaHome, FaClock } from 'react-icons/fa';

interface Unit {
    id: number;
    name: string;
    display_name?: string;
    bed: number;
    bath: number;
    sqft: number;
    sqft_max?: number;
    price: number;
    price_max?: number;
    available_on?: string;
    photos?: Array<{
        type: string;
        id: string;
        caption?: string | null;
    }>;
    units?: Array<{
        id: number;
        name: string;
        display_name: string;
        price: number;
        sqft: number;
        available_on?: string;
    }>;
}

interface Listing {
    _id: string;
    display_name: string;
    street_address: string;
    available_units: Unit[];
    updatedAt?: string;
}

export default function TenantResultsDisplay({
    tenantName
}: {
    tenantName: string;
}) {
    const [results, setResults] = useState<{
        count: number;
        listings: Listing[];
        tenantId?: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUnits, setSelectedUnits] = useState<Array<{
        unitId: string;
        propertyId: string;
        propertyName: string;
        unitName: string;
        price: number;
        sqft: number;
        availableDate: string;
    }>>([]);

    useEffect(() => {
        const savedResults = localStorage.getItem('tenantResults');
        if (savedResults) {
            setResults(JSON.parse(savedResults));
            console.log(savedResults);
        }
        setLoading(false);
    }, []);

    const handleViewDetails = (listing: Listing) => {
        setSelectedListing(listing);
        setModalOpen(true);
        setSelectedUnits([])
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedListing(null);
    };

    const handleUnitSelection = (unit: Unit['units'][0], propertyId: string, propertyName: string) => {
        setSelectedUnits(prev => {
            const unitId = `${propertyId}-${unit.id}`;
            const isSelected = prev.some(u => u.unitId === unitId);

            if (isSelected) {
                return prev.filter(u => u.unitId !== unitId);
            } else {
                return [
                    ...prev,
                    {
                        unitId,
                        propertyId,
                        propertyName,
                        unitName: unit.display_name || unit.name,
                        price: unit.price,
                        sqft: unit.sqft,
                        availableDate: unit.available_on || ''
                    }
                ];
            }
        });
    };

    const handleSaveSelected = () => {
        if (selectedUnits.length === 0) {
            alert('Please select at least one unit');
            return;
        }

        const savedData = {
            tenantId: results?.tenantId,
            tenantName,
            selectedUnits,
            timestamp: new Date().toISOString()
        };

        console.log('Saved units:', savedData);
        // Here you would typically send this data to your backend
        alert(`${selectedUnits.length} units saved successfully!`);
        closeModal();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const formatAvailabilityDate = (dateString?: string) => {
        if (!dateString) return 'Available now';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div>Loading results...</div>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="container mx-auto p-4">
                <p>No results found for this tenant.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">
                {results.count} Results for {tenantName}
            </h1>

            {/* Modal for viewing unit details */}
            {modalOpen && selectedListing && (
                <div className="fixed bg-black/15 z-50 inset-0">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 hidden transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0" onClick={closeModal}></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle lg:w-4xl w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 sm:mt-0 sm:text-left w-full">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                {selectedListing.display_name}
                                            </h3>
                                            <button
                                                onClick={closeModal}
                                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                            >
                                                <span className="sr-only">Close</span>
                                                <span className="h-6 w-6">×</span>
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{selectedListing.street_address}</p>

                                        {selectedListing.available_units ? (
                                            <div className="mt-6">
                                                <h4 className="text-md font-medium text-gray-900 mb-3">
                                                    Available Units
                                                    {selectedListing.available_units.reduce((acc, unit) => acc + (unit.units?.length || 0), 0)}
                                                    {selectedUnits.length > 0 && (
                                                        <span className="ml-2 text-sm text-blue-600">
                                                            ({selectedUnits.length} selected)
                                                        </span>
                                                    )}
                                                </h4>
                                                <div className="grid gap-6 max-h-[400px] overflow-y-auto">
                                                    {selectedListing.available_units
                                                        .filter(unit => unit.units && unit.units.length > 0)
                                                        .sort((a, b) => a.sqft - b.sqft)
                                                        .map((unit) => (
                                                            <div key={unit.id} className="space-y-3">
                                                                <h3 className="text-lg font-semibold text-gray-900">
                                                                    {unit.name} - {unit.bed} bed, {unit.bath} bath - {unit.sqft} sqft
                                                                </h3>
                                                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                                    {(unit.units ?? [])
                                                                        .sort((a, b) => {
                                                                            const sqftDiff = a.sqft - b.sqft;
                                                                            if (sqftDiff !== 0) return sqftDiff;
                                                                            const priceDiff = a.price - b.price;
                                                                            if (priceDiff !== 0) return priceDiff;
                                                                            const dateA = new Date(a.available_on || '');
                                                                            const dateB = new Date(b.available_on || '');
                                                                            return dateA.getTime() - dateB.getTime();
                                                                        })
                                                                        .map((subUnit) => {
                                                                            const unitId = `${selectedListing._id}-${subUnit.id}`;
                                                                            const isSelected = selectedUnits.some(u => u.unitId === unitId);

                                                                            return (
                                                                                <div
                                                                                    key={`${unit.id}-${subUnit.id}`}
                                                                                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                                                                                    onClick={() => handleUnitSelection(subUnit, selectedListing._id, selectedListing.display_name)}
                                                                                >
                                                                                    <div className="flex items-start">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={isSelected}
                                                                                            onChange={() => handleUnitSelection(subUnit, selectedListing._id, selectedListing.display_name)}
                                                                                            className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                                            onClick={(e) => e.stopPropagation()}
                                                                                        />
                                                                                        <div className="ml-2">
                                                                                            <p className="text-sm text-gray-500 mb-2">Unit {subUnit.display_name || subUnit.name}</p>

                                                                                            <div className="flex items-center text-sm text-gray-600 mb-1">
                                                                                                <FaBed className="mr-2 text-gray-400" />
                                                                                                {unit.bed} {unit.bed === 1 ? 'bed' : 'beds'}
                                                                                            </div>
                                                                                            <div className="flex items-center text-sm text-gray-600 mb-1">
                                                                                                <FaBath className="mr-2 text-gray-400" />
                                                                                                {unit.bath} {unit.bath === 1 ? 'bath' : 'baths'}
                                                                                            </div>
                                                                                            <div className="flex items-center text-sm text-gray-600 mb-1">
                                                                                                <FaRulerCombined className="mr-2 text-gray-400" />
                                                                                                {subUnit.sqft} sqft
                                                                                            </div>
                                                                                            <div className="flex items-center text-sm text-gray-600">
                                                                                                <FaCalendarAlt className="mr-2 text-gray-400" />
                                                                                                Available: {formatAvailabilityDate(subUnit.available_on)}
                                                                                            </div>
                                                                                            <div className="mt-3 font-medium text-blue-600">
                                                                                                {formatPrice(subUnit.price)}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-6 bg-yellow-50 p-4 rounded-md">
                                                <p className="text-yellow-700">No available units found for this property</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleSaveSelected}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Save Selected
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Listings Grid */}
            {results.listings.length === 0 ? (
                <p>No matching properties found.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {results.listings.map((listing) => {
                        const lowestPrice = listing.available_units?.reduce((min, unit) => {
                            const unitMin = unit.units?.reduce((unitMin, subUnit) =>
                                Math.min(unitMin, subUnit.price), Infinity) || Infinity;
                            return Math.min(min, unitMin);
                        }, Infinity);

                        return (
                            <div key={listing._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                            <FaHome className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">{listing.display_name}</h3>
                                            <p className="text-sm text-gray-500">{listing.street_address}</p>
                                            {isFinite(lowestPrice) && (
                                                <p className="text-sm text-blue-600 font-medium mt-1">
                                                    From {formatPrice(lowestPrice)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        {listing.updatedAt && (
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <FaClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <p>Updated: {formatDate(listing.updatedAt)}</p>
                                            </div>
                                        )}

                                        {listing.available_units && (
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {listing.available_units.reduce((acc, unit) => acc + (unit.units?.length || 0), 0)} units
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5">
                                        <button
                                            onClick={() => handleViewDetails(listing)}
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            disabled={!listing.available_units || listing.available_units.length === 0}
                                        >
                                            View Units
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}