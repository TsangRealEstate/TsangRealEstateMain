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
    FaKey,
    FaUpload,
    FaVideo,
    FaPlay
} from 'react-icons/fa';
import { FaElevator } from 'react-icons/fa6';
import axiosInstance from '@/api/axiosInstance';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import FloorPlanGallery from '@/app/filter/components/FloorPlanGallery';
import { formatAvailabilityDate } from '@/utils/dateUtils';
import PropertySpecials from '../components/PropertySpecials';
import { IoMdClose } from 'react-icons/io';

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

interface PropertyDetailPageProps {
    params: Promise<{ id: string }>;
}

interface VideoChangeEvent extends React.ChangeEvent<HTMLInputElement> { }
interface SelectedVideos {
    [unitId: number]: File;
}
interface HandleUploadParams {
    unitId: number;
}

interface VideoUploadResponse {
    success: boolean;
    message: string;
    data?: any;
}

interface Video {
    videounitid: number;
    cloudinary_url: string;
    cloudinary_id: string;
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
    const router = useRouter();
    const [property, setProperty] = useState<PropertyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedVideos, setSelectedVideos] = useState<SelectedVideos>({});
    const [uploadingUnitId, setUploadingUnitId] = useState<string | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { id } = await params;
                const response = await axiosInstance.get(`/scrape-list/${id}`);
                const fetchedProperty = response.data.data;
                setProperty(fetchedProperty);

                const videoRes = await axiosInstance.get(`/properties/${fetchedProperty._id}/videos`);
                setVideos(videoRes.data.videos || []);

            } catch (err: any) {
                if (err.response && err.response.status === 404) {
                    setVideos([]);
                } else {
                    console.error("Failed to fetch videos:", err);
                }
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

    const openModal = (videoUrl: string) => {
        setActiveVideoUrl(videoUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setActiveVideoUrl(null);
        setIsModalOpen(false);
    };

    const handleSpecialsUpdate = (updatedSpecials: any) => {
        setProperty(prev => {
            if (!prev) return null;

            return {
                ...prev,
                Information: {
                    ...prev.Information,
                    specials: updatedSpecials
                }
            };
        });
    };

    const handleVideoChange = (e: VideoChangeEvent, unitId: number) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedVideos((prev: SelectedVideos) => ({
                ...prev,
                [unitId]: file,
            }));
        }
    };

    const handleUpload = async ({ unitId }: HandleUploadParams): Promise<void> => {
        const videoFile = selectedVideos[unitId];
        if (!videoFile) return alert("No video selected");

        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("propertyId", property!._id);
        formData.append("videounitid", unitId.toString());

        setUploadingUnitId(unitId.toString());
        try {
            const res = await axiosInstance.post<VideoUploadResponse>(
                `/properties/${property!._id}/video`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("Video uploaded successfully");
            window.location.reload();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.error || "Failed to upload video");
        } finally {
            setUploadingUnitId(null);
        }
    };


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
                            <PropertySpecials
                                property={property}
                                onUpdate={handleSpecialsUpdate}
                            />
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
                                <h3 className="text-xl font-medium">Floor Name: {unit.name}</h3>
                                <div className="flex space-x-4 text-gray-600 mt-1">
                                    <span><FaBed className="inline mr-1" /> {unit.bed} {unit.bed === 1 ? 'bed' : 'beds'}</span>
                                    <span><FaBath className="inline mr-1" /> {unit.bath} {unit.bath === 1 ? 'bath' : 'baths'}</span>
                                    <span><FaRulerCombined className="inline mr-1" /> {unit.sqft} sqft</span>
                                </div>

                                {/* Check if a video exists for the unit */}
                                {videos.some(v => v.videounitid === unit.id) ? (
                                    <div className="mt-4 video-container">
                                        <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                            <FaVideo /> Uploaded Video : {videos
                                                .filter(v => v.videounitid === unit.id)
                                                .map(video => (
                                                    <button
                                                        key={video.cloudinary_id}
                                                        onClick={() => openModal(video.cloudinary_url)}
                                                        className="text-sm text-blue-600 underline flex items-center gap-1 hover:text-blue-800"
                                                    >
                                                        <FaPlay className="text-xs" />
                                                        Watch Video
                                                    </button>
                                                ))}
                                        </h4>
                                    </div>
                                ) : (
                                    <>
                                        {/* Video Upload Controls */}
                                        <div className="mt-4 flex items-center gap-4">
                                            <input
                                                type="file"
                                                accept="video/mp4,video/quicktime,video/x-m4v"
                                                onChange={(e) => handleVideoChange(e, unit.id)}
                                                className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                                            />

                                            <button
                                                onClick={() => handleUpload({ unitId: unit.id })}
                                                disabled={uploadingUnitId === unit.id.toString()}
                                                className={`flex items-center gap-2 px-4 py-1 rounded text-white transition ${uploadingUnitId === unit.id.toString()
                                                    ? "bg-blue-400 cursor-not-allowed"
                                                    : "bg-blue-600 hover:bg-blue-700"
                                                    }`}
                                            >
                                                {uploadingUnitId === unit.id.toString() ? (
                                                    <svg
                                                        className="animate-spin h-4 w-4 text-white"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                        ></path>
                                                    </svg>
                                                ) : (
                                                    <>
                                                        <FaUpload className="text-white" />
                                                        Upload
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}

                            </div>

                            {/* Unit Details */}
                            <div className="p-4">
                                {unit.units.length > 0 ? (
                                    <div>
                                        <FloorPlanGallery unit={unit} />

                                        <div className="space-y-4">
                                            {unit.units.map((specificUnit) => (
                                                <div key={specificUnit.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium">Unit Number: {specificUnit.display_name}</h4>
                                                            {/* <p>rentalId: {specificUnit.unit_rental_id}</p> */}
                                                            <p className='my-3'>Sqft: {specificUnit.sqft}</p>
                                                            <p className="text-gray-600 text-sm">
                                                                Availability: <FaCalendarAlt className="inline mr-1" />
                                                                {formatAvailabilityDate(specificUnit.available_on)}
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

                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No specific units currently available</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && activeVideoUrl && (
                <div className="fixed inset-0 bg-black/65 bg-opacity-60 flex items-center justify-center z-50 lg:px-0 px-4">
                    <div className="bg-white rounded-lg shadow-lg p-2 w-full max-w-2xl relative">
                        <button
                            className="absolute -top-10 right-6.5 lg:-right-10 text-gray-500 bg-white rounded-4xl hover:text-gray-700"
                            onClick={closeModal}
                        >
                            <IoMdClose size={34} />
                        </button>
                        <div className='h-[400px]'>
                            <video
                                src={activeVideoUrl}
                                controls
                                autoPlay
                                className="size-full rounded object-cover"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}