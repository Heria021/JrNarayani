"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { NavItem } from './navigationConfig'
import { ChevronDown } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface NavItemComponentProps {
  item: NavItem
  isChild?: boolean
  isCollapsed?: boolean
}

export const NavItemComponent = ({ 
  item, 
  isChild = false, 
  isCollapsed = false 
}: NavItemComponentProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const isActive = item.href === '/dashboard' 
    ? pathname === item.href 
    : pathname === item.href || pathname.startsWith(`${item.href}/`)
  const hasChildren = item.children && item.children.length > 0

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  const NavLink = () => (
    <Link href={item.href} onClick={handleClick}>
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-200',
          isChild ? 'pl-4' : '',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-primary',
          isCollapsed && !isChild ? 'justify-center' : ''
        )}
      >
        <span className={cn(
          "flex h-5 w-5 shrink-0 overflow-hidden",
          isCollapsed && !isChild ? "h-5 w-5" : ""
        )}>
          {item.icon}
        </span>
        {(!isCollapsed || isChild) && (
          <>
            <p className="text-sm font-medium">{item.title}</p>
            {hasChildren && !isChild && (
              <ChevronDown className={cn(
                "h-4 w-4 ml-auto transition-transform duration-200",
                isOpen ? "transform rotate-180" : ""
              )} />
            )}
          </>
        )}
      </div>
    </Link>
  )

  const content = (
    <div>
      {isCollapsed && !isChild ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <NavLink />
      )}
      
      {hasChildren && isOpen && (
        <div className={cn(
          "mt-1 space-y-1",
          isCollapsed ? "hidden" : ""
        )}>
          {item.children?.map((child, index) => (
            <NavItemComponent 
              key={index} 
              item={child} 
              isChild 
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  )

  return content
} 