"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardBody, Spinner, Divider } from "@heroui/react";
import { Calendar, Clock, Scissors, User, ChevronRight } from "lucide-react";
import { getUserAppointments, AppointmentData } from "../../lib/firebase/appointments";
import { useAuth } from "../../context/AuthContext";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export default function AppointmentHistory() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<(AppointmentData & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (user?.email) {
                const data = await getUserAppointments(user.email);
                // Sort by date and time (descending)
                const sorted = data.sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.time}`);
                    const dateB = new Date(`${b.date}T${b.time}`);
                    return dateB.getTime() - dateA.getTime();
                });
                setAppointments(sorted);
            }
            setLoading(false);
        };

        fetchAppointments();
    }, [user?.email]);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner color="warning" size="sm" />
            </div>
        );
    }

    if (appointments.length === 0) {
        return (
            <div className="text-center py-10 px-6">
                <p className="text-zinc-500 text-sm italic font-medium">No tienes citas agendadas aún.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Tus Citas</h4>
                <span className="bg-[#D09E1E]/10 text-[#D09E1E] text-[9px] font-black px-2 py-0.5 rounded-full border border-[#D09E1E]/20 uppercase">
                    {appointments.length} Total
                </span>
            </div>

            <div className="grid gap-3">
                {appointments.map((appointment) => {
                    const dateObj = parseISO(appointment.date);
                    const formattedDate = format(dateObj, "d 'de' MMMM", { locale: es });

                    return (
                        <Card
                            key={appointment.id}
                            className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-md shadow-none hover:border-[#D09E1E]/30 transition-all group active:scale-[0.98]"
                        >
                            <CardBody className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#D09E1E]/10 flex items-center justify-center text-[#D09E1E] border border-[#D09E1E]/20 group-hover:bg-[#D09E1E]/20 transition-colors">
                                        <Scissors size={20} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h5 className="font-bold text-white text-sm truncate uppercase tracking-tight">
                                                {appointment.serviceName}
                                            </h5>
                                            <span className="text-[10px] font-black text-[#D09E1E] whitespace-nowrap">
                                                {appointment.time}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                                <Calendar size={12} className="text-zinc-600" />
                                                {formattedDate}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                                <User size={12} className="text-zinc-600" />
                                                {appointment.barberName}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-zinc-700 group-hover:text-[#D09E1E] transition-colors pl-2">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
