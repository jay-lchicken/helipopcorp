// app/layout.js
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "KLC IDE",
  description: "Powered by Clerk and Monaco",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.clerk.dev" />
        <link rel="dns-prefetch" href="https://api.clerk.dev" />
      </head>
      <body suppressHydrationWarning>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          afterSignInUrl="/"
          afterSignUpUrl="/ide"
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}