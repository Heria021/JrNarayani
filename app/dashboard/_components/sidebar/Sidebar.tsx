"use client"

import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { UserProfileSection } from './UserProfileSection'
import { NavItemComponent } from './NavItemComponent'
import { Logo } from './Logo'
import { bottomNavigationItems, navigationItems } from './navigationConfig'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "relative h-full border-r bg-background transition-all duration-300",
      isCollapsed ? "w-16" : "w-64 md:w-64 lg:w-68"
    )}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-between p-1">
            <div className={cn(
              "transition-opacity duration-300",
              isCollapsed ? "opacity-0 hidden" : "opacity-100"
            )}>
              <UserProfileSection />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <Separator className="my-2" />
          
          <nav className="flex flex-col gap-1">
            {navigationItems.map((item: any, index: number) => (
              <NavItemComponent 
                key={index} 
                item={item} 
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        </div>
        
        <div className="p-2">
          <div className="flex flex-col gap-1">
            {bottomNavigationItems.map((item, index) => (
              <NavItemComponent 
                key={index} 
                item={item} 
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
          <Separator className="my-2" />
          <div className={cn(
            "transition-opacity duration-300",
            isCollapsed ? "opacity-0 hidden" : "opacity-100"
          )}>
            <Logo />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar 