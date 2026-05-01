"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/app/utils/providers/UserContext";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { AiOutlineShop, AiOutlineClockCircle, AiOutlineUpload } from "react-icons/ai";
import { useGetProfile, useUpdateProfile } from "@/app/queries/profile";

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function PartnerProfile() {
  const { user, isLoading: userLoading } = useUser();
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    logo: "",
    openHours: {} as any
  });

  useEffect(() => {
    if (profile) {
      console.log("[DEBUG_PROFILE_DATA]", profile);
      setFormData({
        name: profile.name || "",
        address: profile.address || "",
        logo: profile.logo || "",
        openHours: profile.openHours || {}
      });
    }
  }, [profile]);

  const handleOpenHoursChange = (day: string, type: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      openHours: {
        ...prev.openHours,
        [day]: {
          ...(prev.openHours[day] || { start: "09:00", end: "22:00" }),
          [type]: value
        }
      }
    }));
  };

  const handleToggleDay = (day: string) => {
    setFormData(prev => {
      const current = prev.openHours[day];
      return {
        ...prev,
        openHours: {
          ...prev.openHours,
          [day]: current ? null : { start: "09:00", end: "22:00" }
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[SUBMIT_PROFILE]", formData);
    updateProfileMutation.mutate(formData, {
      onSuccess: (data) => {
        console.log("[UPDATE_SUCCESS_DATA]", data);
      }
    });
  };

  if (userLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
              Restaurant Profile
            </h1>
            <p className="text-gray-500 mt-2">Manage your restaurant identity and operating hours</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <AiOutlineShop className="text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Restaurant Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter restaurant name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Street, City, Zip Code"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Logo URL</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter image URL (e.g. Cloudinary/S3 link)"
                  />
                  {formData.logo && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50 flex items-center justify-center">
                      <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 italic">Provide a URL for your restaurant logo hosted online.</p>
              </div>
            </div>
          </div>

          {/* Operating Hours Card */}
          <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <AiOutlineClockCircle className="text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Operating Hours</h2>
            </div>

            <div className="space-y-4">
              {DAYS.map(({ key, label }) => {
                const hours = formData.openHours[key];
                const isOpen = !!hours && hours.start !== undefined;

                return (
                  <div key={key} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl transition-all hover:bg-gray-50/50">
                    <div className="flex items-center gap-4 w-32">
                      <button
                        type="button"
                        onClick={() => handleToggleDay(key)}
                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${isOpen ? 'bg-orange-500' : 'bg-gray-300'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isOpen ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                      <span className={`font-medium ${isOpen ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                    </div>

                    {isOpen ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={hours?.start || "09:00"}
                          onChange={(e) => handleOpenHoursChange(key, 'start', e.target.value)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                        <span className="text-gray-400">to</span>
                        <input
                          type="time"
                          value={hours?.end || "22:00"}
                          onChange={(e) => handleOpenHoursChange(key, 'end', e.target.value)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">Closed all day</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className={`px-8 py-3 rounded-xl font-bold font-semibold shadow-lg transition-all transform active:scale-95 ${updateProfileMutation.isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-orange-200 hover:-translate-y-0.5'
                }`}
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    );
}
