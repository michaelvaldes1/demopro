'use client';

import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Service } from './Types';
import { useServices } from './ServicesContext';

export default function ServiceItemActions({ service }: { service: Service }) {
    const { openDropdown } = useServices();

    return (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    openDropdown(service, {
                        x: rect.right,
                        y: rect.bottom
                    });
                }}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95"
            >
                <MoreVertical size={18} />
            </button>
        </div>
    );
}
