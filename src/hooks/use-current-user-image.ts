import { createClient } from '@/lib/client'
import { useEffect, useState } from 'react'

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserImage = async () => {
      const { data, error } = await createClient().auth.getSession()
      if (error) {
        console.error(error)
      }

      const avatarUrl = (data?.session?.user?.user_metadata as { avatar_url?: string } | undefined)?.avatar_url ?? null
      setImage(avatarUrl)
    }
    void fetchUserImage()
  }, [])

  return image
}
