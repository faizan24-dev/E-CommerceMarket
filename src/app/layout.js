import { Fraunces, Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import LogoutOverlay from "@/components/LogoutOverlay";
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
    default: "Ecommerce Market — Instant Digital Downloads",
    template: "%s · Ecommerce Market",
  },
  description:
    "Ecommerce Market is a curated marketplace for digital products: templates, software, e-books and vector packs, delivered instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <LogoutOverlay />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
