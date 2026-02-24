# KLC Code IDE
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/jay-lchicken/helipopcorp)

KLC Code IDE is a full-featured, web-based Integrated Development Environment designed for educational purposes. Built with Next.js and leveraging the power of Monaco Editor, it provides a seamless coding experience for both students and teachers. The platform supports multiple programming languages, real-time code execution, and a role-based dashboard system for managing assignments.

## Features

-   **Role-Based User Management**: Secure authentication and authorization using Clerk, with distinct roles for 'students' and 'teachers'.
-   **Advanced Code Editor**: Powered by Monaco Editor (the editor that powers VS Code), offering syntax highlighting, theme selection, and a familiar coding environment.
-   **Multi-Language Support**: Execute code in a variety of popular languages, including JavaScript, Python, C++, Java, and more, via the Judge0 API.
-   **Integrated Terminal**: An in-browser terminal powered by Xterm.js displays real-time output, errors, and execution status.
-   **Teacher Dashboard**: An intuitive interface for teachers to create, view, and manage coding assignments for their students.
-   **Student Dashboard**: A centralized place for students to view their assigned tasks.
-   **Database Integration**: Persists user and assignment data using a PostgreSQL database.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Authentication**: [Clerk](https://clerk.com/)
-   **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
-   **Terminal Emulator**: [Xterm.js](https://xtermjs.org/)
-   **Code Execution**: [Judge0 API](https://judge0.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) with the `pg` library

## Environment Variables

To run this project locally, create a `.env.local` file in the root of your project and add the following environment variables.

```env
# The public URL of your application
NEXT_PUBLIC_URL=http://localhost:3000

# Clerk Authentication Keys
# Get these from your Clerk dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# PostgreSQL Database Connection String
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm
-   A running PostgreSQL database instance.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jay-lchicken/helipopcorp.git
    cd helipopcorp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    Connect to your PostgreSQL instance and run the idempotent init script. It is safe to run on every deployment — tables are only created if they do not already exist:

    ```bash
    psql "$DATABASE_URL" -f init.sql
    ```

4.  **Configure Environment Variables:**
    Create a `.env.local` file in the project root and populate it with your keys and database connection string as described in the [Environment Variables](#environment-variables) section.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

The application uses Next.js API Routes to handle backend logic.

-   `GET /api/usersync`: Synchronizes user data from Clerk to the local database upon login. It checks if a user exists and creates a new record if they don't.
-   `GET /api/GetAssignments`: Fetches assignments. Teachers can view all assignments, while students can only see their own.
-   `POST /api/NewAssignment`: Allows authenticated teachers to create and save a new assignment to the database.
-   `POST /api/SubmitAssignment`: Receives source code and a language ID, forwards it to the Judge0 API for execution, and returns the result (stdout or stderr).
-   `POST /api/clerk-webhook`: Handles the `user.created` event from Clerk Webhooks to automatically create user records in the database.

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
