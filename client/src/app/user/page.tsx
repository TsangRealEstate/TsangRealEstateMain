"use client";
import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import {
    FaHome, FaBed, FaBath, FaRulerCombined,
    FaCalendarAlt, FaExternalLinkAlt,
    FaVideo,
    FaPlay,
    FaVideoSlash,
    FaMap,
    FaRegStar,
    FaStar,
    FaStickyNote
} from 'react-icons/fa';
import Link from 'next/link';
import { IoMdClose } from 'react-icons/io';
import { CiLocationOn } from 'react-icons/ci';
import { MapRedirectLink } from './components/MapRedirectLink';

interface SavedUnit {
    isFavorite: boolean;
    unitId: string;
    propertyName: string;
    propertyArea: string;
    unitName: string;
    price: number;
    sqft: number;
    videoId: number;
    availableDate: string;
    scrapeListId: string;
    _id: string;
    bed: number;
    bath: number;
}
interface Video {
    videounitid: number;
    cloudinary_url: string;
    cloudinary_id: string;
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
    const [videos, setVideos] = useState<Video[]>([]);
    const [agentNotes, setAgentNotes] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
    const [viewingNotes, setViewingNotes] = useState<{
        notes: any[];
        propertyArea: string;
    } | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const tenant = params.get('tenant');
        const id = params.get('userId');

        if (tenant) setTenantName(tenant);
        if (id) setUserId(id);
    }, []);

    const fetchSavedUnits = async () => {
        try {
            // Fetch saved units
            const res = await axiosInstance.get(`/saved-units/${userId}`);
            const allUnits = res.data.flatMap((doc: any) => doc.selectedUnits);
            setSavedUnits(allUnits);

            // Get unique scrapeListIds
            const uniqueScrapeListIds = [...new Set(allUnits.map((u: { scrapeListId: any }) => u.scrapeListId))];

            // Fetch videos for each scrapeListId (existing code)
            const videoPromises = uniqueScrapeListIds.map(async (id) => {
                try {
                    const res = await axiosInstance.get(`/properties/${id}/videos`);
                    return res.data.videos || [];
                } catch (err: any) {
                    if (err.response?.status === 404) {
                        return [];
                    }
                    throw err;
                }
            });

            // Fetch agent notes for each scrapeListId
            const notePromises = uniqueScrapeListIds.map(async (scrapeListId) => {
                try {
                    const res = await axiosInstance.get(`/agent-notes/${userId}/${scrapeListId}`);
                    return res.data || [];
                } catch (err: any) {
                    if (err.response?.status === 404) {
                        return [];
                    }
                    throw err;
                }
            });

            // Wait for all requests
            const [videoResults, noteResults] = await Promise.all([
                Promise.all(videoPromises),
                Promise.all(notePromises)
            ]);

            // Process results
            const allVideos = videoResults.flat();
            const allNotes = noteResults.flat();
            setVideos(allVideos);
            setAgentNotes(allNotes);

        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;
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

    const openModal = (videoUrl: string) => {
        setActiveVideoUrl(videoUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setActiveVideoUrl(null);
        setIsModalOpen(false);
    };

    const toggleFavorite = async (unitId: any) => {
        try {
            const response = await axiosInstance.patch(
                `/saved-units/${userId}/toggle-favorite/${unitId}`
            );
            fetchSavedUnits();
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

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

                                            <div className='flex items-center flex-wrap gap-4'>
                                                {agentNotes.some(note => note.scrapeListId === group.scrapeListId) && (
                                                    <button
                                                        onClick={() => {
                                                            const propertyNotes = agentNotes.filter(
                                                                note => note.scrapeListId === group.scrapeListId
                                                            );
                                                            setViewingNotes({
                                                                notes: propertyNotes,
                                                                propertyArea: group.propertyArea // Include property area in state
                                                            });
                                                        }}
                                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                                        title="View Agent Notes"
                                                    >
                                                        <FaStickyNote className="h-4 w-4" />
                                                        <span>View Notes ({agentNotes.filter(note => note.scrapeListId === group.scrapeListId).length})</span>
                                                    </button>
                                                )}

                                                {group.units.some(unit =>
                                                    videos.some(video => video.videounitid === unit.videoId)
                                                ) ? (
                                                    (() => {
                                                        const matchingUnit = group.units.find(unit =>
                                                            videos.some(video => video.videounitid === unit.videoId)
                                                        );
                                                        if (!matchingUnit) return null;

                                                        const video = videos.find(v => v.videounitid === matchingUnit.videoId);
                                                        return video ? (
                                                            <button
                                                                key={video.cloudinary_id}
                                                                onClick={() => openModal(video.cloudinary_url)}
                                                                className="inline-flex mr-3 mt-6 lg:mt-0 items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                            >
                                                                <FaPlay className="text-xs mr-3" />
                                                                Watch Video
                                                            </button>
                                                        ) : null;
                                                    })()
                                                ) : (
                                                    <p className="text-sm text-gray-400 font-bold italic items-center gap-2 inline-flex mr-3 mt-6 lg:mt-0">
                                                        <FaVideoSlash className="text-gray-300 text-base" />
                                                        No video for this property yet
                                                    </p>

                                                )}

                                                <Link href={`/listings/${group.scrapeListId}`}
                                                    target='_blank'
                                                    rel="noopener noreferrer">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        View Details
                                                        <FaExternalLinkAlt className="ml-2 h-4 w-4" />
                                                    </button>
                                                </Link>

                                                <MapRedirectLink address={`${group.propertyArea}, San Antonio, TX`}>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        View on Google Maps
                                                        <CiLocationOn className="ml-2 h-4 w-4" />
                                                    </button>
                                                </MapRedirectLink>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {group.units.map((unit) => (
                                                <div key={unit.unitId} className="relative border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">

                                                    {/* Favorite Star Button*/}
                                                    <button
                                                        onClick={() => toggleFavorite(unit.unitId)}
                                                        className="absolute top-3 right-3 p-2 text-yellow-400 hover:text-yellow-500 transition-colors"
                                                        aria-label={unit.isFavorite ? "Remove from favorites" : "Add to favorites"}
                                                    >
                                                        {unit.isFavorite ? (
                                                            <FaStar className="h-5 w-5" />
                                                        ) : (
                                                            <FaRegStar className="h-5 w-5" />
                                                        )}
                                                    </button>

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

            {isModalOpen && activeVideoUrl && (
                <div className="fixed inset-0 bg-black/65 bg-opacity-60 flex items-center justify-center z-50 lg:px-0 px-4">
                    <div className="bg-white rounded-lg shadow-lg p-2 max-w-2xl relative">
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
                                className="size-full rounded"
                            />
                        </div>
                    </div>
                </div>
            )}

            {viewingNotes && (
                <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Agent Notes for {viewingNotes.propertyArea} {/* Show property area here */}
                            </h3>
                            <button
                                onClick={() => setViewingNotes(null)}
                                className="text-gray-500 hover:text-gray-700 text-3xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                            {viewingNotes.notes.length > 0 ? (
                                viewingNotes.notes.map((note, index) => (
                                    <div key={index} className="bg-gray-50 p-3 rounded">
                                        <p className="text-gray-700 whitespace-pre-wrap">{note.propertyNote}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(note.lastUpdated).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No notes available</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}