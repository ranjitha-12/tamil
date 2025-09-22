import type { Metadata } from "next";
import { Roboto, Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/provider/AuthProvider";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import "@/lib/cronJobs";
import { NextIntlClientProvider } from "next-intl";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
  variable: "--font-roboto",
});
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "UTA",
  description: "Universal Tamil Academy"
};

export default async function RootLayout({
  children,
}:  Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${roboto.variable} ${openSans.variable}`}>
      <body className="font-sans antialiased">
        {/* <NextIntlClientProvider> */}
          <AuthProvider session={session}>{children}</AuthProvider>
          <Toaster position="top-right" reverseOrder={false} />
        {/* </NextIntlClientProvider> */}
      </body>
    </html>
  );
}
