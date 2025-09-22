import { createClient } from '@/lib/client'
import { useEffect, useState } from 'react'

export const useCurrentUserName = () => {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfileName = async () => {
      const { data, error } = await createClient().auth.getSession()
      if (error) {
        console.error(error)
      }

      const fullName = (data?.session?.user?.user_metadata as { full_name?: string } | undefined)?.full_name ?? null
      setName(fullName)
    }

    void fetchProfileName()
  }, [])

  return name ?? '?'
}