"use client";

import React from 'react';
import { useAuth } from "../context/AuthContext";
import Login from "../components/auth/Login";
import TopBar from "../components/shared/TopBar";
import BottomNavBar from "../components/shared/BottomNavBar";
import Profile from "./components/Profile";
import { Spinner } from "@heroui/react";

export default function ProfilePage() {
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
        <div className="bg-black min-h-screen">
            <TopBar />
            <main className="pt-20 pb-28 px-6">
                <div className="max-w-2xl mx-auto">
                    <Profile />
                </div>
            </main>
            <BottomNavBar />
        </div>
    );
}
