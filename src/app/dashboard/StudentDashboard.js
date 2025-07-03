'use client';

import {useEffect, useState} from 'react';
import {SignedIn, SignedOut, SignInButton, SignUpButton, useUser} from '@clerk/nextjs';

export default function StudentDashboardPage({serverAssignments}) {
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




                    </>
                )}
            </SignedIn>
        </div>
    );
}