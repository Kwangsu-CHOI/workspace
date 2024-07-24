import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";
import LiveBlocksProvider from "@/components/LiveBlocksProvider";
import Provider from "./Provider";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider signInFallbackRedirectUrl="/" signUpFallbackRedirectUrl="/">
			<html lang="en">
				<body>
					<Header />

					<div className="flex min-h-screen">
						<Sidebar />
						<div className="flex-1 p-4 bg-white overflow-y-auto scrollbar-hide">
							{children}
						</div>
					</div>
					<Toaster position="top-center" />
				</body>
			</html>
		</ClerkProvider>
	);
}
