import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/server'
import { CurrentUserAvatar } from '@/components/current-user-avatar'
import { DashboardNextSteps } from '@/app/_components/DashboardNextSteps'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/auth/login')
  }

  type UserMetadata = {
    display_name?: string
    full_name?: string
  }
  type Claims = {
    user_metadata?: UserMetadata
  }

  const claims = (data?.claims ?? null) as Claims | null
  const meta: UserMetadata = claims?.user_metadata ?? {}
  const name = (meta.display_name ?? meta.full_name) ?? 'User'


  return (
    <div className="w-full min-h-svh px-4 sm:px-6 py-8">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <CurrentUserAvatar />
            <div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                <span className="animate-gradient bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 bg-[length:100%_auto] bg-clip-text text-transparent">
                  Welcome,
                </span>
                <span className="ml-2 font-semibold text-neutral-900 dark:text-neutral-100">
                  {name}
                </span>
              </p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Here are a few quick next steps to get the most out of Sahay.
              </p>
            </div>
          </div>
        </div>

        {/* Next steps section with colorful motion cards */}
        <DashboardNextSteps />
      </div>
    </div>
  )
}