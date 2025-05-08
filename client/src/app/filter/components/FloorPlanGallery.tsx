"use client";

import { useState, useEffect } from 'react';

interface Photo {
    id: string;
    type?: string;
    caption?: string | null;
}

interface Unit {
    photos: Photo[];
    name: string;
}

interface FloorPlanGalleryProps {
    unit: Unit;
}

export default function FloorPlanGallery({ unit }: FloorPlanGalleryProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const openModal = (index: number) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
        if (isMounted) {
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        if (isMounted) {
            document.body.style.overflow = 'auto';
        }
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        setSelectedImageIndex(prev => {
            if (direction === 'prev') {
                return prev === 0 ? unit.photos.length - 1 : prev - 1;
            } else {
                return prev === unit.photos.length - 1 ? 0 : prev + 1;
            }
        });
    };

    if (!unit.photos || unit.photos.length === 0) return null;

    const getImageUrl = (photo: Photo, size = 100) => {
        return `https://cdn.apartmentlist.com/image/upload/c_fit,dpr_auto,f_auto,h_640,q_auto,w_640/${photo.id}.jpg`;
    };

    return (
        <>
            {/* Thumbnail Gallery */}
            <div className="mt-4 border-t pt-4">
                <h6 className="text-sm font-medium text-gray-700 mb-2">Floor Plan Photos:</h6>
                <div className="flex overflow-x-auto gap-2 pb-2">
                    {unit.photos.map((photo, index) => (
                        <button
                            key={`thumbnail-${photo.id}-${index}`}
                            onClick={() => openModal(index)}
                            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                            aria-label={`View floor plan ${index + 1}`}
                        >
                            <img
                                src={getImageUrl(photo)}
                                alt={`${unit.name} - Floor Plan ${index + 1}`}
                                className="w-[300px] rounded-md object-cover hover:opacity-90 transition-opacity"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
                    <div className="relative max-w-4xl w-full max-h-[90vh]">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none transition-colors"
                            aria-label="Close modal"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Main Image */}
                        <img
                            src={getImageUrl(unit.photos[selectedImageIndex], 800)}
                            alt={`${unit.name} - Floor Plan ${selectedImageIndex + 1}`}
                            className="size-[400px] md:size-[600px] object-contain rounded-lg mx-auto"
                        />

                        {/* Navigation Controls */}
                        {unit.photos.length > 1 && (
                            <>
                                <button
                                    onClick={() => navigateImage('prev')}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none transition-colors"
                                    aria-label="Previous image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => navigateImage('next')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none transition-colors"
                                    aria-label="Next image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* Image Counter */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                    {selectedImageIndex + 1} / {unit.photos.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}