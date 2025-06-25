import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MailProvider } from "@/context/mailContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MailBoard - Smart Email Management",
  description: "Manage multiple Gmail accounts with AI-powered categorization and todo management",
  generator: 'v0.dev',
  icons: {
    icon: "/icon.svg", // Favicon (SVG)
    // Optional: Add other icon formats
    shortcut: "/icon.png", // Fallback for older browsers
    apple: "/apple-touch-icon.png", // Apple touch icon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          <SidebarProvider>
            <MailProvider>
              {children}
            </MailProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}