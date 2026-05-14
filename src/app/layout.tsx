import type { Metadata } from "next";
import StoreProvider from "@/store/StoreProvider";
import TeamPanel from "@/components/TeamPanel";
import ThemeRegistry from "@/theme/ThemeRegistry";
import "./globals.css";

export const metadata: Metadata = {
  title: "Star Wars Team Assembly",
  description: "Assemble your Star Wars team — may the Force be with you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <StoreProvider>
            {children}
            <TeamPanel />
          </StoreProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
