"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Moon, Sun, HelpCircle, DollarSign } from "lucide-react"
import { fetchChannelById } from "@/utils/youtube"
import { useTheme } from "next-themes"

interface UserProfileDropdownProps {
  channelId: string
}

export default function UserProfileDropdown({ channelId }: UserProfileDropdownProps) {
  const [channel, setChannel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    const loadChannel = async () => {
      try {
        setLoading(true)
        const channelData = await fetchChannelById(channelId)
        setChannel(channelData)
      } catch (error) {
        console.error("Failed to load user channel:", error)
      } finally {
        setLoading(false)
      }
    }

    loadChannel()
  }, [channelId])

  const userAvatar = channel?.snippet?.thumbnails?.default?.url || null
  const userName = channel?.snippet?.title || "User"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          {userAvatar ? (
            <AvatarImage src={userAvatar} alt={userName} />
          ) : (
            <AvatarFallback>{userName[0]}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center p-2">
          <Avatar className="h-10 w-10 mr-2">
            {userAvatar ? (
              <AvatarImage src={userAvatar} alt={userName} />
            ) : (
              <AvatarFallback>{userName[0]}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{userName}</span>
            <span className="text-xs text-muted-foreground">Manage your account</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <Link href={`/channel/${channelId}`}>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Your channel</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <DollarSign className="mr-2 h-4 w-4" />
          <span>Purchases and memberships</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light theme</span>
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark theme</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

