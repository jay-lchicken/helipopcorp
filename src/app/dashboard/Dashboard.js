'use client';

import {useEffect, useState} from 'react';
import {SignedIn, SignedOut, SignInButton, SignUpButton, useUser} from '@clerk/nextjs';

export default function DashboardPage({serverAssignments}) {
    const {user} = useUser();

    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [level, setLevel] = useState('');
    const [subject, setSubject] = useState('');
    const [assignments, setAssignments] = useState(serverAssignments || []);

    return (
        <div className="min-h-screen bg-[#00639A] text-white px-6 py-8">
            <SignedOut>
                <div className="flex flex-col items-center justify-center min-h-screen text-center">
                    <img className="w-[300px]" src="/klc.png" alt="KLC Logo"/>
                    <p className="text-2xl py-4">Welcome to the KLC Code IDE</p>
                    <div className="flex gap-4">
                        <SignInButton
                            mode="modal"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold"
                        />
                        <SignUpButton
                            mode="modal"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold"
                        />
                    </div>
                </div>
            </SignedOut>

            <SignedIn>
                {!user ? (
                    <div className="text-white text-center py-8">Loading your dashboard...</div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-6 flex flex-row items-center gap-3">
                            Welcome back,{" "}
                            <img
                                src={user.imageUrl}
                                alt={user.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                            />
                            {user?.fullName || 'Coder'} 👋
                        </h1>

                        {/* Assignments Section */}
                        <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-xl font-semibold">Assignments</h2>
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-1 rounded-full transition"
                            >
                                + Add
                            </button>
                        </div>

                        {showForm && (
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                                <div className="bg-[#004e7a] p-6 rounded-lg shadow-xl w-[90%] max-w-md">
                                    <h3 className="text-lg font-semibold mb-4">Add New Assignment</h3>

                                    <input
                                        type="text"
                                        placeholder="Assignment title"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="w-full px-3 py-2 mb-3 rounded bg-white/10 text-white placeholder-white/50 outline-none"
                                    />

                                    <div className="flex gap-2 mb-4">
                                        <select
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            className="w-1/2 px-3 py-2 rounded bg-white/10 text-white outline-none"
                                        >
                                            <option value="">Select Level</option>
                                            {["P1", "P2", "P3", "P4", "P5", "P6", "S1", "S2", "S3", "S4"].map((lvl) => (
                                                <option key={lvl} value={lvl}>{lvl}</option>
                                            ))}
                                        </select>

                                        <select
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className="w-1/2 px-3 py-2 rounded bg-white/10 text-white outline-none"
                                        >
                                            <option value="">Select Subject</option>
                                            {["Python", "C++", "Web", "Scratch", "Others"].map((subj) => (
                                                <option key={subj} value={subj}>{subj}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setShowForm(false)}
                                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={async () => {
                                                if (!newTitle.trim()) return;
                                                const res = await fetch("/api/NewAssignment", {
                                                    method: "POST",
                                                    headers: {"Content-Type": "application/json"},
                                                    body: JSON.stringify({
                                                        name: newTitle,
                                                        level,
                                                        subject,
                                                        userId: user.id,
                                                        email: user.primaryEmailAddress?.emailAddress,
                                                    }),
                                                });

                                                const data = await res.json();

                                                if (data.error) {
                                                    alert("Error adding assignment: " + data.error);
                                                } else {
                                                    setAssignments((prev) => [
                                                        ...prev,
                                                        {
                                                            name: newTitle,
                                                            level: level,

                                                            subject: subject,
                                                        },
                                                    ]);
                                                    setNewTitle('');
                                                    setLevel('');
                                                    setSubject('');
                                                    setShowForm(false);
                                                }
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <p className="text-sm text-white/60 mb-1">Recent assignments</p>
                            <ul className="space-y-2">
                                {assignments.map((a, i) => (
                                    <li key={i} className="p-4 bg-white/10 rounded-lg">
                                        {a.name} <br/>
                                        <span className="text-sm text-white/70">
                      {a.level && a.subject ? a.level + ", " + a.subject : "Unknown"}
                    </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </SignedIn>
        </div>
    );
}