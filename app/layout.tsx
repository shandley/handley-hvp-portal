import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Human Virome Program, synthesized · Handley Lab",
  description:
    "An independent Handley Lab synthesis of the NIH Human Virome Program: consortium, data-generation landscape, and infrastructure.",
  icons: { icon: "/logo-placeholder.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
