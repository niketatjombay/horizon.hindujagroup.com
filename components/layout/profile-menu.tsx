'use client'

import { LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export function ProfileMenu() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) return null

  const fullName = `${user.firstName} ${user.lastName}`
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatarUrl} alt={fullName} />
          <AvatarFallback className="bg-primary text-white font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden sm:block text-sm font-medium text-white">
          {fullName}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        {/* User Info Section */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatarUrl} alt={fullName} />
              <AvatarFallback className="bg-primary text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-gray-900 truncate">
                {fullName}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {user.email}
              </p>
              <Badge variant="default" size="sm" className="mt-1">
                {user.role.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <DropdownMenuItem
            onClick={() => router.push('/profile')}
            className="px-4 py-3 cursor-pointer"
          >
            <User className="mr-3 h-5 w-5" />
            <span>My Profile</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        {/* Logout */}
        <div className="py-2">
          <DropdownMenuItem
            onClick={handleLogout}
            className="px-4 py-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
