"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Grid } from "lucide-react"
import { fetchVideoCategories, type YouTubeCategory } from "@/utils/youtube"

interface CategoryDropdownProps {
  selectedCategory: string | null
  onSelectCategory: (categoryId: string | null) => void
}

export default function CategoryDropdown({ selectedCategory, onSelectCategory }: CategoryDropdownProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<YouTubeCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("Category dropdown: Loading categories...")
        const categoryData = await fetchVideoCategories()
        console.log("Category dropdown: Categories loaded:", categoryData.length)
        setCategories(categoryData)
      } catch (error) {
        console.error("Category dropdown: Failed to load categories:", error)
        // Set empty categories array to avoid undefined errors
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleViewAllCategories = () => {
    router.push("/categories")
  }

  const handleSelectCategory = (categoryId: string | null) => {
    console.log("Dropdown selected category:", categoryId)
    onSelectCategory(categoryId)
  }

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.snippet.title || "Category"
    : "All Categories"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1 md:hidden">
          <Grid className="h-4 w-4 mr-1" />
          {selectedCategoryName}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Categories</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={selectedCategory === null ? "bg-secondary" : ""}
          onClick={() => handleSelectCategory(null)}
        >
          All Categories
        </DropdownMenuItem>

        {categories.map((category) => (
          <DropdownMenuItem
            key={category.id}
            className={selectedCategory === category.id ? "bg-secondary" : ""}
            onClick={() => handleSelectCategory(category.id)}
          >
            {category.snippet.title}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleViewAllCategories} className="text-primary">
          View All Categories
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

