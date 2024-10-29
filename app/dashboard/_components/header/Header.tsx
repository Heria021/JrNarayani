import { ModeToggle } from '@/components/shared/Mode'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import React from 'react'

const Header = () => {
    const handleSignOut = async () => {
        await signOut({ redirect: true, callbackUrl: "/auth/signin" });
      };
    
    return (
        <div className='w-full'>
            <div className="flex items-center justify-between h-16 mb-1 px-4">
                <div className=""></div>
                <div className="flex gap-2">
                    <ModeToggle />
                    <Button variant="outline" size="icon" onClick={handleSignOut}>
                        <LogOut className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                </div>
            </div>
            <div className="w-full border-b border-border space-y-2">
            </div>
        </div>
    )
}

export default Header
