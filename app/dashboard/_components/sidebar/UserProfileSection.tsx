"use client"

interface UserProfile {
  name: string
  email: string
  avatar: string
}

const userProfile: UserProfile = {
  name: 'Ramesh Suthar',
  email: 'rameshsuthar65@gmail.com',
  avatar: 'https://i.pinimg.com/280x280_RS/41/a6/ea/41a6eac6f8d7162a601b0fcaccd6a7a6.jpg'
}

export const UserProfileSection = () => (
  <div className="flex items-center gap-2">
    <span className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
      <img
        src={userProfile.avatar}
        alt={userProfile.name}
        className="w-full h-full object-cover"
      />
    </span>
    <div className=" space-y-1">
      <p className="text-sm font-medium leading-none text-foreground">{userProfile.name}</p>
      <p className="text-xs text-muted-foreground leading-none truncate">{userProfile.email}</p>
    </div>
  </div>
) 