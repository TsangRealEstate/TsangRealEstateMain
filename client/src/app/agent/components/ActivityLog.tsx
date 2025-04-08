import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Movement {
    _id: string;
    fromColumn: string;
    toColumn: string;
    movedAt: string | Date;
    userName?: string;
    cardName?: string;
}

interface ActivityLogProps {
    movements: Movement[];
    title?: string;
    emptyMessage?: string;
    maxHeight?: string;
    userDisplayName?: string;
    showHeader?: boolean;
    className?: string;
}

const ActivityLog: React.FC<ActivityLogProps> = ({
    movements = [],
    title = 'Activity Log',
    emptyMessage = 'No activity yet. Movements will appear here.',
    maxHeight = '24rem',
    userDisplayName = 'User',
    showHeader = true,
    className = '',
}) => {
    return (
        <section className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
            {showHeader && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {title}
                    </h2>
                </div>
            )}

            {movements.length === 0 ? (
                <div className="p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p>
                </div>
            ) : (
                <ul className={`overflow-y-auto divide-y divide-gray-100 divide-y flex flex-col-reverse`} style={{ maxHeight }}>
                    {movements.map((movement) => (
                        <li
                            key={movement._id}
                            className="p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-3 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900">
                                            <span className="text-indigo-600">{movement.userName || userDisplayName}</span> moved {movement.cardName ? `"${movement.cardName}"` : 'this card'}
                                        </p>
                                        <span className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(movement.movedAt))} ago
                                        </span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600 flex items-center">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium mr-2">
                                            {movement.fromColumn}
                                        </span>
                                        <svg className="w-4 h-4 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                        </svg>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium ml-2">
                                            {movement.toColumn}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default ActivityLog;