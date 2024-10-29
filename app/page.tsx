import { Button } from '@/components/ui/button'
import { Smile } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


const page = () => {
  return (

    <div className=' w-full h-screen flex justify-center items-center '>
      <Link href={'/dashboard/portfolio'}>
        <Button><Smile></Smile></Button>
      </Link>
    </div>
  )
}

export default page