"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId="886916002371-9a1rl4kal3f70ddhdq5117s23b4bdejf.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
