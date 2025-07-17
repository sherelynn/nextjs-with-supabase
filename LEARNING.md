# Learning the Next.js Supabase Starter Kit

This guide provides a quick overview of the technologies and workflows used in this project.

## Core Technologies

- **Next.js:** A powerful React framework for building fast, modern web applications. It handles both the frontend (what users see) and parts of the backend (server-side logic).
- **Tailwind CSS:** A utility-first CSS framework that makes it easy to style your application by applying simple class names directly in your HTML.
- **Supabase:** An open-source alternative to Firebase that provides a complete backend, including a database, authentication, and file storage.

## Development Environment

- **Windsurf:** Your AI-powered coding assistant. It helps you write, debug, and understand code more efficiently.
- **GitHub Sync:** Your local project is connected to a GitHub repository. This allows you to save your work, collaborate with others, and keep a history of your changes.

## Built-in Authentication

This starter kit comes with a complete user authentication system powered by Supabase.

- **How it works:** When a user signs up or logs in, the application sends their credentials to Supabase. Supabase verifies them and, if successful, creates a secure session for the user.
- **User Flow:**
  - **Sign-up:** A new user is created in the `auth.users` table in your Supabase database.
  - **Login:** After a successful login, the user is automatically redirected to the `/protected` page. This is handled by the `LoginForm` component.

## Creating a User Profile

This project includes a simple profile system that allows users to add a first name, last name, and an avatar.

- **How it works:** The `ProfileForm` component allows users to input their details and upload an image. The image is stored in Supabase Storage, and a link to it is saved in the `profiles` table along with the user's other information.

## Installed Packages

Here are some of the key packages used in this project:

- `next`: The core Next.js framework.
- `react`, `react-dom`: The libraries for building the user interface.
- `@supabase/ssr`, `@supabase/supabase-js`: The official Supabase libraries for interacting with your backend.
- `tailwindcss`: The Tailwind CSS framework.
- `lucide-react`: A library of beautiful and simple icons.

## MCP Server Configuration

- **What is it?** The Model Context Protocol (MCP) server allows Windsurf to interact directly with your Supabase project. It can perform actions like checking for security advisories, running database queries, and managing your database schema.
- **Configuration:** To enable the MCP server, you need to provide your Supabase project's URL and Access Token during the initial setup. Once connected, this allows Windsurf to securely communicate with your backend.

## Development Rules

1.  **Keep it Simple:** Write clear, easy-to-understand code.
2.  **Test Your Changes:** Make sure your changes work as expected before moving on.
3.  **Use GitHub:** Regularly save your work by committing your changes to your GitHub repository.
4.  **Ask for Help:** If you get stuck, don't hesitate to ask Windsurf for assistance.
