"use client"

import { ModeToggle } from '@/components/shared/Mode'
import { Button } from '@/components/ui/button'
import { LogOut, Bell, ChevronRight } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { NotificationButton } from './NotificationButton'
import Link from 'next/link'

interface HeaderProps {
  className?: string
}

const getBreadcrumbs = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean)
  return paths.map((path, index) => ({
    title: path.charAt(0).toUpperCase() + path.slice(1),
    href: '/' + paths.slice(0, index + 1).join('/'),
    isLast: index === paths.length - 1
  }))
}

export const Header = ({ className }: HeaderProps) => {
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbs(pathname)

  const handleSignOut = async () => {
    await signOut({ 
      redirect: true, 
      callbackUrl: "/auth/signin" 
    })
  }
  
  return (
    <header className={cn(
      "w-full bg-background border-b p-1",
      className
    )}>
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 mx-1" />
                )}
                {crumb.isLast ? (
                  <span className="font-medium text-foreground">
                    {crumb.title}
                  </span>
                ) : (
                  <Link 
                    href={crumb.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {crumb.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <NotificationButton />
          <ModeToggle />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleSignOut}
            className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header 