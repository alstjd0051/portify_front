import { Black_Han_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/shared/providers/theme-provider";
import { cn } from "@/components/shared/lib/utils";
import "@/components/shared/styles/globals.css";
import AuthProvider from "@/components/shared/providers/authProvider";
import { MainLayout } from "@/components/layouts/main-layout";

const blackHanSans = Black_Han_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-black-han-sans",
});

export const metadata = {
  title: "함께하는 폴리파이",
  description: "함께하는 폴리파이",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh bg-background  antialiased",
          blackHanSans.className
        )}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
