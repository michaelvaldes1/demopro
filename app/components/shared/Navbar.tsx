"use client";
import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarMenuToggle,
    NavbarMenuItem,
    NavbarMenu,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
} from "@heroui/react";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";

export const AcmeLogo = () => {
    return (
        <Image src="/miago-single.svg" alt="Logo" width={30} height={30} />
    );
};

export default function App() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { user, loading, logout } = useAuth();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const menuItems = [
        "Inicio",
        "Servicios",
        "Galería",
        "Contacto",
    ];

    if (!mounted) return null;

    // Hide navbar if not authenticated (Login view)
    if (!loading && !user) return null;

    return (
        <Navbar
            maxWidth="xl"
            className="liquid-glass liquid-glass-border hidden md:flex fixed top-16 z-50 h-12"
            classNames={{
                wrapper: "px-4 h-full",
                item: [
                    "flex",
                    "relative",
                    "h-full",
                    "items-center",
                    "data-[active=true]:after:content-['']",
                    "data-[active=true]:after:absolute",
                    "data-[active=true]:after:bottom-0",
                    "data-[active=true]:after:left-0",
                    "data-[active=true]:after:right-0",
                    "data-[active=true]:after:h-[2px]",
                    "data-[active=true]:after:rounded-[2px]",
                    "data-[active=true]:after:bg-[#D09E1E]",
                ],
            }}
        >
            <NavbarContent className="gap-8" justify="center">
                <NavbarItem isActive>
                    <Link color="primary" href="#" aria-current="page" className="text-sm font-medium">
                        Inicio
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#services" className="text-sm font-medium">
                        Servicios
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#gallery" className="text-sm font-medium">
                        Galería
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#contact" className="text-sm font-medium">
                        Contacto
                    </Link>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}


