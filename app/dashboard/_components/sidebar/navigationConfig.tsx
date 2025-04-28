import { 
  BedSingleIcon, 
  BookUser, 
  FolderClosed, 
  FolderPlus, 
  HelpCircle, 
  Home, 
  HousePlus, 
  LayoutGridIcon, 
  MonitorSmartphoneIcon, 
  Settings, 
  SheetIcon 
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  children?: NavItem[]
}

export const navigationItems: NavItem[] = [
  {
    title: 'Home',
    href: '/dashboard',
    icon: <Home className="aspect-square h-full w-full" />
  },
  {
    title: 'All projects',
    href: '/dashboard/portfolio',
    icon: <LayoutGridIcon className="aspect-square h-full w-full" />,
    children: [
      {
        title: 'Architecture',
        href: '/dashboard/portfolio',
        icon: <HousePlus className="aspect-square h-full w-full" />
      },
      {
        title: 'Handicrafts',
        href: '/dashboard/portfolio/handicrafts',
        icon: <BedSingleIcon className="aspect-square h-full w-full" />
      }
    ]
  },
  {
    title: 'Create',
    href: '#',
    icon: <FolderClosed className="aspect-square h-full w-full" />,
    children: [
      {
        title: 'Create Project',
        href: '/dashboard/project',
        icon: <FolderPlus className="aspect-square h-full w-full" />
      },
      {
        title: 'Create Estimate',
        href: '/dashboard/client',
        icon: <SheetIcon className="aspect-square h-full w-full" />
      }
    ]
  },
  {
    title: 'Narayani',
    href: '/dashboard/narayani',
    icon: <MonitorSmartphoneIcon className="aspect-square h-full w-full" />
  }
]

export const bottomNavigationItems: NavItem[] = [
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="aspect-square h-full w-full" />
  },
  {
    title: 'Help',
    href: '/dashboard/help',
    icon: <HelpCircle className="aspect-square h-full w-full" />
  }
] 