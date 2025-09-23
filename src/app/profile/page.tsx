import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server' // Corrected server client import
import { ProfileForm } from '@/components/profile-form'

export default async function ProfilePage() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch the user's profile from the 'profiles' table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Handle case where profile might not exist or there's an error
  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is ok
    console.error('Error fetching profile:', error)
  }

  return (
    <div className="w-full min-h-svh bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Account Settings
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Manage your account information and preferences.
          </p>
        </div>

        {/* Profile Form Card */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          <ProfileForm user={user} profile={profile} />
        </div>
      </div>
    </div>
  )
}

