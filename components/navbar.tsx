"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, Search, Bell, Upload, Mic } from "lucide-react"
import UserProfileDropdown from "@/components/user-profile-dropdown"

// Use a hardcoded channel ID for the user profile
// This is a popular tech channel as an example
const USER_CHANNEL_ID = "UCXuqSBlHAE6Xw-yeJA0Tunw" // Linus Tech Tips

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 px-4">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-1">
            <div className="bg-primary p-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M4 8H2v12a2 2 0 002 2h12v-2H4V8z" />
                <path d="M20 2H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm-9 12V6l7 4-7 4z" />
              </svg>
            </div>
            <span className="font-bold text-lg hidden sm:inline">ViewTube</span>
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className={`flex items-center gap-2 max-w-xl w-full ${
            isSearchFocused ? "flex-1" : "flex-1 md:flex-initial md:w-1/2"
          }`}
        >
          <div className="relative flex-1 flex items-center">
            <Input
              type="search"
              placeholder="Search"
              className="pr-10 rounded-r-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <Button type="submit" variant="secondary" size="icon" className="absolute right-0 rounded-l-none h-10">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button type="button" variant="ghost" size="icon" className="hidden md:flex">
            <Mic className="h-5 w-5" />
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Upload className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <UserProfileDropdown channelId={USER_CHANNEL_ID} />
        </div>
      </div>
    </header>
  )
}

