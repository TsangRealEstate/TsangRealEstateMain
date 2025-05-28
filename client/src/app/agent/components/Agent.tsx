"use client";
import { CardLabel, Tenant } from "@/types/sharedTypes";
import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided } from "@hello-pangea/dnd";
import TenantModal from "./TenantDashboard";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";
import TenantSearch from "./TenantSearch";
import AgentLoginForm from "./AgentLoginForm";

type CardLabelsMap = Record<string, CardLabel[]>;

export default function Agent() {
    const {
        authenticated,
        setColumns,
        password,
        columns,
        setPassword,
        fetchTenants,
        loading,
        error,
        tenants,
        isDataLoaded } = useAuth();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [cardLabels, setCardLabels] = useState<CardLabelsMap>({});
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTenants, setFilteredTenants] = useState(tenants);

    const handleCardClick = (tenantId: string) => {
        // console.log(tenantId);
        const tenant = tenants.find((t) => t._id === tenantId);
        if (tenant) {
            setSelectedTenant(tenant);
            setIsModalOpen(true);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = tenants.filter(tenant =>
            `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(term) ||
            tenant.email.toLowerCase().includes(term) ||
            tenant.mobileNumber?.toLowerCase().includes(term)
        );

        setFilteredTenants(filtered);
    };

    // Handle manual authentication
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchTenants(password);
    };

    useEffect(() => {
        const storedPassword = localStorage.getItem("authPassword");
        if (storedPassword) {
            fetchTenants(storedPassword);
        }
    }, []);

    // Mouse events for horizontal scrolling
    const startDrag = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        if (e.target !== scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    };

    const duringDrag = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast factor
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const endDrag = () => {
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

    // Touch events for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!scrollContainerRef.current) return;
        const touch = e.touches[0];
        setStartX(touch.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!scrollContainerRef.current) return;
        const touch = e.touches[0];
        const x = touch.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    // Card functions
    const addCard = async (index: number) => {
        const storedPassword = localStorage.getItem("authPassword");
        if (columns[index].newCard.trim()) {
            try {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const tenantPayload = {
                    firstName: columns[index].newCard.trim(),
                    lastName: "Doe",
                    mobileNumber: "0000000000",
                    email: "default@example.com",
                    searchType: "rent",
                    OtherOnLease: "no",
                    othersOnLeasevalue: "",
                    bathrooms: "1",
                    bedrooms: "1",
                    brokenLease: [],
                    budget: "1000",
                    creditScore: "700",
                    desiredLocation: [],
                    grossIncome: "50000",
                    instagram: "",
                    leaseEndDate: tomorrow.toISOString().split('T')[0],
                    leaseStartDate: today.toISOString().split('T')[0],
                    nonNegotiables: [],
                    propertyOwnerName: "John Smith"
                };

                const response = await axiosInstance.post('/tenants', tenantPayload);

                const updatedColumns = [...columns];
                updatedColumns[index].cards.push({
                    content: columns[index].newCard
                });
                updatedColumns[index].newCard = "";
                setColumns(updatedColumns);
                if (storedPassword) {
                    fetchTenants(storedPassword);
                }

            } catch (error: any) {
                console.error("Failed to create tenant:", error);
                alert(`Failed to create tenant: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const updateNewCard = (index: number, value: string) => {
        const updatedColumns = [...columns];
        updatedColumns[index].newCard = value;
        setColumns(updatedColumns);
    };

    const logMovement = async (cardId: any, fromColumn: any, toColumn: any) => {
        try {
            await axiosInstance.post('/movements', {
                cardId,
                fromColumn,
                toColumn,
            });
            // console.log('Movement logged successfully!');
        } catch (error) {
            console.error('Failed to log movement', error);
        }
    };

    // Drag and drop functionality
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const updatedColumns = [...columns];
        const sourceColIndex = updatedColumns.findIndex(col => col.id === source.droppableId);
        const destColIndex = updatedColumns.findIndex(col => col.id === destination.droppableId);

        if (sourceColIndex === destColIndex) {
            // Moving within the same column
            const column = updatedColumns[sourceColIndex];
            const [movedCard] = column.cards.splice(source.index, 1);
            column.cards.splice(destination.index, 0, movedCard);
            //console.log(`Card "${movedCard.content}" with id:${movedCard.id}  moved within "${column.title}" from index ${source.index} to ${destination.index}`);
        } else {
            // Moving across columns
            const sourceColumn = updatedColumns[sourceColIndex];
            const destColumn = updatedColumns[destColIndex];
            const [movedCard] = sourceColumn.cards.splice(source.index, 1);
            destColumn.cards.splice(destination.index, 0, movedCard);
            logMovement(movedCard.id, sourceColumn.title, destColumn.title);
            //console.log(`Card "${movedCard.content}" with id:${movedCard.id}  moved from "${sourceColumn.title}" to "${destColumn.title}"`);
        }
        setColumns(updatedColumns);
    };

    useEffect(() => {
        if (!isModalOpen) {
            const fetchAllData = async () => {
                try {
                    const [cardLabelsRes] = await Promise.all([
                        axiosInstance.get("/labels/card-labels/all"),
                    ]);

                    setCardLabels(cardLabelsRes.data);
                } catch (error) {
                    console.error("Failed to fetch label data", error);
                }
            };

            fetchAllData();
        }
    }, [isModalOpen]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="2xl:container 2xl:mx-auto">
                {!authenticated ? (
                    <AgentLoginForm
                        password={password}
                        loading={loading}
                        error={error}
                        onPasswordChange={(e) => setPassword(e.target.value)}
                        onSubmit={handleSubmit}
                    />
                ) : isDataLoaded ? (
                    <section>

                        <TenantSearch
                            searchTerm={searchTerm}
                            onSearchChange={handleSearch}
                            filteredTenants={filteredTenants}
                            onTenantSelect={handleCardClick}
                        />

                        <div className="relative drag-func p-4 md:p-8 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-[110vh] overflow-x-auto"
                            ref={scrollContainerRef}
                            onMouseDown={startDrag}
                            onMouseMove={duringDrag}
                            onMouseUp={endDrag}
                            onMouseLeave={endDrag}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                cursor: isDragging ? 'grabbing' : 'grab'
                            }}>

                            <div className="flex gap-6 w-fit items-start">
                                {columns.map((column, index) => (
                                    <Droppable key={column.id} droppableId={column.id} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="w-80 bg-white rounded-xl shadow-lg p-4 flex-shrink-0 border border-gray-200 hover:shadow-xl transition-shadow duration-200"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <h2 className="font-semibold text-lg text-gray-800">
                                                        <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                                                        {column.title}
                                                    </h2>
                                                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                        {column.cards.length} cards
                                                    </span>
                                                </div>
                                                <div className="space-y-3 max-h-[700px] overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                                    {column.cards.map((card: { id: string; content: string }, i: number) => (
                                                        <Draggable key={card.id} draggableId={card.id} index={i}>
                                                            {(provided: DraggableProvided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    onClick={() => handleCardClick(card.id)}
                                                                    className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-400 group"
                                                                >
                                                                    <div className="flex flex-row flex-wrap">
                                                                        {cardLabels[card.id]?.map(label => (
                                                                            <small
                                                                                key={label._id}
                                                                                className="w-fit px-2 py-1 rounded text-xs font-medium mb-2 mr-2"
                                                                                style={{
                                                                                    backgroundColor: `${label.color}20`,
                                                                                    color: label.color
                                                                                }}
                                                                            >
                                                                                {label.name}
                                                                            </small>
                                                                        ))}
                                                                    </div>

                                                                    <p className="text-gray-800 flex items-center">
                                                                        <span className="mr-2 text-gray-400 group-hover:text-blue-500 transition-colors">
                                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                                <path d="M3 3h18v18H3zM15 9l-6 6m0-6l6 6"></path>
                                                                            </svg>
                                                                        </span>
                                                                        {card.content}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                                <div className="mt-4">
                                                    <input
                                                        type="text"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-400"
                                                        placeholder="Enter card name"
                                                        value={column.newCard}
                                                        onChange={(e) => updateNewCard(index, e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && addCard(index)}
                                                    />
                                                    <button
                                                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg active:bg-blue-800 flex items-center justify-center gap-2"
                                                        onClick={() => addCard(index)}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M12 5v14M5 12h14"></path>
                                                        </svg>
                                                        Add Card
                                                    </button>
                                                </div>

                                                {isModalOpen && selectedTenant && (
                                                    <TenantModal
                                                        tenant={selectedTenant}
                                                        onClose={() => setIsModalOpen(false)}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : (
                    <div>Loading dashboard...</div>
                )}
            </div>
        </DragDropContext>

    );
}