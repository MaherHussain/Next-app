"use client";
import React, { useState } from 'react';
import InputTextField from "@/app/components/shared/input-text-field";
import Button from "@/app/components/shared/Button";
import Link from 'next/link';
import http from '@/app/services/http';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        try {
            const response = await http.post("/auth/partner/forgot-password", { email });
            toast.success(response.data.message);
            setSubmitted(true);
        } catch (error: any) {
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        } finally {
            setIsPending(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                    <p className="text-gray-500">
                        If an account exists for {email}, you will receive a password reset link shortly.
                    </p>
                    <div className="pt-4">
                        <Link href="/auth/partner/login" className="text-orange-600 font-semibold hover:text-orange-700">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Forgot Password?</h2>
                    <p className="text-gray-500 mt-2">Enter your email and we'll send you a link to reset your password.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <InputTextField
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        isRequired
                    />

                    <Button
                        buttonText="Send Reset Link"
                        isLoading={isPending}
                        isDisabled={!email || isPending}
                        clickHandler={() => {}}
                    />

                    <div className="text-center mt-4">
                        <Link href="/auth/partner/login" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
