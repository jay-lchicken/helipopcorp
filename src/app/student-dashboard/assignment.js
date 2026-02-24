'use client';

import {useEffect, useState, useCallback} from 'react';
import {SignedIn, SignedOut, SignInButton, SignUpButton, useUser} from '@clerk/nextjs';
import React from 'react';
import {useRouter} from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogIn, UserPlus, Terminal, FileText } from "lucide-react";


export default function StudentDashboardPage({serverSubmissions}) {
    const {user} = useUser();
    const router = useRouter();
    const [editingSubmission, setEditingSubmission] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [submissions, setSubmissions] = useState(serverSubmissions || []);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDeletingSubmission, setIsDeletingSubmission] = useState(false);
    const [isEditingSubmission, setIsEditingSubmission] = useState(false);
    const [totalScore, setTotalScore] = useState('');
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-screen text-foreground px-6 py-8">
            <SignedOut>
                <div className="flex flex-col items-center justify-center min-h-screen text-center">
                    <div className="relative group mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-110"></div>
                        <Card className="border-border/50 bg-card/30 backdrop-blur-sm shadow-2xl">
                            <CardContent className="p-8">
                                <img className="w-[280px] h-auto drop-shadow-2xl" src="/klc.png" alt="KLC Logo"/>
                            </CardContent>
                        </Card>
                    </div>

                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
                        Welcome to the KLC Code IDE
                    </h1>
                    <p className="text-muted-foreground text-lg mb-8">Please sign in to access your student dashboard</p>

                    <div className="flex gap-6">
                        <SignInButton mode="modal">
                            <Button size="lg" className="px-8 py-3">
                                <LogIn className="w-5 h-5" />
                                Sign In
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button variant="secondary" size="lg" className="px-8 py-3 border border-border/50">
                                <UserPlus className="w-5 h-5" />
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </div>
                </div>
            </SignedOut>

            <SignedIn>
                {!user ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground text-lg">Loading your dashboard...</p>
                        </div>
                    </div>
                ) : (
                    <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <Card className="bg-card/40 backdrop-blur-sm border-border/50 shadow-2xl mb-8">
                            <CardContent className="p-8">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar className="w-16 h-16 border-2 border-primary/30 shadow-lg">
                                                <AvatarImage src={user.imageUrl} alt={user.name} />
                                                <AvatarFallback>{user?.fullName?.charAt(0) || 'S'}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card"></div>
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-foreground mb-1">
                                                Welcome back, {user?.fullName || 'Student'} 👋
                                            </h1>
                                            <p className="text-muted-foreground">Ready to manage your submissions</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span>Online</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/40 backdrop-blur-sm border-border/50 shadow-2xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CardTitle>Submissions</CardTitle>
                                        <Badge variant="secondary">
                                            {submissions.length} total
                                        </Badge>
                                    </div>
                                    <Button onClick={() => router.push('/ide')}>
                                        <Terminal className="w-4 h-4" />
                                        Go to IDE
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {submissions.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="w-12 h-12 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-muted-foreground mb-2">No submissions yet</h3>
                                        <p className="text-muted-foreground mb-6">Go to the IDE to start coding!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {submissions.map((submission) => (
                                            <Card
                                                key={submission.id}
                                                onClick={() => {
                                                    window.location.href = `/student-dashboard/${submission.submission_id}`;
                                                }}
                                                className="group cursor-pointer bg-secondary/30 border-border/30 hover:bg-secondary/50 hover:border-border/60 transition-all duration-300"
                                            >
                                                <CardContent className="p-5">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                                                                <h3 className="inline text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                                                    {submission.name}
                                                                </h3>
                                                                <span className='text-lg font-semibold'>Score: </span>
                                                                <span
                                                                    className={`text-lg font-semibold ${
                                                                        submission.total_score && submission.score / submission.total_score >= 0.6
                                                                        ? 'text-green-400'
                                                                        : 'text-orange-400'
                                                                    }`}
                                                                >{Number.isFinite(submission.score) ? submission.score : '—'} / {Number.isFinite(submission.total_score) ? submission.total_score : '—'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <span className="text-muted-foreground">•</span>
                                                                <span className="text-muted-foreground">{new Date(submission.submission_date_created).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </SignedIn>
        </div>
    );
}