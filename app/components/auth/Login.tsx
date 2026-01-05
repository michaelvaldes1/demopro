"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardBody, Button, Divider, Spinner } from "@heroui/react";
import { useAuth } from "../../context/AuthContext";
import LightPillar from "../../components/ui/LightPillar";

export default function Login() {
    const { signInWithGoogle, signInAsGuest, loading } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleGoogleLogin = async () => {
        setIsLoggingIn(true);
        try {
            await signInWithGoogle();
        } catch {
            setIsLoggingIn(false);
        }
    };



    const handleGuestLogin = async () => {
        setIsLoggingIn(true);
        try {
            await signInAsGuest();
        } catch {
            setIsLoggingIn(false);
        }
    };

    const MobileGradientBackground = () => (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
                }
            `}} />
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, #050505 30%, #3a2c08 50%, #D09E1E 70%, #3a2c08 90%, #050505 100%)',
                    backgroundSize: '400% 400%',
                    animation: 'gradientShift 15s ease infinite'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(208, 158, 30, 0.15) 0%, rgba(255, 215, 0, 0.05) 50%, transparent 70%)',
                        filter: 'blur(60px)',
                        animation: 'pulse 8s ease-in-out infinite'
                    }}
                />
            </div>
        </>
    );

    if (loading || isLoggingIn) {
        return (
            <div style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: '#0a0a0a' }}>
                {isMobile ? (
                    <MobileGradientBackground />
                ) : (
                    <LightPillar
                        topColor="#D09E1E"
                        bottomColor="#FFD700"
                        intensity={0.3}
                        rotationSpeed={0.1}
                        glowAmount={0.003}
                        pillarWidth={2.0}
                        pillarHeight={0.3}
                        noiseIntensity={0.3}
                        pillarRotation={0}
                        interactive={false}
                        mixBlendMode="normal"
                    />
                )}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                }}>
                    <Spinner size="lg" color="warning" />
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', minHeight: '100vh', position: 'relative', backgroundColor: '#0a0a0a' }}>
            {isMobile ? (
                <MobileGradientBackground />
            ) : (
                <LightPillar
                    topColor="#D09E1E"
                    bottomColor="#FFD700"
                    intensity={0.3}
                    rotationSpeed={0.1}
                    glowAmount={0.003}
                    pillarWidth={2.0}
                    pillarHeight={0.3}
                    noiseIntensity={0.3}
                    pillarRotation={0}
                    interactive={false}
                    mixBlendMode="normal"
                />
            )}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                zIndex: 10
            }}>
                <Card className="w-full max-w-md p-6 border-zinc-800 shadow-2xl" style={{
                    background: 'rgba(24, 24, 27, 0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                    borderRadius: '1rem'
                }}>
                    <CardHeader className="flex flex-col gap-2 items-center justify-center pb-8">
                        <div className="rounded-full bg-black p-4 mb-2 border-16 border-zinc-800 flex items-center justify-center aspect-square">
                            <Image
                                src="/miago-single.svg"
                                width={40}
                                height={40}
                                alt="Logo"
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-xl font-bold text-white">Bienvenido a MiagoBarber</p>
                            <p className="text-small text-default-500">Inicia sesión para reservar tu cita</p>
                        </div>
                    </CardHeader>
                    <CardBody className="flex flex-col gap-4">
                        <Button
                            startContent={
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                            }
                            variant="bordered"
                            onPress={handleGoogleLogin}
                            isDisabled={isLoggingIn}
                            className="font-medium text-white border-[#D09E1E] hover:bg-[#D09E1E]/10"
                        >
                            Continuar con Google
                        </Button>


                        <div className="flex items-center gap-2 py-2">
                            <Divider className="flex-1 bg-zinc-700" />
                            <span className="text-xs text-zinc-500">O</span>
                            <Divider className="flex-1 bg-zinc-700" />
                        </div>

                        <Button
                            variant="flat"
                            color="default"
                            onPress={handleGuestLogin}
                            isDisabled={isLoggingIn}
                            className="font-bold bg-[#D09E1E] text-white hover:bg-[#D09E1E]/90"
                        >
                            Ingresar como invitado
                        </Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}