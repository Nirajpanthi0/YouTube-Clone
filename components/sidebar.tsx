"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  Flame,
  ShoppingBag,
  Music2,
  Film,
  Gamepad2,
  Newspaper,
  Trophy,
  Lightbulb,
  Radio,
  Grid,
} from "lucide-react"
import { fetchVideoCategories, type YouTubeCategory } from "@/utils/youtube"

const mainLinks = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: PlaySquare, label: "Subscriptions", href: "/subscriptions" },
]

const libraryLinks = [
  { icon: History, label: "History", href: "/history" },
  { icon: PlaySquare, label: "Your videos", href: "/your-videos" },
  { icon: Clock, label: "Watch later", href: "/watch-later" },
  { icon: ThumbsUp, label: "Liked videos", href: "/liked-videos" },
]

const exploreLinks = [
  { icon: Flame, label: "Trending", href: "/trending" },
  { icon: ShoppingBag, label: "Shopping", href: "/shopping" },
  { icon: Music2, label: "Music", href: "/music" },
  { icon: Film, label: "Movies & TV", href: "/movies" },
  { icon: Gamepad2, label: "Gaming", href: "/gaming" },
  { icon: Newspaper, label: "News", href: "/news" },
  { icon: Trophy, label: "Sports", href: "/sports" },
  { icon: Lightbulb, label: "Learning", href: "/learning" },
  { icon: Radio, label: "Podcasts", href: "/podcasts" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [categories, setCategories] = useState<YouTubeCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("Sidebar: Loading categories...")
        const categoryData = await fetchVideoCategories()
        console.log("Sidebar: Categories loaded:", categoryData.length)
        // Limit to 10 categories to avoid overwhelming the sidebar
        setCategories(categoryData.slice(0, 10))
      } catch (error) {
        console.error("Sidebar: Failed to load categories:", error)
        // Set empty categories array to avoid undefined errors
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r bg-background hidden md:block overflow-hidden">
      <ScrollArea className="h-full py-4">
        <div className="px-3 space-y-4">
          <div className="space-y-1">
            {mainLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant={pathname === link.href ? "secondary" : "ghost"} className="w-full justify-start">
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          <Separator />

          <div>
            <h3 className="font-medium px-4 mb-1">Library</h3>
            <div className="space-y-1">
              {libraryLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <Link href="/categories">
              <h3 className="font-medium px-4 mb-1 hover:text-primary cursor-pointer flex items-center">
                <Grid className="mr-2 h-4 w-4" />
                Categories
              </h3>
            </Link>
            <div className="space-y-1 mt-2">
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="px-4 py-1">
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))
                : categories.map((category) => (
                    <Link key={category.id} href={`/category/${category.id}`}>
                      <Button
                        variant={pathname === `/category/${category.id}` ? "secondary" : "ghost"}
                        className="w-full justify-start"
                      >
                        {category.snippet.title}
                      </Button>
                    </Link>
                  ))}
              <Link href="/categories">
                <Button variant="ghost" className="w-full justify-start text-primary">
                  View all categories
                </Button>
              </Link>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium px-4 mb-1">Explore</h3>
            <div className="space-y-1">
              {exploreLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}

