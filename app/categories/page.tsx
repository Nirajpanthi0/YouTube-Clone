"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import { fetchVideoCategories, type YouTubeCategory } from "@/utils/youtube"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Grid, Film, Music, Gamepad, Newspaper, Trophy, Lightbulb, ShoppingBag, Tv } from "lucide-react"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<YouTubeCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        console.log("Categories page: Loading categories...")
        const categoryData = await fetchVideoCategories()
        console.log("Categories page: Categories loaded:", categoryData.length)
        setCategories(categoryData)
        setError(null)
      } catch (err) {
        console.error("Categories page: Error fetching categories:", err)
        setError("Failed to load categories. Please try again later.")
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Map category IDs to icons
  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, any> = {
      "1": Film, // Film & Animation
      "2": Music, // Autos & Vehicles
      "10": Music, // Music
      "15": Gamepad, // Pets & Animals
      "17": Trophy, // Sports
      "18": Gamepad, // Short Movies
      "19": Tv, // Travel & Events
      "20": Gamepad, // Gaming
      "21": Newspaper, // Videoblogging
      "22": Newspaper, // People & Blogs
      "23": Lightbulb, // Comedy
      "24": Lightbulb, // Entertainment
      "25": Newspaper, // News & Politics
      "26": Lightbulb, // Howto & Style
      "27": Lightbulb, // Education
      "28": ShoppingBag, // Science & Technology
      "29": Film, // Nonprofits & Activism
      "30": Film, // Movies
      "31": Tv, // Anime/Animation
      "32": Tv, // Action/Adventure
      "33": Tv, // Classics
      "34": Tv, // Comedy
      "35": Tv, // Documentary
      "36": Tv, // Drama
      "37": Tv, // Family
      "38": Tv, // Foreign
      "39": Tv, // Horror
      "40": Tv, // Sci-Fi/Fantasy
      "41": Tv, // Thriller
      "42": Tv, // Shorts
      "43": Tv, // Shows
      "44": Tv, // Trailers
    }

    const IconComponent = iconMap[categoryId] || Grid
    return <IconComponent className="h-6 w-6" />
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 pt-16">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
            <h1 className="text-3xl font-bold mb-6">Categories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton key={index} className="h-32 rounded-lg" />
              ))}
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 pt-16">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
            <h1 className="text-3xl font-bold mb-6">Categories</h1>
            <div className="p-4 text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-primary text-white rounded-md"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
          <h1 className="text-3xl font-bold mb-6">Categories</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card className="h-full hover:bg-secondary/50 transition-colors cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center h-32 text-center p-4">
                    <div className="mb-2 text-primary">{getCategoryIcon(category.id)}</div>
                    <h3 className="font-medium">{category.snippet.title}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

