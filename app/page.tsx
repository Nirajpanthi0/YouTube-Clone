"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import VideoGrid from "@/components/video-grid"
import CategoryDropdown from "@/components/category-dropdown"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchVideoCategories, type YouTubeCategory } from "@/utils/youtube"

export default function Home() {
  const router = useRouter()
  const [categories, setCategories] = useState<YouTubeCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        console.log("Home page: Loading categories...")
        const categoryData = await fetchVideoCategories()
        console.log("Home page: Categories loaded:", categoryData.length)
        setCategories(categoryData)
      } catch (error) {
        console.error("Home page: Failed to load categories:", error)
        // Set empty categories array to avoid undefined errors
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleCategorySelect = (categoryId: string) => {
    console.log("Selected category:", categoryId)
    if (categoryId === selectedCategory) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(categoryId)
    }
  }

  const handleViewAllCategories = () => {
    router.push("/categories")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory && !loading
                ? `${categories.find((c) => c.id === selectedCategory)?.snippet.title || "Category"}`
                : "Recommended"}
            </h2>

            <CategoryDropdown selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </div>

          {loading ? (
            <Skeleton className="h-12 w-full mb-6 rounded-lg" />
          ) : (
            <div className="mb-6 hidden md:block">
              <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex space-x-2 pb-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className="rounded-full"
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategorySelect(category.id)}
                      className="rounded-full"
                    >
                      {category.snippet.title}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewAllCategories}
                    className="rounded-full font-medium"
                  >
                    View All
                  </Button>
                </div>
              </ScrollArea>
            </div>
          )}

          <VideoGrid categoryId={selectedCategory} />
        </main>
      </div>
    </div>
  )
}

