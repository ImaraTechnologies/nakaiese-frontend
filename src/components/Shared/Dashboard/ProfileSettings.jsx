'use client';

import React, { useState, useEffect, useRef } from "react";
import { Camera, Save, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import InputGroup from "./InputGroup";
import { useProfile } from "@/hooks/useProfile";

const ProfileSettings = () => {
    const { profile, loading, updateProfile, error, refetch } = useProfile();
    const fileInputRef = useRef(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    // State for text fields
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_no: "",
        bio: ""
    });

    console.log("Profile Data in Component:", formData); // Debug: Check if profile data is received correctly

    // State specifically for the image
    const [selectedImage, setSelectedImage] = useState(null); // The actual file to upload
    const [imagePreview, setImagePreview] = useState(null);   // The URL to show on screen

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Only update the form if we haven't done it yet AND profile exists
        if (profile && !dataLoaded) {
            setFormData({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                email: profile.email || "",
                phone_no: profile.phone_no || "",
                bio: profile.bio || ""
            });
            setDataLoaded(true); // Lock it so it doesn't reset while you type
        }
    }, [profile, dataLoaded]);

    // 1. Handle Text Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (saveMessage.text) setSaveMessage({ type: '', text: '' });
    };

    // 2. Handle Image Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Create a local preview URL so the user sees the image immediately
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    // 3. Trigger File Input Click
    const handleCameraClick = () => {
        fileInputRef.current.click();
    };

    // 4. Submit Form (with File)
    const handleSubmit = async () => {
        setIsSaving(true);
        setSaveMessage({ type: '', text: '' });

        try {
            const data = new FormData();
            data.append("first_name", formData.first_name);
            data.append("last_name", formData.last_name);
            data.append("phone_no", formData.phone_no);
            data.append("bio", formData.bio);

            if (selectedImage) {
                data.append("profile_image", selectedImage);
            }

            // 🔍 DEBUG: Check console to ensure data exists before sending
            console.log("--- Sending Data ---");
            for (const pair of data.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }

            // Make sure updateProfile accepts the second argument for config 
            // if your hook allows passing custom headers, otherwise fix the hook.
            await updateProfile(data);

            await refetch();
            setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });

        } catch (err) {
            console.error("Update failed:", err);
            setSaveMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b border-slate-100 pb-8">

                {/* Image Upload Area */}
                <div
                    className="relative group cursor-pointer"
                    onClick={handleCameraClick}
                >
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden relative">
                        <Image
                            // Priority: 1. Local Preview (User just selected) -> 2. API Image -> 3. Fallback
                            src={imagePreview || profile?.profile_image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"}
                            alt="Profile"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 150px"
                        />
                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    {/* Floating Camera Icon */}
                    <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                        <Camera className="w-3.5 h-3.5" />
                    </div>

                    {/* Hidden Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                    />
                </div>

                <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-slate-900">
                        {profile?.full_name || "Admin User"}
                    </h3>
                    <p className="text-sm text-slate-500 max-w-sm mt-1">
                        Click the picture to upload a new photo.
                    </p>
                </div>
            </div>

            {/* Feedback Message */}
            {saveMessage.text && (
                <div className={`p-4 rounded-lg flex items-center gap-2 text-sm ${saveMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {saveMessage.type === 'success' ? <Save className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {saveMessage.text}
                </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputGroup
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="e.g. Munir"
                />
                <InputGroup
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="e.g. Rasool"
                />
                <InputGroup
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={formData.email}
                    readOnly
                    disabled={true}
                />
                <InputGroup
                    label="Phone Number"
                    type="tel"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                />

                <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Bio</label>
                    <textarea
                        name="bio"
                        rows={3}
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none placeholder:text-slate-400"
                        placeholder="Write a short bio..."
                        maxLength={200}
                    />
                    <div className="flex justify-end">
                        <span className={`text-xs ${formData.bio.length > 190 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                            {formData.bio.length}/200 characters
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer / Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                <button
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    onClick={() => {
                        if (profile) {
                            setFormData({
                                first_name: profile.first_name || "",
                                last_name: profile.last_name || "",
                                email: profile.email || "",
                                phone_no: profile.phone_no || "",
                                bio: profile.bio || ""
                            });
                            setImagePreview(null);
                            setSelectedImage(null);
                            setSaveMessage({ type: '', text: '' });
                        }
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;