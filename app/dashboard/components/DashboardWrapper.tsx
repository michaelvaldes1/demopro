"use client";

import { useAuth } from "../../context/AuthContext";
import Login from "../../components/auth/Login";
import { Spinner } from "@heroui/react";

interface DashboardWrapperProps {
    children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner size="lg" color="warning" />
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return <>{children}</>;
}
