"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import { AiOutlineMail, AiOutlinePhone, AiOutlineDollarCircle } from "react-icons/ai";
import { FiSearch, FiHome, FiAlertCircle, FiXCircle, FiMapPin, FiCalendar } from "react-icons/fi";
import { Tenant } from "@/types/sharedTypes";
import DetailItem from "./DetailItem";

export default function Agent() {
    const [password, setPassword] = useState<string>("");
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.get("http://localhost:5000/api/v1/tenants", {
                headers: { "admin-secret": password },
            });
            setTenants(response.data.tenants);
            setAuthenticated(true);
        } catch (err: any) {
            setError("Access denied. Incorrect password.");
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSendInvite = async (tenantId: string, firstName: string, lastName: string) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/v1/meetings/send-invite/${tenantId}`
            );
            alert(`Meeting invite sent successfully to ${firstName} ${lastName}!`);
            console.log(response.data);
        } catch (error: any) {
            console.error("Error sending meeting invite:", error.response?.data || error.message);
            alert(`Failed to send meeting invite: ${error.response?.data || error.message}`);
        }
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
            if (currentCardIndex < tenants.length - 1) {
                setCurrentCardIndex((prev) => prev + 1);
            }
        },
        onSwipedRight: () => {
            if (currentCardIndex > 0) {
                setCurrentCardIndex((prev) => prev - 1);
            }
        },
        trackMouse: true,
    });

    return (
        <div className="p-4 md:p-8 mx-auto bg-gray-50">
            {!authenticated ? (
                <form onSubmit={handleSubmit} className="max-w-md text-center my-[8rem] mx-auto bg-white rounded-xl p-8 shadow-md">
                    <h2 className="text-2xl font-bold">Agent Portal</h2>
                    <p className="text-gray-600 my-5">Enter admin credentials to continue</p>
                    <input
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg mb-4"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg">
                        {loading ? "Authenticating..." : "Submit"}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
            ) : (
                <div className="space-y-8 max-w-[80%] mx-auto my-[2rem]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold">Tenant Dashboard</h2>
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                            {tenants.length} tenant{tenants.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {tenants.length > 0 && (
                        <div {...swipeHandlers} className="overflow-hidden">
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-600">
                                <h3 className="text-2xl font-semibold">
                                    {tenants[currentCardIndex].firstName} {tenants[currentCardIndex].lastName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Joined {new Date(tenants[currentCardIndex].createdAt).toLocaleDateString()}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <DetailItem label="Email" value={tenants[currentCardIndex].email} icon={<AiOutlineMail />} />
                                    <DetailItem label="Mobile" value={tenants[currentCardIndex].mobileNumber} icon={<AiOutlinePhone />} />
                                    <DetailItem label="Search Type" value={tenants[currentCardIndex].searchType} icon={<FiSearch />} />
                                    <DetailItem label="Budget" value={tenants[currentCardIndex].budget} icon={<AiOutlineDollarCircle />} />
                                    <DetailItem label="Bedrooms" value={tenants[currentCardIndex].bedrooms} icon={<FiHome />} />
                                    <DetailItem label="Bathrooms" value={tenants[currentCardIndex].bathrooms} icon={<FiHome />} />
                                    <DetailItem label="Lease End Date" value={tenants[currentCardIndex].leaseEndDate} icon={<FiCalendar />} />
                                    <DetailItem
                                        label="Desired Location"
                                        value={tenants[currentCardIndex].desiredLocation?.join(", ") || "N/A"}
                                        icon={<FiMapPin />}
                                    />
                                    <DetailItem
                                        label="Broken Lease"
                                        value={tenants[currentCardIndex].brokenLease?.join(", ") || "None"}
                                        icon={<FiAlertCircle />}
                                    />
                                    <DetailItem
                                        label="Non-Negotiables"
                                        value={tenants[currentCardIndex].nonNegotiables?.join(", ") || "None"}
                                        icon={<FiXCircle />}
                                    />
                                    <DetailItem label="Gross Income" value={tenants[currentCardIndex].grossIncome} icon={<AiOutlineDollarCircle />} />
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                                        <button
                                            onClick={() => handleSendInvite(
                                                tenants[currentCardIndex]._id,
                                                tenants[currentCardIndex].firstName,
                                                tenants[currentCardIndex].lastName
                                            )}
                                            className="inline-block rounded-md bg-blue-600 px-5 py-2.5 font-normal text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Send Meeting Invite
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-between">
                                    <button
                                        onClick={() => setCurrentCardIndex((prev) => Math.max(0, prev - 1))}
                                        disabled={currentCardIndex === 0}
                                        className="bg-gray-200 px-4 py-2 rounded-lg"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentCardIndex((prev) => Math.min(tenants.length - 1, prev + 1))}
                                        disabled={currentCardIndex === tenants.length - 1}
                                        className="bg-gray-200 px-4 py-2 rounded-lg"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

