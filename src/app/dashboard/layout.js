import { ClerkProvider, SignedIn, SignOutButton } from "@clerk/nextjs";
import "../globals.css";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const metadata = {
  title: "KLC IDE",
  description: "Powered by Clerk and Monaco",
};

export default function RootLayout({ children }) {

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl="/ide"
      afterSignUpUrl="/ide"
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://api.clerk.dev" />
          <link rel="dns-prefetch" href="https://api.clerk.dev" />
        </head>
        <body suppressHydrationWarning>
            <SignedIn>
                <div className="absolute top-4 right-4 z-50">
                <SignOutButton redirectUrl="/dashboard">
                    <Button variant="default" size="sm">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                </SignOutButton>
                </div>
            </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}