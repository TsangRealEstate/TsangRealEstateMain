import { ZipCode } from '@/types/sharedTypes';
import React, { useState } from 'react';

interface ZipCodesModalProps {
    isOpen: boolean;
    onClose: () => void;
    zipCodes: ZipCode[];
}

interface GroupedZipCode {
    zip: string;
    count: number;
    properties: ZipCode[];
}

const ZipCodesModal: React.FC<ZipCodesModalProps> = ({ isOpen, onClose, zipCodes }) => {
    const [expandedZips, setExpandedZips] = useState<Set<string>>(new Set());

    if (!isOpen) return null;

    // Group zip codes by zip
    const groupedByZip: Record<string, GroupedZipCode> = zipCodes.reduce((acc, zipCode) => {
        if (!acc[zipCode.PropertyZip]) {
            acc[zipCode.PropertyZip] = {
                zip: zipCode.PropertyZip,
                count: 0,
                properties: []
            };
        }
        acc[zipCode.PropertyZip].count++;
        acc[zipCode.PropertyZip].properties.push(zipCode);
        return acc;
    }, {} as Record<string, GroupedZipCode>);

    const groupedList = Object.values(groupedByZip).sort((a, b) => b.count - a.count);

    const toggleZip = (zip: string) => {
        setExpandedZips(prev => {
            const newSet = new Set(prev);
            if (newSet.has(zip)) {
                newSet.delete(zip);
            } else {
                newSet.add(zip);
            }
            return newSet;
        });
    };

    return (
        <div className="fixed inset-0 bg-black/15 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-semibold">
                        Zip Codes ({zipCodes.length} properties, {groupedList.length} unique zips)
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zip Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Count</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {groupedList.map(group => (
                                <React.Fragment key={group.zip}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {group.zip}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {group.count} propert{group.count === 1 ? 'y' : 'ies'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => toggleZip(group.zip)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                {expandedZips.has(group.zip) ? 'Hide' : 'Show'} properties
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedZips.has(group.zip) && group.properties.map(property => (
                                        <tr key={property.PropertyId} className="bg-gray-50">
                                            <td className="px-6 py-2 text-sm text-gray-500 pl-10">
                                                {property.PropertyDisplayName}
                                            </td>
                                            <td className="px-6 py-2 text-sm text-gray-500">
                                                {property.PropertyNeighborhood || 'N/A'}
                                            </td>
                                            <td className="px-6 py-2 text-sm text-gray-500 font-mono">
                                                {property.PropertyId.substring(0, 8)}...
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="border-t p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ZipCodesModal;