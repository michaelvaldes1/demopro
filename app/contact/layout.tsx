import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contacto',
    description: 'Ponte en contacto con MiagoBarber para cualquier duda o consulta.',
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-screen bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D09E1E]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-900/50 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
                {children}
            </div>
        </section>
    );
}