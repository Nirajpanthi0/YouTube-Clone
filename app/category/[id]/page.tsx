"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import VideoCard from "@/components/video-card"
import { fetchMostPopularVideos, fetchVideoCategories, type YouTubeVideo, type YouTubeCategory } from "@/utils/youtube"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryId = params.id
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [category, setCategory] = useState<YouTubeCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategoryAndVideos = async () => {
      try {
        setLoading(true)

        // Load category info
        console.log("Category page: Loading categories...")
        const categories = await fetchVideoCategories()
        console.log("Category page: Categories loaded:", categories.length)
        const categoryInfo = categories.find((cat) => cat.id === categoryId) || null
        setCategory(categoryInfo)

        // Load videos filtered by category
        console.log("Category page: Loading videos for category:", categoryId)
        const videosForCategory = await fetchMostPopularVideos({
          categoryId: categoryId,
          maxResults: 20,
        })
        console.log("Category page: Videos loaded:", videosForCategory.length)
        setVideos(videosForCategory)

        setError(null)
      } catch (err) {
        console.error("Category page: Error fetching category data:", err)
        setError("Failed to load category videos. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadCategoryAndVideos()
  }, [categoryId])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 pt-16">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
            <Skeleton className="h-10 w-64 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                </div>
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
            <h1 className="text-3xl font-bold mb-6">Category</h1>
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
          <h1 className="text-3xl font-bold mb-6">{category ? category.snippet.title : "Category"}</h1>

          {videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg">No videos found in this category</p>
              <p className="text-muted-foreground mt-2">Try another category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

