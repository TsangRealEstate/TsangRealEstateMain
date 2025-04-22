"use client"
import axiosInstance from '@/api/axiosInstance';
import React, { useState, useEffect } from 'react';
import {
    FaHome,
    FaMapMarkerAlt,
    FaClock,
    FaSearch,
    FaSortAmountDown
} from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';

interface Listing {
    _id: string;
    name: string;
    address: string;
    price: string;
    image: string;
    scrapedAt: string;
}

const ApartmentListings = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortBy, setSortBy] = useState<'default' | 'price' | 'date'>('default');

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get('/listings');
            setListings(response.data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };
    const filteredListings = listings.filter(listing =>
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedListings = [...filteredListings].sort((a, b) => {
        if (sortBy === 'price') {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
            const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
            return priceA - priceB;
        } else if (sortBy === 'date') {
            return new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime();
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
                <div className="mb-8 bg-white p-4 rounded-lg shadow-md lg:w-2/3  mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Search by name or address..."
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
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <FiRefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Total Listings Count */}
                <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100 lg:w-2/3  mx-auto">
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

                {/* Listings Grid */}
                {!loading && !error && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {sortedListings.length > 0 ? (
                            sortedListings.map((listing) => (
                                <div key={listing._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                                <FaHome className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">{listing.name}</h3>
                                                <p className="text-sm text-blue-600 font-medium">{listing.price}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <p>{listing.address}</p>
                                            </div>

                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <FaClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <p>ScrapedAt: {formatDate(listing.scrapedAt)}</p>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
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