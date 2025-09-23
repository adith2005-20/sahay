'use client'
import React from 'react'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  return (
    <div className='sticky flex-col top-0 z-50 w-full dark:bg-background/40 bg-background pt-1 backdrop-blur-md justify-center'>
      <Link href={'/dashboard'}>
      <Image className='justify-center mx-auto -translate-x-3' src={'/sahay.svg'} width={80} height={80} alt={'Sahay logo'}/>
      </Link>
      <nav className="flex justify-center gap-6 py-2">
        <Link
          href="/jobs"
          className={`text-sm font-medium hover:underline underline-offset-4 ${pathname?.startsWith('/jobs') ? 'text-primary underline' : 'text-muted-foreground'}`}
        >
          Jobs
        </Link>
        <Link
          href="/certifications"
          className={`text-sm font-medium hover:underline underline-offset-4 ${pathname?.startsWith('/certifications') ? 'text-primary underline' : 'text-muted-foreground'}`}
        >
          Certifications
        </Link>
      </nav>
      <Separator className="mt-1"/>
    </div>
  )
}

export default Header
