import { Montserrat } from "next/font/google";
import "./styles/globals.css";

import { Providers } from "./providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata = {

  title: {
    default: "MiagoBarber | Agenda de citas",
    template: "%s | MiagoBarber",
  },
  description: "Reserva tu cita en MiagoBarber fácilmente.",
  openGraph: {
    title: "MiagoBarber | Agenda de citas",
    description: "Agenda tu cita en minutos",
    siteName: "MiagoBarber",
    type: "website",
    locale: "es_PA",
    images: [
      {
        url: "/og-miagobarber.png",
        width: 1200,
        height: 630,
        alt: "MiagoBarber - Agenda de citas",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${montserrat.variable} dark text-foreground bg-background font-sans`} lang="es" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=arrow_back_ios_new,chevron_left,chevron_right,schedule,arrow_forward" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}