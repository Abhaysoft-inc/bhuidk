'use client'

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would use NextAuth signIn
    // For the hackathon, we simply redirect to the authenticated app
    router.push('/app');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-sm overflow-hidden flex items-center justify-center shadow-card border border-border">
            <img src="/logo.jpg" alt="BhoomiIntel Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-serif font-semibold text-primary">BhoomiIntel</span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-serif tracking-tight text-primary">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-mutedForeground">
          Or{' '}
          <Link href="/signup" className="font-medium text-accent hover:text-accent-light">
            request institutional access
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card border border-border sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleMockLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Official Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue="admin@gov.in"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-sm shadow-sm placeholder-mutedForeground focus:outline-none focus:ring-accent focus:border-accent sm:text-sm bg-background"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  defaultValue="password123"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-sm shadow-sm placeholder-mutedForeground focus:outline-none focus:ring-accent focus:border-accent sm:text-sm bg-background"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-accent focus:ring-accent border-border rounded-sm"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-accent hover:text-accent-light">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-sm shadow-card text-sm font-medium text-background bg-primary hover:bg-primary-light focus:outline-none transition-colors"
              >
                Sign in (Demo Mode)
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-mutedForeground">
                  Hackathon Quick Login
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleMockLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-border rounded-sm shadow-sm bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Researcher
              </button>
              <button
                onClick={handleMockLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-border rounded-sm shadow-sm bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                GIS Analyst
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
