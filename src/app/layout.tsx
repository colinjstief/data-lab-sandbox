import "./globals.css";
import "semantic-ui-css/semantic.min.css";

import type { Metadata } from "next";
// import { Roboto } from "next/font/google";

import AuthProvider from "@/app/context/AuthProvider";
import Panel from "@/app/components/layout/Panel";
import Header from "@/app/components/layout/Header";

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
    icon: "favicon.png",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className="min-h-screen">
      <body className="min-h-screen h-auto flex flex-1 flex-col sm:flex-row">
        <AuthProvider>
          <Panel />
          <main className="flex flex-col flex-1 overflow-auto">
            <Header />
            <div className="p-5">{children}</div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
