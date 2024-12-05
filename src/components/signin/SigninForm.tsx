"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { FormSchema } from "@/lib/schemas/formSchema";

type FormData = z.infer<typeof FormSchema>;

export default function LoginForm() {
  const callbackUrl = "/chat";
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
  
    console.log("SignIn Result:", result);
  
    if (result?.error) {
      console.error(result.error);
      showNotification("Invalid credentials, please try again.", 'error');
    } else {
      showNotification('Success! Redirecting...', 'success');
      window.location.href = callbackUrl; 
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
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email?.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <Input
            id="password"
            placeholder="Enter your password"
            type="password"
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password?.message}</p>}
        </div>

        <div className="text-right">
          <a href="#" className="text-sm text-gray-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Sign in
        </Button>
      </form>
    </div>
  );
}