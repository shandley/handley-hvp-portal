import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Handley Lab Virome",
  description:
    "The Handley Lab's virome methods, tools, data views, and resources, across human and environmental viromes.",
  icons: { icon: "/logo-placeholder.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
