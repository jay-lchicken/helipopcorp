"use client";

import { usePathname } from "next/navigation";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import {ClerkProvider} from "@clerk/nextjs";
export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideOnPaths = ["/", "/ide", "/ide/submitted"];
  const shouldShowSignOut = !hideOnPaths.includes(pathname);

  return (
    <>
      <ClerkProvider>
      {shouldShowSignOut && (
        <SignedIn>
          <div className="absolute top-4 right-4 z-50">
            <SignOutButton redirectUrl="/dashboard">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </SignedIn>
      )}
      {children}
      </ClerkProvider>
    </>
  );
}
