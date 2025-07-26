import { ClerkProvider, SignedIn, SignOutButton } from "@clerk/nextjs";
import "../globals.css";

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
                    <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold"
                    >
                    Sign Out
                    </button>
                </SignOutButton>
                </div>
            </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}