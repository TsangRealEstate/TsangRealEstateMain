import React from 'react';

interface MapRedirectLinkProps {
    address?: string;
    latitude?: number;
    longitude?: number;
    children: React.ReactNode;
    className?: string;
}

export const MapRedirectLink = ({
    address,
    latitude,
    longitude,
    children,
    className,
}: MapRedirectLinkProps) => {
    const getMapUrl = () => {
        if (address) {
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        } else if (latitude && longitude) {
            return `https://www.google.com/maps/@?api=1&map_action=map&center=${latitude},${longitude}`;
        }
        return '#';
    };

    return (
        <a
            href={getMapUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
        >
            {children}
        </a>
    );
};