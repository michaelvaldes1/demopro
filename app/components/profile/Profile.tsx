"use client";
import { Avatar, Card, CardBody, Divider } from "@heroui/react";
import { useAuth } from "../../context/AuthContext";
import { Mail, User, ShieldCheck } from "lucide-react";

export default function Profile() {
    const { user } = useAuth();

    return (
        <div className="w-full space-y-6 py-4">
            {/* Header / Avatar Section */}
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#D09E1E] to-transparent">
                    <Avatar
                        src={user?.photoURL || undefined}
                        name={user?.displayName || "Usuario"}
                        className="w-24 h-24 text-large"
                        isBordered
                        color="warning"
                    />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{user?.displayName || "Usuario"}</h3>
                    <p className="text-zinc-400 text-sm flex items-center justify-center gap-1">
                        <ShieldCheck size={14} className="text-[#D09E1E]" />
                        Cliente Miago
                    </p>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid gap-3">
                <Card className="bg-zinc-900/50 border-zinc-800 shadow-none">
                    <CardBody className="flex flex-row items-center gap-4 p-4 text-left">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#D09E1E]">
                            <User size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Nombre</span>
                            <span className="text-zinc-200">{user?.displayName || "No configurado"}</span>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800 shadow-none">
                    <CardBody className="flex flex-row items-center gap-4 p-4 text-left">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#D09E1E]">
                            <Mail size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Email</span>
                            <span className="text-zinc-200">{user?.email}</span>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Divider className="bg-zinc-800" />

            <div className="px-2">
                <p className="text-xs text-zinc-500 italic text-center">
                    Pronto podrás gestionar tus citas y preferencias desde aquí.
                </p>
            </div>
        </div>
    );
}
