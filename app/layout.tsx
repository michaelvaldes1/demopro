import { Montserrat, Poppins } from "next/font/google";
import "./styles/globals.css";

import { Providers } from "./providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: {
    default: "MiagoBarber | Agenda de Citas Premium",
    template: "%s | MiagoBarber",
  },
  description: "Vive la experiencia de barbería premium en MiagoBarber. Cortes de alta calidad, atención personalizada y estilo impecable. ¡Agenda tu cita online ahora!",
  keywords: ["barbería", "corte de cabello", "barba", "Panamá", "MiagoBarber", "agenda online"],
  authors: [{ name: "Miago" }],
  openGraph: {
    title: "MiagoBarber | Tu Estilo, Nuestra Pasión",
    description: "Agenda tu cita en minutos y disfruta de un servicio de primera clase en MiagoBarber.",
    url: "https://miagobarber.com",
    siteName: "MiagoBarber",
    locale: "es_PA",
    type: "website",
    images: [
      {
        url: "/op.png",
        width: 1200,
        height: 630,
        alt: "MiagoBarber - Barbería Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MiagoBarber | Barbería Premium",
    description: "Excelente estilo, máxima precisión. Reserva tu cita online en MiagoBarber.",
    images: ["/op.png"],
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

import FooterWrapper from "@/components/shared/FooterWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${montserrat.variable} ${poppins.variable} dark text-foreground bg-background font-sans`} lang="es" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=arrow_back_ios_new,chevron_left,chevron_right,schedule,arrow_forward" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <div className="flex-1">
            {children}
          </div>
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}