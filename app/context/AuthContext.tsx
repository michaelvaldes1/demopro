"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    signInWithPopup,
    signInAnonymously,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../lib/firebase/clients";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    signInAsGuest: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            if (error.code === 'auth/popup-blocked') {
                alert('Permite las ventanas emergentes para continuar');
            }
            setLoading(false);
        }
    };

    const signInWithApple = async () => {
        try {
            setLoading(true);
            await signInWithPopup(auth, appleProvider);
        } catch (error: any) {
            if (error.code === 'auth/popup-blocked') {
                alert('Permite las ventanas emergentes para continuar');
            }
            setLoading(false);
        }
    };

    const signInAsGuest = async () => {
        try {
            setLoading(true);
            await signInAnonymously(auth);
        } catch (error: any) {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error: any) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signInWithGoogle,
                signInWithApple,
                signInAsGuest,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};