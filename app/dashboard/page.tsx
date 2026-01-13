import TopBar from "../components/shared/TopBar";
import BottomNavBar from "../components/shared/BottomNavBar";
import Dashboard from "./components/Dashboard";
import DashboardWrapper from "./components/DashboardWrapper";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | MiagoBarber',
    description: 'Descubre nuestros servicios de barbería premium y conoce a nuestro equipo de barberos profesionales. Reserva tu cita en MiagoBarber.',
    keywords: 'barbería, corte de cabello, barba, servicios de barbería, barberos profesionales',
};

export default function DashboardPage() {
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
