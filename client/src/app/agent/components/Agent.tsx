"use client";
import { Column, Tenant } from "@/types/sharedTypes";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";


export default function Agent() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [password, setPassword] = useState<string>("");
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [columns, setColumns] = useState<Column[]>([
        { id: "initial-leads", title: "Initial Leads", cards: [], newCard: "" },
        { id: "active-clients", title: "Active Clients", cards: [], newCard: "" },
        { id: "sent-list", title: "Sent List", cards: [], newCard: "" },
        { id: "touring", title: "Touring", cards: [], newCard: "" },
        { id: "follow-ups", title: "Follow Ups", cards: [], newCard: "" },
        { id: "application", title: "Application", cards: [], newCard: "" },
        { id: "moving-in", title: "Moving In", cards: [], newCard: "" },
        { id: "trash", title: "Trash", cards: [], newCard: "" },
    ]);

    const fetchTenants = async (adminPassword: string) => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get("http://localhost:5000/api/v1/tenants", {
                headers: { "admin-secret": adminPassword },
            });
            const tenantData = response.data.tenants;

            const initialColumns = [
                { id: "initial-leads", title: "Initial Leads", cards: [], newCard: "" },
                { id: "active-clients", title: "Active Clients", cards: [], newCard: "" },
                { id: "sent-list", title: "Sent List", cards: [], newCard: "" },
                { id: "touring", title: "Touring", cards: [], newCard: "" },
                { id: "follow-ups", title: "Follow Ups", cards: [], newCard: "" },
                { id: "application", title: "Application", cards: [], newCard: "" },
                { id: "moving-in", title: "Moving In", cards: [], newCard: "" },
                { id: "trash", title: "Trash", cards: [], newCard: "" },
            ];

            if (tenantData && tenantData.length > 0) {
                setTenants(tenantData);
                console.log(tenantData);
                initialColumns[0].cards = tenantData.map((tenant: { firstName: string; lastName: string; }) => ({
                    id: crypto.randomUUID(),
                    content: `${tenant.firstName || "No Firstname"} ${tenant.lastName || "No Lastname"}`,
                }));
            }

            setColumns(initialColumns);
            setAuthenticated(true);
            setIsDataLoaded(true);
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("authPassword", adminPassword);
        } catch (err: any) {
            setError("Access denied. Incorrect password.");
            setAuthenticated(false);
            setIsDataLoaded(false);
            localStorage.removeItem("authenticated");
            localStorage.removeItem("authPassword");
        } finally {
            setLoading(false);
        }
    };

    // Handle manual authentication
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchTenants(password);
    };

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("authenticated") === "true";
        const storedPassword = localStorage.getItem("authPassword");

        if (isAuthenticated && storedPassword) {
            setPassword(storedPassword);
            setAuthenticated(true);
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
        e.preventDefault();
    };

    // Card functions
    const addCard = (index: number) => {
        if (columns[index].newCard.trim()) {
            const updatedColumns = [...columns];
            updatedColumns[index].cards.push({
                id: crypto.randomUUID(),
                content: updatedColumns[index].newCard
            });
            updatedColumns[index].newCard = "";
            setColumns(updatedColumns);
        }
    };

    const updateNewCard = (index: number, value: string) => {
        const updatedColumns = [...columns];
        updatedColumns[index].newCard = value;
        setColumns(updatedColumns);
    };

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
            const column = updatedColumns[sourceColIndex];
            const [movedCard] = column.cards.splice(source.index, 1);
            column.cards.splice(destination.index, 0, movedCard);
        } else {
            const sourceColumn = updatedColumns[sourceColIndex];
            const destColumn = updatedColumns[destColIndex];
            const [movedCard] = sourceColumn.cards.splice(source.index, 1);
            destColumn.cards.splice(destination.index, 0, movedCard);
        }

        setColumns(updatedColumns);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div>
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
                ) : isDataLoaded ? (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 my-5 text-center">Agent Dashboard</h1>
                        <div className="relative p-4 md:p-8 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-[110vh] overflow-x-auto"
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
                                                <div className="space-y-3 max-h-[200px] overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                                    {column.cards.map((card, i) => (
                                                        <Draggable key={card.id} draggableId={card.id} index={i}>
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-400 group"
                                                                >
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
                                            </div>
                                        )}
                                    </Droppable>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>Loading dashboard...</div>
                )}
            </div>
        </DragDropContext>

    );
}