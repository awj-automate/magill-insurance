import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Magill Insurance — Workflow Architecture",
  description:
    "Visual architecture for a Formstack → Make.com → Airtable underwriting workflow with AI-assisted client comms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
