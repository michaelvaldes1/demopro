"use client";

import React from 'react';
import Hero from './Hero';
import Services from './Services';
import TopBarbers from './TopBarbers';
import FloatingActionButton from './FloatingActionButton';

export default function Dashboard() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Full width Hero */}
            <div className="px-6 md:px-10 max-w-[1600px] mx-auto w-full">
                <Hero />
            </div>

            {/* Contained Content */}
            <div className="max-w-7xl mx-auto px-6 w-full">
                <Services />
                <TopBarbers />
            </div>

            <FloatingActionButton />
        </div>
    );
}