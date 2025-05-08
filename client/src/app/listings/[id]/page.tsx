"use client";

import { notFound, useRouter } from 'next/navigation';
import {
    FaBed,
    FaBath,
    FaRulerCombined,
    FaDollarSign,
    FaCalendarAlt,
    FaPhone,
    FaMapMarkerAlt,
    FaWifi,
    FaParking,
    FaSwimmingPool,
    FaDog, FaUtensils,
    FaTshirt,
    FaSnowflake,
    FaCoffee,
    FaBriefcase,
    FaKey
} from 'react-icons/fa';
import { FaElevator } from 'react-icons/fa6';
import axiosInstance from '@/api/axiosInstance';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import FloorPlanGallery from '@/app/filter/components/FloorPlanGallery';

interface Photo {
    type: string;
    id: string;
    caption: string | null;
}

interface Amenity {
    display_name: string;
    cloudinary_id: string;
    group: string;
    group_rank: number;
    filter_param: string | null;
}

interface Unit {
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

interface AvailableUnit {
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
    units: Unit[];
}

interface PropertyInformation {
    display_name: string;
    street_address: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
    description: string;
    first_photo: Photo[];
    all_photos: Photo[];
    top_amenities: Amenity[];
    unit_amenities: Amenity[];
    community_amenities: Amenity[];
    available_units: AvailableUnit[];
    phone: string;
    short_highlight: string;
    prices: Record<string, number[]>;
    specials: {
        raw_text: string;
        restrictions: {
            bed_count: number[] | null;
            lease_length: number[][] | null;
        };
        created_at: string | null;
        updated_at: string | null;
        expires_at: string | null;
    }[];
}

interface PropertyData {
    _id: string;
    title: string;
    destinationURL: string;
    Information: PropertyInformation;
}

const getAmenityIcon = (amenityName: string) => {
    switch (amenityName.toLowerCase()) {
        case 'in unit laundry':
            return <FaTshirt className="inline mr-2" />;
        case 'hardwood floors':
            return <FaRulerCombined className="inline mr-2" />;
        case 'dishwasher':
            return <FaUtensils className="inline mr-2" />;
        case 'pet friendly':
            return <FaDog className="inline mr-2" />;
        case 'parking':
            return <FaParking className="inline mr-2" />;
        case 'air conditioning':
            return <FaSnowflake className="inline mr-2" />;
        case '24hr gym':
            return <FaBriefcase className="inline mr-2" />;
        case 'pool':
            return <FaSwimmingPool className="inline mr-2" />;
        case 'elevator':
            return <FaElevator className="inline mr-2" />;
        case 'coffee bar':
            return <FaCoffee className="inline mr-2" />;
        case 'key fob access':
            return <FaKey className="inline mr-2" />;
        default:
            return <FaWifi className="inline mr-2" />;
    }
};

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [property, setProperty] = useState<PropertyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { id } = params;
                const response = await axiosInstance.get(`/scrape-list/${id}`);
                setProperty(response.data.data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [params]);

    if (loading) {
        return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Loading...</div>;
    }

    if (error || !property) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div>
                <button
                    onClick={() => router.back()}
                    className="mb-10 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                    <AiOutlineArrowLeft />
                    Back to Filter
                </button>
            </div>

