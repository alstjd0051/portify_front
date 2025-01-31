import { Header } from "@/components/widget/layout/header";
import { ThemeProvider } from "next-themes";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1 mx-auto px-4 py-8">{children}</main>
      </div>
    </ThemeProvider>
  );
}
