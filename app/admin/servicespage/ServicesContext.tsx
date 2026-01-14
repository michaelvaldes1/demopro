'use client';

import React, { createContext, useContext, useState } from 'react';
import { Service } from './Types';

interface ServicesContextType {
    openEditModal: (service: Service) => void;
    openDeleteModal: (service: Service) => void;
    openDropdown: (service: Service, pos: { x: number, y: number }) => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider = ({ children, actions }: { children: React.ReactNode, actions: ServicesContextType }) => {
    return (
        <ServicesContext.Provider value={actions}>
            {children}
        </ServicesContext.Provider>
    );
};

export const useServices = () => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error('useServices must be used within a ServicesProvider');
    }
    return context;
};