            {/* Property Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{property.Information.display_name}</h1>
                <div className="flex items-center text-gray-600 mt-2">
                    <FaMapMarkerAlt className="mr-2" />
                    <p>{property.Information.street_address}, {property.Information.city}, {property.Information.state} {property.Information.zip}</p>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                    <FaPhone className="mr-2" />
                    <p>{property.Information.phone}</p>
                </div>
            </div>

            {/* Photo Gallery */}
            <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {property.Information.all_photos.slice(0, 5).map((photo, index) => (
                        <div key={index} className={`${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                            <img
                                src={`https://cdn.apartmentlist.com/image/upload/c_fill,dpr_auto,f_auto,g_center,h_415,q_auto,w_640/${photo.id}.jpg`}
                                alt={`${property.Information.display_name} - Photo ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x415?text=No+Image+Available';
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Highlights and Description */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-700 mb-4">{property.Information.description}</p>
                    <p className="text-gray-700">{property.Information.short_highlight}</p>
                </div>

                {/* Key Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Key Details</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-gray-900">Price Range/Market Rent</h3>
                            {Object.entries(property.Information.prices).map(([bedCount, prices]) => (
                                <p key={bedCount} className="text-gray-600">
                                    {bedCount === '0' ? 'Studio' : `${bedCount} bed`}: ${Math.min(...prices)} - ${Math.max(...prices)}
                                </p>
                            ))}
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Neighborhood</h3>
                            <p className="text-gray-600">{property.Information.neighborhood}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Property Type</h3>
                            <p className="text-gray-600">Apartment</p>
                        </div>
                    </div>

                    <div>
                        {property.Information.specials && property.Information.specials.length > 0 && (
                            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <h4 className="font-medium text-blue-800 mb-2">Current Specials:</h4>
                                <div className="space-y-3">
                                    {property.Information.specials.map((special, index) => (
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
                                                        {special.created_at && (
                                                            <div>
                                                                <span className="text-blue-600">Created:</span>
                                                                <span className="ml-1 text-blue-800">
                                                                    {new Date(special.created_at).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        )}
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
                </div>

            </div>

            {/* Amenities */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>

                <div className="space-y-8">
                    {/* Top Amenities */}
                    {property.Information.top_amenities.length > 0 && (
                        <div>
                            <h3 className="text-xl font-medium mb-3">Top Amenities</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {property.Information.top_amenities.map((amenity, index) => (
                                    <li key={index} className="flex items-center">
                                        {getAmenityIcon(amenity.display_name)}
                                        <span>{amenity.display_name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Unit Amenities */}
                    {property.Information.unit_amenities.length > 0 && (
                        <div>
                            <h3 className="text-xl font-medium mb-3">Unit Amenities</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {property.Information.unit_amenities.map((amenity, index) => (
                                    <li key={index} className="flex items-center">
                                        {getAmenityIcon(amenity.display_name)}
                                        <span>{amenity.display_name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Community Amenities */}
                    {property.Information.community_amenities.length > 0 && (
                        <div>
                            <h3 className="text-xl font-medium mb-3">Community Amenities</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {property.Information.community_amenities.map((amenity, index) => (
                                    <li key={index} className="flex items-center">
                                        {getAmenityIcon(amenity.display_name)}
                                        <span>{amenity.display_name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Available Units */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Available Units</h2>
                <div className="space-y-6">
                    {property.Information.available_units.map((unit) => (
                        <div key={unit.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Unit Header */}
                            <div className="bg-gray-50 p-4 border-b border-gray-200">
                                <h3 className="text-xl font-medium">{unit.name}</h3>
                                <div className="flex space-x-4 text-gray-600 mt-1">
                                    <span><FaBed className="inline mr-1" /> {unit.bed} {unit.bed === 1 ? 'bed' : 'beds'}</span>
                                    <span><FaBath className="inline mr-1" /> {unit.bath} {unit.bath === 1 ? 'bath' : 'baths'}</span>
                                    <span><FaRulerCombined className="inline mr-1" /> {unit.sqft} sqft</span>
                                </div>
                            </div>

                            {/* Unit Details */}
                            <div className="p-4">
                                {unit.units.length > 0 ? (
                                    <div className="space-y-4">
                                        {unit.units.map((specificUnit) => (
                                            <div key={specificUnit.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium">{specificUnit.display_name}</h4>
                                                        <p className="text-gray-600 text-sm">
                                                            Available: <FaCalendarAlt className="inline mr-1" />
                                                            {new Date(specificUnit.available_on).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-lg">
                                                            <FaDollarSign className="inline mr-1" />
                                                            {specificUnit.price}
                                                        </p>
                                                        <span className={`text-xs px-2 py-1 hidden rounded-full ${specificUnit.availability === 'available'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {specificUnit.availability}
                                                        </span>
                                                    </div>
                                                </div>
                                                <FloorPlanGallery unit={unit} />
                                            </div>
                                        ))}
                                    </div>


                                ) : (
                                    <p className="text-gray-500">No specific units currently available</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}