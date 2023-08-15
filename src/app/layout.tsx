import "./globals.css";
import "semantic-ui-css/semantic.min.css";

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Panel from "./components/layout/Panel";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Data Lab Sandbox",
  description: "A place for trying things out",
  icons: {
    icon: "favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-screen">
      <body
        className={`${roboto.className} min-h-screen h-auto flex flex-1 flex-col sm:flex-row`}
      >
        <Panel />
        {children}
      </body>
    </html>
  );
}
