"use client";

import React from 'react';
import { useAuth } from "../context/AuthContext";
import Login from "../components/auth/Login";
import TopBar from "../components/shared/TopBar";
import BottomNavBar from "../components/shared/BottomNavBar";
import Dashboard from "./components/Dashboard";
import { Spinner } from "@heroui/react";

export default function DashboardPage() {
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

    return (
        <>
            <TopBar />
            <main className="pt-20 pb-28">
                <Dashboard />
            </main>
            <BottomNavBar />
        </>
    );
}
