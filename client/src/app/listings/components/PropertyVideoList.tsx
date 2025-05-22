import axiosInstance from "@/api/axiosInstance";
import { useEffect, useState } from "react";
import { FaVideo } from "react-icons/fa";

interface Video {
    videounitid: number;
    cloudinary_url: string;
    cloudinary_id: string;
}

interface Props {
    propertyId: string;
}

const PropertyVideoList = ({ propertyId }: Props) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);

    const getVideosByPropertyId = async (propertyId: string) => {
        try {
            const res = await axiosInstance.get(`/properties/${propertyId}/videos`);
            return res.data.videos;
        } catch (error) {
            console.error("Failed to fetch videos:", error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const vids = await getVideosByPropertyId(propertyId);
                setVideos(vids);
            } catch (err) {
                alert("Failed to load videos");
            } finally {
                setLoading(false);
            }
        };

        if (propertyId) fetchVideos();
    }, [propertyId]);

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FaVideo /> Property Videos
            </h2>
            {loading ? (
                <p>Loading videos...</p>
            ) : videos.length === 0 ? (
                <p>No videos uploaded for this property.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {videos.map((video) => (
                        <div
                            key={video.cloudinary_id}
                            className="bg-white shadow rounded p-2"
                        >
                            <p className="text-sm mb-1">Unit ID: {video.videounitid}</p>
                            <video
                                controls
                                className="w-full rounded"
                                src={video.cloudinary_url}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PropertyVideoList;
