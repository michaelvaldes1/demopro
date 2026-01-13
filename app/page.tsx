import React from 'react';
import TopBar from "./components/shared/TopBar";
import BottomNavBar from "./components/shared/BottomNavBar";
import Dashboard from "./dashboard/components/Dashboard";
import DashboardWrapper from "./dashboard/components/DashboardWrapper";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MiagoBarber | Agenda de citas',
  description: 'Descubre nuestros servicios de barbería premium y conoce a nuestro equipo de barberos profesionales. Reserva tu cita en MiagoBarber.',
  keywords: 'barbería, corte de cabello, barba, servicios de barbería, barberos profesionales, agenda de citas',
};

export default function Home() {
  return (
    <DashboardWrapper>
      <TopBar />
      <main className="pt-20 pb-28">
        <Dashboard />
      </main>
      <BottomNavBar />
    </DashboardWrapper>
  );
}