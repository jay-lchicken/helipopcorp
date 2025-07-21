'use client';

import {useEffect, useState, useCallback} from 'react';
import {SignedIn, SignedOut, SignInButton, SignUpButton, useUser} from '@clerk/nextjs';
import React from 'react';

const AssignmentList = React.memo(({ assignments, onEdit, onDelete }) => (
  <div className="space-y-4">
    {assignments.map((assignment) => (
      <div
        key={assignment.id}
        onClick={() => {
          window.location.href = `/dashboard/${assignment.id}`;
        }}
        className="group bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 hover:bg-slate-700/40 hover:border-slate-600/50 transition-all duration-300"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
              {assignment.name}
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">{new Date(assignment.date_created).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(assignment);
              }}
              className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(assignment);
              }}
              className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
));

export default function TeacherDashboardPage({serverAssignments}) {
    const {user} = useUser();

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null); // State to hold the assignment being edited
    const [newTitle, setNewTitle] = useState('');
    
    const [level, setLevel] = useState('');
    const [subject, setSubject] = useState('');
    const [assignments, setAssignments] = useState(serverAssignments || []);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAddingAssignment, setIsAddingAssignment] = useState(false);
    const [isDeletingAssignment, setIsDeletingAssignment] = useState(false);
    const [isEditingAssignment, setIsEditingAssignment] = useState(false); // New state for editing loading

    const handleEdit = useCallback((assignment) => {
        setEditingAssignment(assignment);
        setNewTitle(assignment.name);
    }, []);

    const handleDelete = useCallback(async (assignment) => {
        setIsDeletingAssignment(true);
        try {
            const res = await fetch('/api/DeleteAssignment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assignment),
            });
            const data = await res.json();
            if (!data.error) {
                setAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
            } else {
                alert('Error deleting assignment: ' + data.error);
            }
        } catch (err) {
            console.error('Error deleting assignment:', err);
        } finally {
            setIsDeletingAssignment(false);
        }
    }, []);

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
                    <p className="text-slate-300 text-lg mb-8">Please sign in to access your teacher dashboard</p>

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
                                            Welcome back, {user?.fullName || 'Teacher'} 👋
                                        </h1>
                                        <p className="text-slate-400">Ready to manage your assignments</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Online</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/40 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">Total Assignments</p>
                                        <p className="text-2xl font-bold text-white">{assignments.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/40 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">Total Submissions</p>
                                        <p className="text-2xl font-bold text-white">0</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-white">Assignments</h2>
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full border border-blue-500/30">
                                        {assignments.length} total
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span className="relative">Add Assignment</span>
                                </button>
                            </div>

                            {assignments.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No assignments yet</h3>
                                    <p className="text-slate-400 mb-6">Create your first assignment to get started</p>
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300"
                                    >
                                        Create Assignment
                                    </button>
                                </div>
                            ) : (
                                <AssignmentList assignments={assignments} onEdit={handleEdit} onDelete={handleDelete} />
                            )}
                        </div>
                    </div>
                )}
            </SignedIn>

            {showAddForm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md relative">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add New Assignment
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Assignment Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter assignment title"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="px-6 py-3 bg-slate-600/50 hover:bg-slate-600/70 text-white rounded-xl font-semibold transition-all duration-300 border border-slate-500/50"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={async () => {

                                        if (!newTitle.trim()) {
                                            alert("Title Required")
                                            return;
                                        }

                                        setIsAddingAssignment(true);
                                        const res = await fetch("/api/NewAssignment", {
                                            method: "POST",
                                            headers: {"Content-Type": "application/json"},
                                            body: JSON.stringify({
                                                name: newTitle,
                                            }),
                                        });

                                        const data = await res.json();

                                        if (data.error) {
                                            alert("Error adding assignment: " + data.error);
                                        } else {
                                            // Assuming your API returns the newly created assignment with an ID
                                            // For now, we'll simulate an ID if not returned.
                                            setAssignments((prev) => [
                                                ...prev,
                                                {
                                                    id: data.id || Date.now(), // Use ID from API or a temporary one
                                                    name: newTitle,
                                                    level: level,
                                                    subject: subject,
                                                    date_created: new Date().toISOString(),
                                                },
                                            ]);
                                            setNewTitle('');
                                            setLevel('');
                                            setSubject('');
                                            setShowAddForm(false);
                                        }
                                        setIsAddingAssignment(false);

                                    }}
                                    className="group px-6 py-3 bg-gradient-to-r disabled:opacity-50 from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
                                    disabled={isAddingAssignment}
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative">Create Assignment</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {editingAssignment && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md relative">
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Assignment
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Assignment Title</label>
                                <input
                                type="text"
                                placeholder="Enter assignment title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                />
                            </div>
                        </div>
                
                        <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={() => setEditingAssignment(null)}
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

                                setIsEditingAssignment(true); // Set loading state for editing
                                try {
                                    const res = await fetch("/api/EditAssignment", { // Correct API endpoint
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            id: editingAssignment.id, // Send the ID of the assignment
                                            name: newTitle,
                                        }),
                                    });

                                    const data = await res.json();
                                    if (data.error) {
                                        alert("Error editing assignment: " + data.error);
                                    } else {
                                        setAssignments((prev) =>
                                            prev.map((a) =>
                                                a.id === editingAssignment.id
                                                    ? { ...a, name: newTitle }
                                                    : a
                                            )
                                        );
                                        setNewTitle('');
                                        setEditingAssignment(null); // Close the edit form
                                    }
                                } catch (err) {
                                    console.error("Error updating assignment:", err);
                                    alert("An unexpected error occurred. Please try again.");
                                } finally {
                                    setIsEditingAssignment(false); // Reset loading state
                                }
                            }}
                            className="group px-6 py-3 bg-gradient-to-r disabled:opacity-50 from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
                            disabled={isEditingAssignment} // Disable button during API call
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