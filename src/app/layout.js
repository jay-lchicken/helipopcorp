// app/layout.js
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "KLC IDE",
  description: "Powered by Clerk and Monaco",
};

export default function RootLayout({ children }) {
  const clerkJSUrl =
    process.env.NEXT_PUBLIC_CLERK_JS_URL ??
    "https://unpkg.com/@clerk/clerk-js@latest/dist/clerk.browser.js";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.clerk.dev" />
        <link rel="dns-prefetch" href="https://api.clerk.dev" />
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
      </head>
      <body suppressHydrationWarning>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          clerkJSUrl={clerkJSUrl}
          afterSignInUrl="/"
          afterSignUpUrl="/ide"
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
