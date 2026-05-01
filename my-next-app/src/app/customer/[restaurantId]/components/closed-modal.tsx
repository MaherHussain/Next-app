"use client";
import React from 'react';
import { AiOutlineClockCircle, AiOutlineInfoCircle } from 'react-icons/ai';

interface ClosedModalProps {
    restaurantName?: string;
    nextOpening?: { day: string, time: string } | null;
}

export default function ClosedModal({ restaurantName, nextOpening }: ClosedModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform animate-in slide-in-from-bottom-8 duration-500">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 text-white text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-orange-50 mb-4">
                        <AiOutlineClockCircle className="text-4xl text-orange-600 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">{restaurantName || 'Restaurant'}</h2>
                        <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mt-2">
                            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                            Currently Closed
                        </div>
                    </div>
                </div>

                <div className="p-8 text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-gray-600 text-lg">We are currently not accepting orders.</p>
                        {nextOpening ? (
                            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mt-4">
                                <p className="text-orange-800 text-sm font-medium uppercase tracking-wider">Next opening</p>
                                <p className="text-2xl font-bold text-orange-900 mt-1">
                                    {nextOpening.day === 'today' ? 'Today' : nextOpening.day} at {nextOpening.time}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic mt-4">Check back later for opening hours.</p>
                        )}
                    </div>

                    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl text-left">
                        <AiOutlineInfoCircle className="text-xl text-gray-400 mt-0.5" />
                        <p className="text-xs text-gray-500 leading-relaxed">
                            To ensure the best quality and freshness, we only accept orders during our business hours. 
                            You can still browse our menu once we reopen.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
