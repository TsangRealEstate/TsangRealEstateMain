"use client"
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import FloorPlanGallery from './FloorPlanGallery';
import axiosInstance from '@/api/axiosInstance';
import { formatAvailabilityDate } from '@/utils/dateUtils';
interface Photo {
    type: string;
    id: string;
    caption: string | null;
}

interface SpecificUnit {
    id: number;
    remote_listing_id: string;
    name: string;
    display_name: string;
    price: number;
    price_max: number;
    sqft: number;
    availability: string;
    available_on: string;
    unit_rental_id: string;
    updated_at: string;
    apply_online_url: string | null;
}

interface Property {
    id: number;
    remote_listing_id: string;
    name: string;
    bed: number;
    bath: number;
    sqft: number;
    sqft_max: number;
    price: number;
    price_max: number;
    photos: Photo[];
    units: SpecificUnit[];
}

interface PropertyInformation {
    available_units: Property[];
    city: string;
    display_name: string;
    neighborhood: string;
    state: string;
    street_address: string;
    zip: string;
    description: string | null;
    first_photo: { id: string }[];
    destinationURL: string;
    _id: string;
    prices: Record<string, number[]>;
    specials?: Array<{
        raw_text: string;
        restrictions?: {
            bed_count?: number[];
            lease_length?: number[][];
        };
        created_at?: string;
        updated_at?: string;
        expires_at?: string;
    }>;
}

interface PropertyData {
    count: number;
    data: Array<{
        _id: string;
        title: string;
        destinationURL: string;
        Information: PropertyInformation;
    }>;
}

