"use client"
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect as useEffectRouter } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogIn, UserPlus, LayoutDashboard, LogOut, Terminal } from "lucide-react";

export default function Home({DBUser}) {
  const [dbUser, setDbUser] = useState(DBUser);
  const [isLoaded, setIsLoaded] = useState(false);

  const router = useRouter();

  useEffectRouter(() => {
    if (isLoaded && dbUser?.role === "teacher") {
      router.push("/dashboard");
    }
  }, [dbUser, router, isLoaded]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="w-full items-center justify-center flex flex-col min-h-screen py-8 px-4">
        <div className={`flex flex-col items-center space-y-8 mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-110"></div>
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-8">
                <img
                  className="w-[280px] h-auto drop-shadow-2xl transform transition-all duration-500 group-hover:scale-105"
                  src="/klc.png"
                  alt="KLC Logo"
                />
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-white leading-tight">
              Welcome to KLC Code IDE
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed">
              Your ultimate coding environment for learning and development
            </p>
          </div>
        </div>

        <div className={`w-full max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SignedOut>
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-foreground">Get Started</CardTitle>
                <CardDescription>Sign in or create an account to begin coding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <SignInButton mode="modal">
                    <Button size="lg" className="w-full sm:w-auto text-base px-10 py-6">
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </Button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base px-10 py-6 border border-border/50">
                      <UserPlus className="w-5 h-5" />
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              </CardContent>
            </Card>
          </SignedOut>

          <SignedIn>
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl">
              <CardContent className="p-10">
                {dbUser && (
                  <Card className="mb-8 bg-secondary/30 border-border/30">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        <p className="text-muted-foreground text-lg">Welcome back!</p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-lg">
                        <Badge variant="default">{dbUser?.role}</Badge>
                        <span className="text-muted-foreground hidden sm:block">•</span>
                        <span className="text-foreground">{dbUser.email}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {dbUser?.role === "teacher" && (
                    <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6" onClick={() => window.location.href = "/dashboard"}>
                      <LayoutDashboard className="w-5 h-5" />
                      Go to Dashboard
                    </Button>
                  )}
                  {dbUser?.role === "student" && (
                    <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6" onClick={() => window.location.href = "/student-dashboard"}>
                      <LayoutDashboard className="w-5 h-5" />
                      Go to Dashboard
                    </Button>
                  )}
                  <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6" onClick={() => window.location.href = "/ide"}>
                    <Terminal className="w-5 h-5" />
                    Go to IDE
                  </Button>

                  <SignOutButton>
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base px-8 py-6 border border-border/50">
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </Button>
                  </SignOutButton>
                </div>
              </CardContent>
            </Card>
          </SignedIn>
        </div>
    </div>
  );
}