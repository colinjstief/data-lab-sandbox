import "semantic-ui-css/semantic.min.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";

import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";

import AuthProvider from "@/app/(context)/AuthProvider";
import Panel from "@/app/(components)/(layout)/Panel";

export const metadata: Metadata = {
  title: "Data Lab Sandbox",
  description: "A place for trying things out",
  icons: {
    icon: "/favicon.png",
  },
};

const RootLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-PLGWCPCL" />
      <body className="flex flex-col h-auto min-h-screen md:flex-row ">
        <AuthProvider>
          <Panel />
          <main className="flex flex-col flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
