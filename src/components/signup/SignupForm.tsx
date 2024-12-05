"use client"

import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';
import { SignupSchema } from '@/lib/schemas/signup';

export default function SignupForm() {
  const callbackUrl = "/chat"
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = SignupSchema.safeParse({ name, email, password, confirmPassword });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(
        Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0] || ''])
      ));
      return;
    }

    setErrors({});

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        showNotification(signInResult.error, 'error');
      } else {
        showNotification('Success! Redirecting...', 'success');
        router.push(callbackUrl);
      }
    } else {
      const errorData = await res.json();
      showNotification(errorData.message || "Signup failed", 'error');
    }
  };

  return (
    <div className="relative">
      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-opacity duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <Input 
            id="name" 
            placeholder="Enter your full name" 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="text-red-600 text-sm">{errors.name}</span>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input 
            id="email" 
            placeholder="Enter your email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="text-red-600 text-sm">{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <Input 
            id="password" 
            placeholder="Create a password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="text-red-600 text-sm">{errors.password}</span>}
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <Input 
            id="confirm-password" 
            placeholder="Confirm your password" 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <span className="text-red-600 text-sm">{errors.confirmPassword}</span>}
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Sign Up</Button>
      </form>
    </div>
  );
}