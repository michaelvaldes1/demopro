"use client";

import React from 'react';
import { useAuth } from "../context/AuthContext";
import Login from "../components/auth/Login";
import TopBar from "../components/shared/TopBar";
import BottomNavBar from "../components/shared/BottomNavBar";
import BarberServices from "../components/BarberServices/BarberServices";
import { Spinner } from "@heroui/react";

export default function ServicesPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <Spinner size="lg" color="warning" />
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="bg-black min-h-screen">
            <TopBar />
            <main className="pt-20 pb-28 px-6 md:px-10">
                <div className="max-w-7xl mx-auto">
                    <BarberServices />
                </div>
            </main>
            <BottomNavBar />
        </div>
    );
}
