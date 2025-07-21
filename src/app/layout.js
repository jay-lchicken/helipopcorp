import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "KLC IDE",
  description: "Powered by Clerk and Monaco",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl="/"
      afterSignUpUrl="/ide"
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://api.clerk.dev" />
          <link rel="dns-prefetch" href="https://api.clerk.dev" />
        </head>
        <body suppressHydrationWarning>{children}</body>
      </html>
    </ClerkProvider>
  );
}