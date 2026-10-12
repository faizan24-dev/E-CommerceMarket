import { Fraunces, Inter } from "next/font/google";
import CartDrawer from "@/components/cart/CartDrawer";
import AppBootstrap from "@/components/layout/AppBootstrap";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import LogoutOverlay from "@/components/layout/LogoutOverlay";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/config/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <AppBootstrap />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <LogoutOverlay />
      </body>
    </html>
  );
}
