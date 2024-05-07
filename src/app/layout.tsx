import "semantic-ui-css/semantic.min.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";

import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
// import { Roboto } from "next/font/google";

import AuthProvider from "@/app/context/AuthProvider";
import Panel from "@/app/components/layout/Panel";
import Header from "@/app/components/layout/Header";
import { getAssetByType } from "@/lib/contentfulAPI";
import { ContentfulResponse } from "@/lib/types";

// const roboto = Roboto({
//   weight: ["100", "300", "400", "500", "700", "900"],
//   style: ["normal", "italic"],
//   subsets: ["latin"],
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "Data Lab Sandbox",
  description: "A place for trying things out",
  icons: {
    icon: "/favicon.png",
  },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const pages: ContentfulResponse = await getAssetByType({ type: "page" });

  return (
    <html lang="en" className="min-h-screen">
      <GoogleTagManager gtmId="GTM-PLGWCPCL" />
      <body className="min-h-screen h-auto flex flex-1 flex-col sm:flex-row">
        <AuthProvider>
          <Panel pages={pages} />
          <main className="flex flex-col flex-1 overflow-auto">
            <Header />
            <div className="flex-1 flex-auto p-5">{children}</div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
