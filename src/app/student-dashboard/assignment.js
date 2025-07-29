'use client';

import {useEffect, useState, useCallback} from 'react';
import {SignedIn, SignedOut, SignInButton, SignUpButton, useUser} from '@clerk/nextjs';
import React from 'react';


export default function StudentDashboardPage({serverSubmissions}) {
    const {user} = useUser();
    const [editingSubmission, setEditingSubmission] = useState(null); // State to hold the submission being edited
    const [newTitle, setNewTitle] = useState('');
    const [submissions, setSubmissions] = useState(serverSubmissions || []);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDeletingSubmission, setIsDeletingSubmission] = useState(false);
    const [isEditingSubmission, setIsEditingSubmission] = useState(false); // New state for editing loading
    const [totalScore, setTotalScore] = useState('');
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-screen text-white px-6 py-8">
            <SignedOut>
                <div className="flex flex-col items-center justify-center min-h-screen text-center">
                    <div className="relative group mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-110"></div>
                        <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                            <img className="w-[280px] h-auto drop-shadow-2xl" src="/klc.png" alt="KLC Logo"/>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
                        Welcome to the KLC Code IDE
                    </h1>
                    <p className="text-slate-300 text-lg mb-8">Please sign in to access your student dashboard</p>

                    <div className="flex gap-6">
                        <SignInButton
                            mode="modal"
                            className="group px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative">Sign In</span>
                        </SignInButton>
                        <SignUpButton
                            mode="modal"
                            className="group px-8 py-3 bg-slate-700/50 text-white rounded-xl shadow-lg hover:bg-slate-600/50 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold border border-slate-600/50 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative">Sign Up</span>
                        </SignUpButton>
                    </div>
                </div>
            </SignedOut>

            <SignedIn>
                {!user ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-slate-300 text-lg">Loading your dashboard...</p>
                        </div>
                    </div>
                ) : (
                    <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl mb-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={user.imageUrl}
                                            alt={user.name}
                                            className="w-16 h-16 rounded-full border-2 border-blue-500/30 shadow-lg"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800"></div>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-white mb-1">
                                            Welcome back, {user?.fullName || 'Student'} 👋
                                        </h1>
                                        <p className="text-slate-400">Ready to manage your submissions</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Online</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-white">Submissions</h2>
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full border border-blue-500/30">
                                        {submissions.length} total
                                    </span>
                                </div>
                            </div>

                            {submissions.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No submissions yet</h3>
                                    <p className="text-slate-400 mb-6">Go to the IDE to start coding!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {submissions.map((submission) => (
                                        <div 
                                        onClick={() => {
                                            window.location.href = `/student-dashboard/${submission.submission_id}`;
                                        }}
                                        key={submission.id} className="group bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 hover:bg-slate-700/40 hover:border-slate-600/50 transition-all duration-300">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                                                        <h3 className="inline text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
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
                                                        <span className="text-slate-400">•</span>
                                                        <span className="text-slate-400">{new Date(submission.submission_date_created).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent navigation
                                                        setEditingSubmission(submission);
                                                        setNewTitle(submission.name);
                                                    }}
                                                    className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors duration-200">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors duration-200">
                                                        <svg
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            setIsDeletingSubmission(true);
                                                            const res = await fetch("/api/DeleteSubmission", {
                                                                method: "POST",
                                                                headers: {"Content-Type": "application/json"},
                                                                body: JSON.stringify({
                                                                    name: submission.name,
                                                                    level: submission.level,
                                                                    subject: submission.subject, 
                                                                }),
                                                            });

                                                            const data = await res.json();

                                                            if (data.error) {
                                                                alert("Error deleting submission: " + data.error);
                                                            } else {
                                                                setSubmissions((prev) => 
                                                                    prev.filter((a) => 
                                                                        !(
                                                                            a.name === submission.name
                                                                            && a.level === submission.level
                                                                            && a.subject === submission.subject
                                                                        )
                                                                    ),
                                                                );
                                                            }
                                                            setIsDeletingSubmission(false);
                                                            }}
                                                            className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </SignedIn>

            {isEditingSubmission && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md relative">
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Submission
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Submission Title</label>
                                <input
                                type="text"
                                placeholder="Enter submission title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                />
                            </div>
                        </div>
                
                        <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={() => setEditingSubmission(null)}
                            className="px-6 py-3 bg-slate-600/50 hover:bg-slate-600/70 text-white rounded-xl font-semibold transition-all duration-300 border border-slate-500/50"
                        >
                            Cancel
                        </button>
                
                        <button
                            onClick={async () => {
                                if (!newTitle.trim()) {
                                    alert("Title Required");
                                    return;
                                }

                                setIsEditingSubmission(true); // Set loading state for editing
                                try {
                                    const res = await fetch("/api/EditSubmission", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            id: editingSubmission.id,
                                            name: newTitle,
                                        }),
                                    });

                                    const data = await res.json();
                                    if (data.error) {
                                        alert("Error editing submission: " + data.error);
                                    } else {
                                        setSubmissions((prev) =>
                                            prev.map((a) =>
                                                a.id === editingSubmission.id
                                                    ? { ...a, name: newTitle }
                                                    : a
                                            )
                                        );
                                        setNewTitle('');
                                        setEditingSubmission(null);
                                    }
                                } catch (err) {
                                    console.error("Error updating submission:", err);
                                    alert("An unexpected error occurred. Please try again.");
                                } finally {
                                    setIsEditingSubmission(false);
                                }
                            }}
                            className="group px-6 py-3 bg-gradient-to-r disabled:opacity-50 from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
                            disabled={isEditingSubmission} 
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative">Save Changes</span>
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
}