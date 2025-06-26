import React, { useEffect, useState } from "react";
import { FaRegCommentDots, FaTrash, FaSave, FaEdit, FaTimes } from "react-icons/fa";
import axiosInstance from "@/api/axiosInstance";

type Comment = {
    _id: string;
    tenantId: string;
    comment: string;
    createdAt: string;
};

type Props = {
    tenantId: string;
};

const TenantComments = ({ tenantId }: Props) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    const fetchComments = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/comments/${tenantId}`);

            if (Array.isArray(res.data)) {
                setComments(res.data);
                setError(null);
            } else if (res.data.message) {
                setComments([]);
                setError(res.data.message);
            } else {
                setComments([]);
                setError(null);
            }
            setLoading(false);
        } catch (err) {
            setError("Failed to load comments.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!tenantId) return;

        fetchComments();
    }, [tenantId]);


    const addComment = async () => {
        if (!newComment) return;
        try {
            setLoading(true);
            const res = await axiosInstance.post(`/comments/${tenantId}`, {
                comment: newComment.trim(),
            });
            setNewComment("");
            setLoading(false);
            fetchComments();
        } catch (err) {
            setError("Failed to add comment.");
            setLoading(false);
        }
    };

    const deleteComment = async (id: string) => {
        try {
            await axiosInstance.delete(`/comments/delete/${id}`);
            setComments(comments.filter((c) => c._id !== id));
        } catch {
            setError("Failed to delete comment.");
        }
    };

    const startEditing = (comment: Comment) => {
        setEditingId(comment._id);
        setEditText(comment.comment);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditText("");
    };

    const updateComment = async () => {
        if (!editingId || !editText.trim()) return;
        try {
            setLoading(true);
            const res = await axiosInstance.put(`/comments/update/${editingId}`, {
                comment: editText.trim(),
            });
            setComments(comments.map(c =>
                c._id === editingId ? { ...c, comment: editText.trim() } : c
            ));
            setEditingId(null);
            setEditText("");
            setLoading(false);
        } catch (err) {
            setError("Failed to update comment.");
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 my-5 border border-gray-100">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-blue-600">
                <FaRegCommentDots className="text-blue-500" /> Comments
            </h2>

            {/* Add Comment Section */}
            <div className="mb-6">
                <textarea
                    className="w-full resize-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    rows={3}
                    placeholder="Add a new comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={loading}
                />
                <button
                    onClick={addComment}
                    disabled={loading || !newComment.trim()}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                    <FaSave /> Add Comment
                </button>
            </div>

            {/* Status Messages */}
            {loading && (
                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg mb-4">
                    Loading...
                </div>
            )}
            {error && (
                <div className={`p-3 w-fit rounded-lg mb-4 ${error.includes("No comments") ? "bg-gray-50 text-gray-700" : "bg-red-50 text-red-700"}`}>
                    {error}
                </div>
            )}

            {/* Comments List */}
            <ul className="space-y-4">
                {comments.map(({ _id, comment, createdAt }) => (
                    <li key={_id} className="border-b border-gray-100 pb-4 last:border-0">
                        {editingId === _id ? (
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <textarea
                                    className="w-full min-h-[120px] p-3 text-gray-800 border border-gray-300 rounded-lg 
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm
                                        transition-all duration-150 ease-in-out"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    placeholder="Type your comment here..."
                                    rows={5}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={updateComment}
                                        disabled={loading || !editText.trim()}
                                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 flex items-center gap-1"
                                    >
                                        <FaSave size={14} /> Save
                                    </button>
                                    <button
                                        onClick={cancelEditing}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-1"
                                    >
                                        <FaTimes size={14} /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="group relative">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-gray-800 whitespace-pre-wrap break-words overflow-x-auto mb-2 max-w-full">{comment}</p>
                                        <small className="text-gray-500">
                                            Created At:    {new Date(createdAt).toLocaleString()}
                                        </small>
                                    </div>
                                    <div className="action-btns flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity">
                                        <button
                                            onClick={() => startEditing({ _id, comment, createdAt, tenantId })}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit comment"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteComment(_id)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete comment"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TenantComments;