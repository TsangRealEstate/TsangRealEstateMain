import axiosInstance from "@/api/axiosInstance";

interface ModalProps {
    show: boolean;
    title: string;
    tenantId: string
    message: string;
    hasResults: boolean;
    results?: any[];
    tenantName?: string;
    onClose: () => void;
}

export default function ResultsModal({
    show,
    title,
    message,
    hasResults,
    results,
    tenantName,
    tenantId,
    onClose
}: ModalProps) {

    if (!show) return null;

    const handleNavigate = async () => {
        const simplifiedResults = results?.map((listing: any) => ({
            scrapeListId: listing._id,
            display_name: listing.Information.display_name,
            street_address: listing.Information.street_address,
            available_units: listing.Information.available_units.map((unit: any) => ({
                id: unit.id,
                name: unit.name,
                bed: unit.bed,
                bath: unit.bath,
                sqft: unit.sqft,
                sqft_max: unit.sqft_max,
                price: unit.price,
                price_max: unit.price_max,
                available_on: unit.units[0]?.available_on,
                photos: unit.photos,
                units: unit.units.map((u: any) => ({
                    id: u.id,
                    name: u.name,
                    display_name: u.display_name,
                    price: u.price,
                    sqft: u.sqft,
                    available_on: u.available_on
                }))
            }))
        }));

        try {
            const payload = {
                tenantId,
                tenantName,
                count: results?.length || 0,
                listings: simplifiedResults || []
            };

            await axiosInstance.post('/tenants/search-results', payload);

            const url = `/listings/Tenant/${encodeURIComponent(tenantName ?? '')}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error saving search results:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/35 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="mb-4">{message}</p>

                {hasResults && (
                    <div className="mb-4">
                        <p className="font-semibold">Matching properties:</p>
                        <ul className="list-disc pl-5 mt-2">
                            {results?.slice(0, 3).map((result, index) => (
                                <li key={index}>{result.Information.display_name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded"
                    >
                        Close
                    </button>

                    {hasResults && (
                        <button
                            onClick={handleNavigate}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            View All Results
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}