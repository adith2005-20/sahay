"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { ProfileForm } from "@/components/profile-form";
import { useTranslation } from "@/contexts/LanguageContext";
import type { User } from "@supabase/supabase-js";

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

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push("/auth/login");
          return;
        }

        setUser(user);

        // Fetch the user's profile from the 'profiles' table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // Handle case where profile might not exist or there's an error
        if (profileError && profileError.code !== "PGRST116") {
          // PGRST116 means no rows found, which is ok
          console.error("Error fetching profile:", profileError);
        } else {
          setProfile(profile);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-gray-50 py-12 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-svh w-full bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            {t("profile.title")}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {t("profile.subtitle")}
          </p>
        </div>

        {/* Profile Form Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800">
          <ProfileForm user={user} profile={profile} />
        </div>
      </div>
    </div>
  );
}
