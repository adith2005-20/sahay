import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/server'
import { CurrentUserAvatar } from '@/components/current-user-avatar'

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
    <div className="flex-col h-svh w-full gap-2 my-8 px-16">
      <div className='flex grid-rows-3 gap-8 items-end-safe'>
        <CurrentUserAvatar/>
      <p className='text-5xl font-black mt-4 mb-4'>
        Welcome{`,`} <span className='font-normal'>{name}</span>
      </p>
      <div className='mx-auto mb-4'>
        <LogoutButton/>
      </div>
      </div>
    </div>
  )
}