"use client"
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContextType, Column } from "@/types/sharedTypes";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
    const [tenants, setTenants] = useState<any[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);

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
                initialColumns[0].cards = tenantData.map((tenant: { _id: string; firstName: string; lastName: string }) => ({
                    id: tenant._id,
                    content: `${tenant.firstName || "No Firstname"} ${tenant.lastName || "No Lastname"}`,
                }));
            }

            setColumns(initialColumns);
            setAuthenticated(true);
            setIsDataLoaded(true);
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("authPassword", adminPassword);
        } catch (err: any) {
            setError(`${err.response.data.message}` || "Access denied. Incorrect password.");
            setAuthenticated(false);
            setIsDataLoaded(false);
            localStorage.removeItem("authenticated");
            localStorage.removeItem("authPassword");
            console.error("Error fetching tenants:", err);
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
