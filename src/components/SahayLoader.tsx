import Image from "next/image";

import React from 'react'

const SahayLoader = () => {
  return (
    <Image src={'/sahayloader.svg'} width={150} height={150} alt={'Sahay Loader'} className="mx-auto block animate-spin" priority={true}>
        
    </Image>
  )
}

export default SahayLoader
