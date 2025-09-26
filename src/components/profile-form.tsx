"use client";

import { useState, useRef, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/app/utils/supabase/client"; // Corrected client import path
import { Camera, Upload, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/LanguageContext";

// A type for our profile data based on the Supabase DB schema
type Profile = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  college_name: string;
  location: string;
  phone_number: string;
  birthday: string;
};

interface ProfileFormProps {
  user: User;
  profile: Profile | null; // Profile can be null if it fails to load
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const { t } = useTranslation();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null); // For image preview
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    college_name: "",
    location: "",
    phone_number: "",
    birthday: "",
  });

  // Populate the form with fetched profile data when the component mounts
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        college_name: profile.college_name || "",
        location: profile.location || "",
        phone_number: profile.phone_number || "",
        birthday: profile.birthday || "",
      });
    }
  }, [profile]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: t("profile.messages.fileSizeError"),
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result as string);
      reader.readAsDataURL(file);
      // TODO: Implement Supabase Storage upload here
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          college_name: formData.college_name,
          location: formData.location,
          phone_number: formData.phone_number,
          birthday: formData.birthday,
        })
        .eq("id", user.id);

      if (error) throw error;

      setMessage({
        type: "success",
        text: t("profile.messages.profileUpdated"),
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: t("profile.messages.updateError", { message: error.message }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          {/* Left Column: Profile Picture */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-gray-100">
              {t("profile.photo.title")}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("profile.photo.description")}
            </p>
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500">
                      <span className="text-5xl font-medium text-white">
                        {formData.first_name?.[0]?.toUpperCase() ||
                          user.email?.[0]?.toUpperCase() ||
                          "A"}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-0 bottom-0 rounded-full bg-orange-600 p-2 text-white shadow-lg transition-colors hover:bg-orange-700"
                  aria-label={t("profile.photo.changePhotoAria")}
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-300 transition-colors ring-inset hover:bg-gray-50 dark:bg-gray-700/50 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-700"
              >
                <Upload className="h-4 w-4" />
                {t("profile.photo.changePhoto")}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Right Column: Account Details */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t("profile.form.username")}
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t("profile.form.firstName")}
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t("profile.form.lastName")}
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t("profile.form.emailAddress")}
                </label>
                <input
                  type="email"
                  id="email"
                  defaultValue={user.email}
                  className="mt-1 block w-full cursor-not-allowed rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  disabled
                  readOnly
                />
              </div>

              <div>
                <label
                  htmlFor="college_name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("profile.form.collegeName")}
                </label>
                <input
                  type="text"
                  id="college_name"
                  value={formData.college_name}
                  onChange={(e) =>
                    handleInputChange("college_name", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("profile.form.location")}
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("profile.form.phoneNumber")}
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange("phone_number", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="birthday"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("profile.form.birthday")}
                </label>
                <input
                  type="date"
                  id="birthday"
                  value={formData.birthday}
                  onChange={(e) =>
                    handleInputChange("birthday", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Footer */}
      <div className="flex items-center justify-end gap-x-4 border-t border-gray-900/10 bg-gray-50 px-6 py-4 dark:border-white/10 dark:bg-gray-800/50">
        {message && (
          <div
            className={`flex items-center gap-2 text-sm ${message.type === "success" ? "text-orange-500" : "text-red-500"}`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            {message.text}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "inline-flex justify-center rounded-md px-6 py-2 text-sm font-semibold text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none",
            isLoading
              ? "cursor-not-allowed bg-gray-500"
              : "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
          )}
        >
          {isLoading
            ? t("profile.messages.saving")
            : t("profile.messages.save")}
        </button>
      </div>
    </form>
  );
}
