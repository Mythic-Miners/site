'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Header from '@/components/ui/Header';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

// Function to clear all cookies and localStorage
const clearAllStorageAndCookies = () => {
  // Clear localStorage
  localStorage.clear();
  // Clear sessionStorage
  sessionStorage.clear();

  // Clear all cookies
  document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
  });

  fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
};

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isConnected, isLoading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isConnected) {
        clearAllStorageAndCookies();
        router.push(`/${language}`);
      } else {
        setIsChecking(false);
      }
    }
  }, [isConnected, isLoading, router, language]);

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="custom-bg">
        <Header />
        <div className="flex flex-col items-center justify-center h-screen"></div>
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-indigo-950/50">
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-8 w-8 text-cyan-50"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="hidden">{children}</div>
      </div>
    );
  }

  // If user is authenticated, render the header and children
  return (
    <div className="custom-bg">
      <Header />
      {children}
    </div>
  );
}
