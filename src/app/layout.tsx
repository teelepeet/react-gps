import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";
import BootstrapActivation from '@/helpers/BootstrapActivation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AccountProvider } from "@/context/AccountContext";

export const metadata: Metadata = {
    title: "SportMap",
    description: "",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en">
            <body className="d-flex flex-column min-vh-100 container-body">
				<AccountProvider>
				<Header />
				<div className="container">
					<main role="main" className="pb-3">{children}</main>
				</div>
				<Footer />
                <BootstrapActivation />
				</AccountProvider>
            </body>
        </html>
    );
}
