'use client';

import {useEffect, useState, useCallback} from 'react';
import {SignedIn, SignedOut, SignInButton, SignUpButton, useUser} from '@clerk/nextjs';
import React from 'react';
import {useRouter} from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Plus, Pencil, Trash2, FileText, LogIn, UserPlus, Terminal } from "lucide-react";

const AssignmentList = React.memo(({ assignments, onEdit, onDelete }) => (
  <div className="space-y-3">
    {assignments.map((assignment) => (
      <Card
        key={assignment.id}
        onClick={() => {
          window.location.href = `/dashboard/${assignment.id}`;
        }}
        className="group cursor-pointer bg-secondary/30 border-border/30 hover:bg-secondary/50 hover:border-border/60 transition-all duration-300"
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                {assignment.name}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{new Date(assignment.date_created).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(assignment);
                }}
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(assignment);
                }}
              >
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
));

export default function TeacherDashboardPage({serverAssignments}) {
    const {user} = useUser();

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null); // State to hold the assignment being edited
    const [newTitle, setNewTitle] = useState('');
    const router = useRouter();
    
    const [level, setLevel] = useState('');
    const [subject, setSubject] = useState('');
    const [assignments, setAssignments] = useState(serverAssignments || []);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAddingAssignment, setIsAddingAssignment] = useState(false);
    const [isDeletingAssignment, setIsDeletingAssignment] = useState(false);
    const [isEditingAssignment, setIsEditingAssignment] = useState(false); // New state for editing loading
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
                    <p className="text-muted-foreground text-lg mb-8">Please sign in to access your teacher dashboard</p>

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
                                                <AvatarFallback>{user?.fullName?.charAt(0) || 'T'}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card"></div>
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-foreground mb-1">
                                                Welcome back, {user?.fullName || 'Teacher'} 👋
                                            </h1>
                                            <p className="text-muted-foreground">Ready to manage your assignments</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span>Online</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 gap-6 mb-8">
                            <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/40 transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm">Total Assignments</p>
                                            <p className="text-2xl font-bold text-foreground">{assignments.length}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-card/40 backdrop-blur-sm border-border/50 shadow-2xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CardTitle>Assignments</CardTitle>
                                        <Badge variant="secondary">
                                            {assignments.length} total
                                        </Badge>
                                    </div>
                                    <div className="flex flex-row space-x-3">
                                        <Button onClick={() => router.push('/ide')}>
                                            <Terminal className="w-4 h-4" />
                                            Go to IDE
                                        </Button>
                                        <Button onClick={() => setShowAddForm(true)}>
                                            <Plus className="w-4 h-4" />
                                            Add Assignment
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>

                            {assignments.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">No assignments yet</h3>
                                    <p className="text-muted-foreground mb-6">Create your first assignment to get started</p>
                                    <Button onClick={() => setShowAddForm(true)}>
                                        Create Assignment
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {assignments.map((assignment) => (
                                        <Card
                                        key={assignment.id}
                                        onClick={() => {
                                            window.location.href = `/dashboard/${assignment.id}`;
                                        }}
                                        className="group cursor-pointer bg-secondary/30 border-border/30 hover:bg-secondary/50 hover:border-border/60 transition-all duration-300">
                                            <CardContent className="p-5">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                                                            {assignment.name}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="text-muted-foreground">•</span>
                                                            <span className="text-muted-foreground">{new Date(assignment.date_created).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingAssignment(assignment);
                                                                setNewTitle(assignment.name);
                                                            }}
                                                        >
                                                            <Pencil className="w-4 h-4 text-muted-foreground" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                setIsDeletingAssignment(true);
                                                                const res = await fetch("/api/DeleteAssignment", {
                                                                    method: "POST",
                                                                    headers: {"Content-Type": "application/json"},
                                                                    body: JSON.stringify({
                                                                        name: assignment.name,
                                                                        level: assignment.level,
                                                                        subject: assignment.subject, 
                                                                    }),
                                                                });

                                                                const data = await res.json();

                                                                if (data.error) {
                                                                    alert("Error adding assignment: " + data.error);
                                                                } else {
                                                                    setAssignments((prev) => 
                                                                        prev.filter((a) => 
                                                                            !(
                                                                                a.name === assignment.name
                                                                                && a.level === assignment.level
                                                                                && a.subject === assignment.subject
                                                                            )
                                                                        ),
                                                                    );
                                                                }
                                                                setIsDeletingAssignment(false);
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                                                        </Button>
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

            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" />
                            Add New Assignment
                        </DialogTitle>
                        <DialogDescription>
                            Create a new assignment for your students
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Assignment Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter assignment title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="score">Assignment Score</Label>
                            <Input
                                id="score"
                                type="number"
                                placeholder="Enter score"
                                value={totalScore}
                                onChange={(e) => setTotalScore(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={isAddingAssignment}
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
                                        totalScore: totalScore,
                                    }),
                                });

                                const data = await res.json();

                                if (data.error) {
                                    alert("Error adding assignment: " + data.error);
                                } else {
                                    setAssignments((prev) => [
                                        ...prev,
                                        {
                                            id: data.id || Date.now(),
                                            name: newTitle,
                                            level: level,
                                            subject: subject,
                                            date_created: new Date().toISOString(),
                                            totalScore: totalScore,
                                        },
                                    ]);
                                    setNewTitle('');
                                    setLevel('');
                                    setSubject('');
                                    setShowAddForm(false);
                                    setTotalScore(10);
                                }
                                setIsAddingAssignment(false);
                            }}
                        >
                            Create Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <Dialog open={!!editingAssignment} onOpenChange={(open) => { if (!open) setEditingAssignment(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Pencil className="w-5 h-5 text-yellow-400" />
                            Edit Assignment
                        </DialogTitle>
                        <DialogDescription>
                            Update the assignment details
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Assignment Title</Label>
                            <Input
                                id="edit-title"
                                placeholder="Enter assignment title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setEditingAssignment(null)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={isEditingAssignment}
                            onClick={async () => {
                                if (!newTitle.trim()) {
                                    alert("Title Required");
                                    return;
                                }

                                setIsEditingAssignment(true);
                                try {
                                    const res = await fetch("/api/EditAssignment", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            id: editingAssignment.id,
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
                                        setEditingAssignment(null);
                                    }
                                } catch (err) {
                                    console.error("Error updating assignment:", err);
                                    alert("An unexpected error occurred. Please try again.");
                                } finally {
                                    setIsEditingAssignment(false);
                                }
                            }}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}