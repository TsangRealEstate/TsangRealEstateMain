"use client"
import { useAuth } from '@/context/AuthContext';
import { Listing } from '@/types/sharedTypes';
import { formatAvailabilityDate } from '@/utils/dateUtils';
import Link from 'next/link';
import React, { useState } from 'react';
import {
    FaHome,
    FaMapMarkerAlt,
    FaClock,
    FaSearch,
    FaSortAmountDown,
    FaBath,
    FaBed,
    FaCalendarAlt,
    FaExternalLinkAlt,
    FaRulerCombined,
    FaTimes,
} from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';


const ApartmentListings = () => {
    const {
        fetchListings,
        loading,
        error,
        listings,
    } = useAuth();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortBy, setSortBy] = useState<'default' | 'price' | 'date'>('default');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);


    const handleViewDetails = (listing: Listing) => {
        setSelectedListing(listing);
        setModalOpen(true);
        console.log(listing.available_units)
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedListing(null);
    };

    const filteredListings = listings.filter(listing =>
        listing.destinationURL.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedListings = [...filteredListings].sort((a, b) => {
        if (sortBy === 'price') {
            const priceA = a.available_units?.[0]?.price || 0;
            const priceB = b.available_units?.[0]?.price || 0;
            return priceA - priceB;
        } else if (sortBy === 'date') {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        return 0;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getPropertyNameFromUrl = (url: string) => {
        try {
            const pathParts = new URL(url).pathname.split('/');
            return pathParts[pathParts.length - 1]
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        } catch {
            return url;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        San Antonio Apartments
                    </h1>
                    <p className="mt-3 text-xl text-gray-500">
                        Find your perfect home in the heart of Texas
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-8 bg-white p-4 rounded-lg shadow-md lg:w-2/3 mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Search by Name, Url..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <FaSortAmountDown className="h-5 w-5 text-gray-400 mr-2" />
                                <select
                                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'default' | 'price' | 'date')}
                                >
                                    <option value="default">Default</option>
                                    <option value="price">Price (Low to High)</option>
                                    <option value="date">Newest First</option>
                                </select>
                            </div>

                            <button
                                onClick={fetchListings}
                                disabled={loading}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <FiRefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>

                            <Link href={'/filter'} >
                                <button
                                    disabled={loading}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <FaSortAmountDown className="h-5 w-5 text-white mr-2" />
                                    Apply Filters
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Total Listings Count */}
                <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100 lg:w-2/3 mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-blue-800 font-medium mr-2">Total Listings:</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {sortedListings.length}
                            </span>
                        </div>
                        <div className="text-sm text-blue-600">
                            Showing {sortedListings.length} of {listings.length} properties
                        </div>
                    </div>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="rounded-md bg-red-50 p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error fetching listings</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={fetchListings}
                                        className="text-sm font-medium text-red-800 hover:text-red-700"
                                    >
                                        Try again <span aria-hidden="true">&rarr;</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {modalOpen && selectedListing && (
                    <div className="fixed bg-black/15 z-50  inset-0">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 hidden transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0" onClick={closeModal}></div>
                            </div>

                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                    {getPropertyNameFromUrl(selectedListing.destinationURL)}
                                                </h3>
                                                <button
                                                    onClick={closeModal}
                                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                                >
                                                    <FaTimes className="h-5 w-5" />
                                                </button>
                                            </div>

                                            {selectedListing.available_units ? (
                                                <div className="mt-6">
                                                    <h4 className="text-md font-medium text-gray-900 mb-3">
                                                        Available Units ({selectedListing.available_units.reduce((acc, unit) => acc + (unit.units?.length || 0), 0)})
                                                    </h4>
                                                    <div className="grid gap-6 max-h-[400px] overflow-y-auto">
                                                        {/* Filter out units that have no available subunits */}
                                                        {selectedListing.available_units
                                                            .filter(unit => unit.units && unit.units.length > 0)
                                                            // First sort parent units by sqft (smallest to largest)
                                                            .sort((a, b) => a.sqft - b.sqft)
                                                            .map((unit) => (
                                                                <div key={unit.id} className="space-y-3">
                                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                                        {unit.name} - {unit.bed} bed, {unit.bath} bath - {unit.sqft} sqft
                                                                    </h3>
                                                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                                        {unit.units
                                                                            .sort((a, b) => {
                                                                                // First sort by sqft (smallest to largest)
                                                                                const sqftDiff = a.sqft - b.sqft;
                                                                                if (sqftDiff !== 0) return sqftDiff;

                                                                                // If sqft is equal, sort by price
                                                                                const priceDiff = a.price - b.price;
                                                                                if (priceDiff !== 0) return priceDiff;

                                                                                // If both sqft and price are equal, sort by date
                                                                                const dateA = new Date(a.available_on);
                                                                                const dateB = new Date(b.available_on);
                                                                                return dateA.getTime() - dateB.getTime();
                                                                            })
                                                                            .map((subUnit) => (
                                                                                <div
                                                                                    key={`${unit.id}-${subUnit.id}`}
                                                                                    className="border border-blue-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                                                                                >
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
                                                                                        {formatPrice(subUnit.price)}/month
                                                                                    </div>
                                                                                </div>
                                                                            ))}
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
                {!loading && !error && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {sortedListings.length > 0 ? (
                            sortedListings.map((listing) => {
                                const propertyName = getPropertyNameFromUrl(listing.destinationURL);
                                const lowestPrice = listing.available_units?.reduce((min, unit) => {
                                    const unitMin = unit.units.reduce((unitMin, subUnit) =>
                                        Math.min(unitMin, subUnit.price), Infinity);
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
                                                    <h3 className="text-lg leading-6 font-medium text-gray-900">{propertyName}</h3>
                                                    {lowestPrice && !isFinite(lowestPrice) ? (
                                                        <p className="text-sm text-blue-600 font-medium">{formatPrice(lowestPrice)}</p>
                                                    ) : (
                                                        <p className="text-sm text-blue-700">
                                                            {listing.rental_type.charAt(0).toUpperCase() + listing.rental_type.slice(1)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                                    <FaClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                    <p>Updated: {formatDate(listing.updatedAt)}</p>
                                                </div>

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

                                                <Link
                                                    href={`/listings/${listing._id}`}
                                                >
                                                    <button
                                                        type="button"
                                                        className="inline-flex ml-3 items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        disabled={!listing.available_units || listing.available_units.length === 0}
                                                    >
                                                        View Details
                                                        <FaExternalLinkAlt className="ml-2 h-4 w-4" />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        vectorEffect="non-scaling-stroke"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm ? 'Try adjusting your search query' : 'There are currently no listings available'}
                                </p>
                                {searchTerm && (
                                    <div className="mt-6">
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApartmentListings;