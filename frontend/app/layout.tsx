import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "AtlasMind AI Travel Planner",
  description: "Multi-user AI itinerary planner with budget and hotel suggestions"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
