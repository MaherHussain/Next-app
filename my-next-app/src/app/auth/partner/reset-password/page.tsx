"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import InputTextField from "@/app/components/shared/input-text-field";
import Button from "@/app/components/shared/Button";
import http from '@/app/services/http';
import { toast } from 'react-toastify';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing token");
            router.push("/auth/partner/login");
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsPending(true);
        try {
            await http.post("/auth/partner/reset-password", { token, password });
            toast.success("Password reset successful. Redirecting to login...");
            setTimeout(() => {
                router.push("/auth/partner/login");
            }, 2000);
        } catch (error: any) {
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Set New Password</h2>
                    <p className="text-gray-500 mt-2">Choose a strong password for your partner account.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <InputTextField
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            isRequired
                        />
                        <InputTextField
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            isRequired
                        />
                    </div>

                    <Button
                        buttonText="Reset Password"
                        isLoading={isPending}
                        isDisabled={!password || password !== confirmPassword || isPending}
                        clickHandler={() => {}}
                    />
                </form>
            </div>
        </div>
    );
}
