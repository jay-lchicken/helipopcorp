import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import "../globals.css";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "KLC IDE - Teacher Dashboard",
  description: "Powered by Clerk and Monaco",
};

export default function RootLayout({ children }) {

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://api.clerk.dev" />
          <link rel="dns-prefetch" href="https://api.clerk.dev" />
        </head>
        <body suppressHydrationWarning>
          <SignedOut>
            {children}
          </SignedOut>
          <SignedIn>
            <SidebarProvider>
              <AppSidebar role="teacher" />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <span className="text-sm font-medium">Teacher Dashboard</span>
                </header>
                <div className="flex-1 overflow-auto">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}