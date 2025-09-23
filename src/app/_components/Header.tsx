import React from 'react'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'

const Header = () => {
  return (
    <div className='sticky flex-col top-0 z-50 w-full dark:bg-background/40 bg-background pt-1 backdrop-blur-md justify-center'>
      <Image className='justify-center mx-auto -translate-x-3' src={'/sahay.svg'} width={80} height={80} alt={'Sahay logo'}/>
      <Separator className="mt-1"/>
    </div>
  )
}

export default Header
