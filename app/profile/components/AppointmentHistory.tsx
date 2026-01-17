"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardBody, Spinner, Divider } from "@heroui/react";
import { Calendar, Clock, Scissors, User, ChevronRight } from "lucide-react";
import { getUserAppointments, AppointmentData } from "../../lib/firebase/appointments";
import { useAuth } from "../../context/AuthContext";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export default function AppointmentHistory({ email }: { email?: string }) {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<(AppointmentData & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);

    const targetEmail = email || user?.email;

    useEffect(() => {
        const fetchAppointments = async () => {
            if (targetEmail) {
                const data = await getUserAppointments(targetEmail);
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
    }, [targetEmail]);

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
        <div className="grid gap-3">
            {appointments.map((appointment) => {
                const dateObj = parseISO(appointment.date);
                const formattedDate = format(dateObj, "d 'de' MMMM", { locale: es });

                return (
                    <Card
                        key={appointment.id}
                        className="bg-white/[0.03] border-white/5 backdrop-blur-md shadow-none hover:border-[#E5B454]/30 transition-all group active:scale-[0.98] rounded-[1.5rem]"
                    >
                        <CardBody className="p-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#E5B454]/10 flex items-center justify-center text-[#E5B454] border border-[#E5B454]/20 group-hover:bg-[#E5B454]/20 transition-colors flex-shrink-0">
                                    <Scissors size={20} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h5 className="font-bold text-white text-sm truncate uppercase tracking-tight">
                                            {appointment.serviceName}
                                        </h5>
                                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${appointment.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            appointment.status === 'confirmed' ? 'bg-[#E5B454]/10 text-[#E5B454] border-[#E5B454]/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {appointment.status === 'completed' ? 'Completado' :
                                                appointment.status === 'confirmed' ? 'Confirmado' :
                                                    appointment.status === 'cancelled' ? 'Cancelado' :
                                                        appointment.status === 'rejected' ? 'Rechazado' :
                                                            appointment.status === 'blocked' ? 'Bloqueado' : appointment.status}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                            <Calendar size={12} className="text-zinc-600" />
                                            {formattedDate}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                            <Clock size={12} className="text-zinc-600" />
                                            {appointment.time}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
                                        <User size={12} className="text-zinc-600" />
                                        {appointment.barberName}
                                    </div>
                                </div>

                                <div className="text-zinc-700 group-hover:text-[#E5B454] transition-colors pl-2 pt-1">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
}