export default function FilterComp() {
    const { neighborhoods } = useAuth();
    const [filters, setFilters] = useState({
        area: [] as string[],
        minPrice: '',
        maxPrice: '',
        beds: '',
        baths: '',
        earliestMoveInDate: "",
        latestMoveInDate: "",
        amenities: [] as string[],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState<PropertyData | null>(null);
    const [isUnitsModalOpen, setIsUnitsModalOpen] = useState(false);

    const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setFilters({ ...filters, area: options });
    };

    const handleAmenityToggle = (amenity: string) => {
        setFilters(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleDateChange = (value: string, field: string) => {
        setFilters({ ...filters, [field]: value });
    };

    const handleClearFilters = () => {
        setFilters({
            area: [],
            minPrice: '',
            maxPrice: '',
            beds: '',
            baths: '',
            earliestMoveInDate: "",
            latestMoveInDate: "",
            amenities: [],
        });
    };

    const handleApplyFilters = async () => {
        try {
            setLoading(true);
            setError('');

            // Prepare query parameters
            const params = new URLSearchParams();

            // Add price filters
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

            // Add beds and baths
            if (filters.beds) params.append('beds', filters.beds);
            if (filters.baths) params.append('baths', filters.baths);

            // Convert DateValueType to date strings
            if (filters.earliestMoveInDate) {
                const rawDate = filters.earliestMoveInDate;
                const date = new Date(typeof rawDate === 'string' ? rawDate : (rawDate as Date).toISOString());
                params.append('earliestMoveInDate', date.toISOString().split('T')[0]);
            }

            if (filters.latestMoveInDate) {
                const rawDate = filters.latestMoveInDate;
                const date = new Date(typeof rawDate === 'string' ? rawDate : (rawDate as Date).toISOString());
                params.append('latestMoveInDate', date.toISOString().split('T')[0]);
            }


            // Add amenities
            if (filters.amenities.includes('In-unit Laundry')) params.append('inUnitLaundry', 'true');
            if (filters.amenities.includes('Balcony')) params.append('balcony', 'true');
            if (filters.amenities.includes('Yard')) params.append('yard', 'true');

            // Add areas (joined with &)
            if (filters.area.length > 0) {
                params.append('area', filters.area.join('&'));
            }

            // Make API call
            const response = await axiosInstance.get('/scrape-list/filter', {
                params
            });

            //console.log('Filtered results:', response.data);
            setResults(response.data);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Filter error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getPhotoUrl = (propertyId: string) => {
        return `https://cdn.apartmentlist.com/image/upload/c_fill,dpr_auto,f_auto,g_center,h_415,q_auto,w_640/${propertyId}.jpg`;
    };
    const router = useRouter();
    return (
        <div className="p-6 bg-white my-6">
            <div className='lg:w-[50%] mx-auto'>
                <button
                    onClick={() => router.back()}
                    className="mb-10 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                    <AiOutlineArrowLeft />
                    Go Back
                </button>
            </div>

            <h2 className="text-xl font-bold mb-6 lg:w-[50%] mx-auto text-gray-800">FILTER PROPERTIES</h2>

            <section className='filter-properties-functionality lg:not-last:w-[50%] mx-auto'>
                {/* Area Filter - Improved dropdown */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Neighborhoods/Area</label>
                    <div className="">
                        <select
                            multiple
                            value={filters.area}
                            onChange={handleAreaChange}
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"

                        >
                            {neighborhoods.map(neighborhood => (
                                <option
                                    key={neighborhood}
                                    value={neighborhood}
                                    className="p-2 hover:bg-blue-50 checked:bg-blue-100 mb-2.5"
                                >
                                    {neighborhood}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Hold Ctrl/Cmd to select multiple areas
                    </p>
                </div>

                {/* Price Range - Improved layout */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range ($)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={filters.minPrice}
                                    onChange={handleInputChange}
                                    className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="1500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={filters.maxPrice}
                                    onChange={handleInputChange}
                                    className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="2000"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Beds & Baths - Improved layout */}
                <div className="mb-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                            <select
                                name="beds"
                                value={filters.beds}
                                onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                            <select
                                name="baths"
                                value={filters.baths}
                                onChange={(e) => setFilters({ ...filters, baths: e.target.value })}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Move-in Dates - Improved styling */}
                <div className="mb-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Earliest Move-in</label>
                            <input
                                type="date"
                                value={filters.earliestMoveInDate}
                                onChange={(e) => handleDateChange(e.target.value, 'earliestMoveInDate')}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Select date"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Latest Move-in</label>
                            <input
                                type="date"
                                value={filters.latestMoveInDate}
                                onChange={(e) => handleDateChange(e.target.value, 'latestMoveInDate')}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Select date"
                            />
                        </div>
                    </div>
                </div>

                {/* Amenities - Improved styling */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-3">
                        {['In-unit Laundry', 'Balcony', 'Yard'].map(amenity => (
                            <button
                                key={amenity}
                                type="button"
                                onClick={() => handleAmenityToggle(amenity)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.amenities.includes(amenity)
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {amenity}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons - Improved styling */}
                <div className="flex justify-between gap-4">
                    <button
                        onClick={handleClearFilters}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Clear All
                    </button>
                    <button
                        onClick={handleApplyFilters}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition-colors ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Applying Filters...
                            </span>
                        ) : (
                            'Show Results'
                        )}
                    </button>
                </div>

            </section>

            <section className='result-data lg:w-[80%] mx-auto'>
                {/* Results Section */}
                {loading && (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {results && (
                    <div>
                        <h2 className="text-xl font-bold my-6 text-gray-800">
                            {results.count} {results.count === 1 ? 'Property' : 'Properties'} Found
                        </h2>

                        <div className="space-y-6 lg:grid-cols-2 items-start gap-y-[20px] gap-x-[50px] grid">
                            {results.data.map((propertyGroup, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                                    {/* Property Header with Photo */}
                                    <div className="relative">
                                        <img
                                            src={propertyGroup.Information.first_photo[0]?.id
                                                ? getPhotoUrl(propertyGroup.Information.first_photo[0].id)
                                                : '/tsangbgimageherosection.avif'}

                                            alt={propertyGroup.Information.display_name}
                                            className="w-full h-64 object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x415?text=No+Image+Available';
                                            }}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                            <h3 className="text-xl font-bold text-white">
                                                {propertyGroup.Information.display_name}
                                            </h3>
                                            <p className="text-white/90">
                                                {propertyGroup.Information.neighborhood}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="p-6">
                                        <div className="flex justify-between flex-col mb-4">
                                            <div>
                                                <p className="text-gray-600">
                                                    {propertyGroup.Information.street_address}, {propertyGroup.Information.city}, {propertyGroup.Information.state} {propertyGroup.Information.zip}
                                                </p>
                                            </div>

                                            <span className='mt-2'>
                                                <Link
                                                    href={`/listings/${propertyGroup._id}`}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                >
                                                    View Details
                                                </Link>

                                                <button
                                                    onClick={() => setIsUnitsModalOpen(true)}
                                                    className="px-4 py-2 ml-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                                >
                                                    View Filtered Units
                                                </button>
                                            </span>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-800 mb-2">Market Rent</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {Object.entries(propertyGroup.Information.prices).map(([bedCount, prices]) => (
                                                    <div key={bedCount} className="border border-gray-200 p-3 rounded">
                                                        <p className="font-medium">
                                                            {bedCount === '0' ? 'Studio' : `${bedCount} Bedroom`}
                                                        </p>
                                                        <p className="text-gray-600">
                                                            ${Math.min(...prices)} - ${Math.max(...prices)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            {propertyGroup.Information.specials && propertyGroup.Information.specials.length > 0 && (
                                                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                    <h4 className="font-medium text-blue-800 mb-2">Current Specials:</h4>
                                                    <div className="space-y-3">
                                                        {propertyGroup.Information.specials.map((special, index) => (
                                                            <div key={index} className="border-b border-blue-100 pb-3 last:border-0 last:pb-0">
                                                                <div className="flex items-start">
                                                                    <div className="ml-3 flex-1">
                                                                        <p className="text-sm font-medium text-blue-800">{special.raw_text}</p>

                                                                        {/* Restrictions */}
                                                                        {special.restrictions && (
                                                                            <div className="mt-2">
                                                                                <h5 className="text-xs font-medium text-blue-700 mb-1">Restrictions:</h5>
                                                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                                                    {special.restrictions.bed_count && (
                                                                                        <div>
                                                                                            <span className="text-blue-600">Bed Count:</span>
                                                                                            <span className="ml-1 text-blue-800">
                                                                                                {special.restrictions.bed_count.map(b => b === 0 ? 'Studio' : `${b} bed`).join(', ')}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                    {special.restrictions.lease_length && (
                                                                                        <div>
                                                                                            <span className="text-blue-600">Lease Length:</span>
                                                                                            <span className="ml-1 text-blue-800">
                                                                                                {special.restrictions.lease_length.flat().map(l => `${l} months`).join(', ')}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Dates */}
                                                                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                                            {special.updated_at && (
                                                                                <div>
                                                                                    <span className="text-blue-600">Updated:</span>
                                                                                    <span className="ml-1 text-blue-800">
                                                                                        {new Date(special.updated_at).toLocaleDateString()}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {special.expires_at && (
                                                                                <div className="col-span-2">
                                                                                    <span className="text-blue-600">Expires:</span>
                                                                                    <span className="ml-1 text-blue-800">
                                                                                        {new Date(special.expires_at).toLocaleDateString()}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Units Modal */}
                                        {isUnitsModalOpen && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
                                                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                                                    {/* Modal Header */}
                                                    <div className="flex justify-between items-center border-b border-gray-200 p-4">
                                                        <h3 className="text-lg font-semibold">
                                                            Available Units ({propertyGroup.Information.available_units.length})
                                                        </h3>
                                                        <button
                                                            onClick={() => setIsUnitsModalOpen(false)}
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>


                                                    <div className="p-4 overflow-y-auto max-h-[calc(90vh-60px)]">
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {propertyGroup.Information.available_units.map((unit) => (
                                                                <div key={unit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                                    {/* Unit Header */}
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <div>
                                                                            <h5 className="font-medium text-gray-800">Floor Name: {unit.name}</h5>
                                                                            <p className="text-sm text-gray-600">
                                                                                {unit.bed} {unit.bed === 1 ? 'bed' : 'beds'}, {unit.bath} {unit.bath === 1 ? 'bath' : 'baths'} • {unit.sqft?.toLocaleString()} sqft
                                                                            </p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            {unit.price && (
                                                                                <p className="font-medium text-gray-800">
                                                                                    ${unit.price.toLocaleString()}
                                                                                    {unit.price_max && unit.price_max > unit.price && (
                                                                                        <span className="text-sm text-gray-500"> - ${unit.price_max.toLocaleString()}</span>
                                                                                    )}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Nested Units */}
                                                                    {unit.units && unit.units.length > 0 && (
                                                                        <div className="mt-4 border-t pt-4">
                                                                            <h6 className="text-sm font-medium text-gray-700 mb-2">Specific Units:</h6>
                                                                            <div className="space-y-3">
                                                                                {unit.units.map((specificUnit) => (
                                                                                    <div key={specificUnit.id} className="bg-gray-50 p-3 rounded-md">
                                                                                        <div className="flex justify-between">
                                                                                            <div>
                                                                                                <p className="font-medium text-gray-800">
                                                                                                    Unit Number: {specificUnit.display_name || specificUnit.name}
                                                                                                </p>
                                                                                                {specificUnit.sqft && (
                                                                                                    <p className="text-sm text-gray-600">
                                                                                                        {specificUnit.sqft.toLocaleString()} sqft
                                                                                                    </p>
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="text-right">
                                                                                                {specificUnit.price && (
                                                                                                    <p className="font-medium text-gray-800">
                                                                                                        ${specificUnit.price.toLocaleString()}
                                                                                                    </p>
                                                                                                )}
                                                                                                {specificUnit.availability && (
                                                                                                    <span className={`text-xs hidden px-2 py-1 rounded-full ${specificUnit.availability === 'available'
                                                                                                        ? 'bg-green-100 text-green-800'
                                                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                                                        }`}>
                                                                                                        {specificUnit.availability}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                                                                            {specificUnit.available_on && (
                                                                                                <div>
                                                                                                    <span className="text-gray-500">Availability:</span>
                                                                                                    <span className="ml-1 text-gray-700">
                                                                                                        {formatAvailabilityDate(specificUnit.available_on)}
                                                                                                    </span>
                                                                                                </div>
                                                                                            )}
                                                                                            {specificUnit.updated_at && (
                                                                                                <div>
                                                                                                    <span className="text-gray-500">Updated:</span>
                                                                                                    <span className="ml-1 text-gray-700">
                                                                                                        {formatAvailabilityDate(specificUnit.updated_at)}
                                                                                                    </span>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    <FloorPlanGallery unit={unit} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                )}
            </section>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    Error: {error}
                </div>
            )}
        </div>
    );
}