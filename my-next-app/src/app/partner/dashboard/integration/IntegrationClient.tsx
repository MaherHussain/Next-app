"use client";
import { useUser } from "@/app/utils/providers/UserContext";
import { useState } from "react";
import { FiCode, FiCopy, FiExternalLink } from "react-icons/fi";
import { toast } from "react-toastify";

export default function IntegrationClient() {
  const { user } = useUser();
  const restaurantId = user?.restaurantId || "[YOUR_RESTAURANT_ID]";
  const widgetUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/widget/${restaurantId}`;
  
  const embedCode = `<iframe 
  src="${widgetUrl}" 
  width="100%" 
  height="400" 
  style="border:none; border-radius:12px; overflow:hidden;" 
  title="ZFood Quick Order">
</iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied to clipboard!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quick Order Widget</h1>
        <p className="text-gray-600">
          Boost your sales by embedding our high-conversion ordering widget directly on your existing website or landing page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1: Preview */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FiExternalLink className="text-orange-500" /> Preview
            </h2>
            <a href={widgetUrl} target="_blank" className="text-sm text-blue-600 hover:underline">
              Open in new tab
            </a>
          </div>
          <div className="border border-gray-300 rounded-xl bg-white overflow-hidden h-[400px]">
             <iframe src={widgetUrl} width="100%" height="400" style={{ border: 'none' }} title="Preview"></iframe>
          </div>
        </div>

        {/* Step 2: Code */}
        <div className="flex flex-col gap-6">
          <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiCode className="text-orange-400" /> Embed Code
              </h2>
              <button 
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-orange-400"
                title="Copy Code"
              >
                <FiCopy className="w-5 h-5" />
              </button>
            </div>
            <pre className="text-xs bg-gray-900 p-4 rounded-lg overflow-x-auto text-gray-300">
              <code>{embedCode}</code>
            </pre>
          </div>

          <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
            <h3 className="font-bold text-orange-800 mb-2">Pro Tip</h3>
            <p className="text-sm text-orange-700">
              Only products marked as <strong>"Featured"</strong> in your product management panel will appear in this widget. This keeps the widget focused on your best-sellers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
