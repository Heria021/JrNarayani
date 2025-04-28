"use client"

import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'

export const NotificationButton = () => (
  <Button 
    variant="outline" 
    size="icon" 
    className="relative hover:bg-muted transition-colors"
  >
    <Bell className="h-[1.2rem] w-[1.2rem] text-foreground" />
    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
      3
    </span>
  </Button>
) 