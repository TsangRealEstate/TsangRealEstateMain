"use client"
import React, { createContext, useContext, useState } from "react";
import { AuthContextType, Column } from "@/types/sharedTypes";
import axiosInstance from "@/api/axiosInstance";
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
    const [tenants, setTenants] = useState<any[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);

    type Card = {
        id: string | number;
        content: string;
    };

    type Column = {
        id: string;
        title: string;
        cards: Card[];
        newCard: string;
    };


    const fetchTenants = async (adminPassword: string) => {
        setLoading(true);
        setError("");
        try {
            const [tenantsResponse, positionsResponse] = await Promise.all([
                axiosInstance.get("/tenants", {
                    headers: { "admin-secret": adminPassword },
                }),
                axiosInstance.get("/movements/positions/latest")
            ]);

            const tenantData = tenantsResponse.data.tenants;
            const cardPositions = positionsResponse.data;

            // Initialize columns with proper typing
            const initialColumns: Column[] = [
                { id: "initial-leads", title: "Initial Leads", cards: [], newCard: "" },
                { id: "active-clients", title: "Active Clients", cards: [], newCard: "" },
                { id: "sent-list", title: "Sent List", cards: [], newCard: "" },
                { id: "touring", title: "Touring", cards: [], newCard: "" },
                { id: "follow-ups", title: "Follow Ups", cards: [], newCard: "" },
                { id: "application", title: "Application", cards: [], newCard: "" },
                { id: "moving-in", title: "Moving In", cards: [], newCard: "" },
                { id: "trash", title: "Trash", cards: [], newCard: "" },
            ];

            if (tenantData?.length > 0) {
                setTenants(tenantData);
                tenantData.forEach((tenant: { _id: string | number; firstName?: string; lastName?: string }) => {
                    const card: Card = {
                        id: tenant._id,
                        content: `${tenant.firstName || "No Firstname"} ${tenant.lastName || "No Lastname"}`,
                    };

                    const lastPosition = cardPositions[tenant._id];
                    const targetColumn = initialColumns.find(col =>
                        lastPosition ? col.title === lastPosition : col.id === "initial-leads"
                    );

                    (targetColumn || initialColumns[0]).cards.push(card);
                });
            }

            setColumns(initialColumns);
            setAuthenticated(true);
            setIsDataLoaded(true);
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("authPassword", adminPassword);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Access denied. Incorrect password.";
            setError(errorMessage);
            setAuthenticated(false);
            setIsDataLoaded(false);
            localStorage.removeItem("authenticated");
            localStorage.removeItem("authPassword");
            console.error("Error fetching initial data:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                setAuthenticated,
                password,
                setPassword,
                fetchTenants,
                loading,
                error,
                isDataLoaded,
                tenants,
                setTenants,
                columns,
                setColumns,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
