import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { TabProvider } from "@/context/TabContext";
import AppShell from "@/components/layout/AppShell";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Asaan Hisab - Friends It Solutions",
  description:
    "Financial management dashboard for tracking income, expenses, invoices, and cashbook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable} style={{ margin: 0 }}>
        <ThemeRegistry>
          <TabProvider>
            <AppShell>{children}</AppShell>
          </TabProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
