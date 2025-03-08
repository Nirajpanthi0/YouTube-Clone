export interface YouTubeVideo {
  id: string
  snippet: {
    title: string
    channelTitle: string
    publishedAt: string
    thumbnails: {
      default: { url: string; width: number; height: number }
      medium: { url: string; width: number; height: number }
      high: { url: string; width: number; height: number }
      standard?: { url: string; width: number; height: number }
      maxres?: { url: string; width: number; height: number }
    }
    channelId: string
    description: string
    categoryId?: string
  }
  statistics?: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
}

export interface YouTubeSearchResult {
  id: {
    kind: string
    videoId: string
  }
  snippet: {
    title: string
    channelTitle: string
    publishedAt: string
    thumbnails: {
      default: { url: string; width: number; height: number }
      medium: { url: string; width: number; height: number }
      high: { url: string; width: number; height: number }
    }
    channelId: string
    description: string
  }
}

export interface YouTubeCategory {
  id: string
  snippet: {
    title: string
  }
}

interface FetchMostPopularVideosOptions {
  maxResults?: number
  categoryId?: string | null
}

// Format view count with K, M, B suffixes
export function formatViewCount(viewCount: string): string {
  const count = Number.parseInt(viewCount, 10)
  if (count >= 1000000000) {
    return (count / 1000000000).toFixed(1) + "B"
  }
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M"
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K"
  }
  return count.toString()
}

// Format the published date to relative time (e.g., "3 days ago")
export function formatPublishedDate(publishedAt: string): string {
  const published = new Date(publishedAt)
  const now = new Date()
  const diffInMs = now.getTime() - published.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
    }
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
  }
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
  }
  if (diffInDays < 30) {
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`
  }
  if (diffInDays < 365) {
    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`
  }
  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`
}

// Fetch most popular videos
export async function fetchMostPopularVideos(options: FetchMostPopularVideosOptions = {}): Promise<YouTubeVideo[]> {
  const { maxResults = 20, categoryId = null } = options
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=${maxResults}&key=${apiKey}`

  // Add category filter if provided
  if (categoryId) {
    console.log(`Adding category filter: ${categoryId}`)
    url += `&videoCategoryId=${categoryId}`
  }

  console.log(`Fetching videos from: ${url.replace(apiKey || "", "API_KEY")}`)

  try {
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Failed to fetch videos:", response.status, errorData)
      throw new Error(`Failed to fetch videos: ${response.status}`)
    }

    const data = await response.json()
    console.log(`Received ${data.items?.length || 0} videos`)

    if (!data.items || data.items.length === 0) {
      // If no videos found with the category filter, try fetching without it
      if (categoryId) {
        console.log("No videos found with category filter, fetching popular videos instead")
        return fetchMostPopularVideos({ maxResults })
      }
    }

    return data.items || []
  } catch (error) {
    console.error("Error fetching videos:", error)
    throw error
  }
}

// Search videos
export async function searchVideos(query: string, maxResults = 20): Promise<YouTubeSearchResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${apiKey}`,
  )

  if (!response.ok) {
    throw new Error("Failed to search videos")
  }

  const data = await response.json()
  return data.items
}

// Fetch video by ID
export async function fetchVideoById(videoId: string): Promise<YouTubeVideo> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`,
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Failed to fetch video:", response.status, errorData)
      throw new Error(`Failed to fetch video: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found")
    }

    return data.items[0]
  } catch (error) {
    console.error("Error fetching video details:", error)
    throw error
  }
}

// Fetch video categories
export async function fetchVideoCategories(): Promise<YouTubeCategory[]> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  try {
    console.log("Fetching video categories...")
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=${apiKey}`,
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Failed to fetch video categories:", response.status, errorData)
      return getFallbackCategories()
    }

    const data = await response.json()
    console.log("Categories fetched successfully:", data.items?.length || 0)

    if (!data.items || data.items.length === 0) {
      console.warn("No categories returned from API, using fallback")
      return getFallbackCategories()
    }

    return data.items
  } catch (error) {
    console.error("Error fetching video categories:", error)
    return getFallbackCategories()
  }
}

// Add this function to provide fallback categories
function getFallbackCategories(): YouTubeCategory[] {
  return [
    { id: "1", snippet: { title: "Film & Animation" } },
    { id: "2", snippet: { title: "Autos & Vehicles" } },
    { id: "10", snippet: { title: "Music" } },
    { id: "15", snippet: { title: "Pets & Animals" } },
    { id: "17", snippet: { title: "Sports" } },
    { id: "20", snippet: { title: "Gaming" } },
    { id: "22", snippet: { title: "People & Blogs" } },
    { id: "23", snippet: { title: "Comedy" } },
    { id: "24", snippet: { title: "Entertainment" } },
    { id: "25", snippet: { title: "News & Politics" } },
    { id: "26", snippet: { title: "How-to & Style" } },
    { id: "27", snippet: { title: "Education" } },
    { id: "28", snippet: { title: "Science & Technology" } },
  ]
}

// Fetch related videos
export async function fetchRelatedVideos(videoId: string, maxResults = 10): Promise<YouTubeSearchResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  console.log(`Fetching related videos for: ${videoId}`)

  try {
    // The YouTube API has deprecated or restricted the relatedToVideoId parameter
    // Instead, we'll search for videos with similar keywords based on the current video

    // First, get the current video details to extract keywords
    const videoDetails = await fetchVideoById(videoId)
    const videoTitle = videoDetails.snippet.title

    // Extract keywords from the title (remove common words)
    const keywords = videoTitle
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter(
        (word) =>
          word.length > 3 && !["this", "that", "with", "from", "what", "where", "when", "how", "why"].includes(word),
      )
      .slice(0, 3)
      .join(" ")

    console.log(`Using keywords for related search: "${keywords}"`)

    // Search for videos with similar keywords
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keywords)}&type=video&maxResults=${maxResults}&key=${apiKey}`
    console.log(`Fetching from: ${searchUrl.replace(apiKey || "", "API_KEY")}`)

    const response = await fetch(searchUrl)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Failed to fetch related videos:", response.status, errorData)
      throw new Error(`Failed to fetch related videos: ${response.status}`)
    }

    const data = await response.json()
    console.log(`Received ${data.items?.length || 0} related videos`)

    // Filter out the current video from results
    const filteredResults = data.items.filter((item: YouTubeSearchResult) => item.id.videoId !== videoId)

    // If we got valid results, return them
    if (filteredResults && filteredResults.length > 0) {
      return filteredResults
    }

    // If no related videos, fall back to popular videos
    console.log("No related videos found, falling back to popular videos")
    throw new Error("No related videos found")
  } catch (error) {
    console.log("Falling back to popular videos due to error:", error)

    // Fallback to popular videos if related videos fail
    try {
      const fallbackUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=${maxResults}&key=${apiKey}`
      console.log(`Fetching fallback from: ${fallbackUrl.replace(apiKey || "", "API_KEY")}`)

      const popularResponse = await fetch(fallbackUrl)

      if (!popularResponse.ok) {
        const errorData = await popularResponse.json().catch(() => ({}))
        console.error("Failed to fetch fallback videos:", popularResponse.status, errorData)
        throw new Error(`Failed to fetch fallback videos: ${popularResponse.status}`)
      }

      const popularData = await popularResponse.json()
      console.log(`Received ${popularData.items?.length || 0} fallback videos`)

      // Convert the popular videos format to match search results format
      return popularData.items.map((item: YouTubeVideo) => ({
        id: { kind: "youtube#video", videoId: item.id },
        snippet: item.snippet,
      }))
    } catch (fallbackError) {
      console.error("Even fallback failed:", fallbackError)
      // If even the fallback fails, return an empty array
      return []
    }
  }
}

// Fetch channel by ID
export async function fetchChannelById(channelId: string): Promise<any> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  try {
    console.log(`Fetching channel details for: ${channelId}`)

    // Fetch channel details
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`
    console.log(`Fetching from: ${channelUrl.replace(apiKey || "", "API_KEY")}`)

    const response = await fetch(channelUrl)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Failed to fetch channel:", response.status, errorData)
      throw new Error(`Failed to fetch channel: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      throw new Error("Channel not found")
    }

    return data.items[0]
  } catch (error) {
    console.error("Error fetching channel details:", error)
    throw error
  }
}

// Fetch videos by channel ID
export async function fetchVideosByChannel(channelId: string, maxResults = 20): Promise<YouTubeSearchResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  try {
    console.log(`Fetching videos for channel: ${channelId}`)

    // Search for videos from this channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}&key=${apiKey}`
    console.log(`Fetching from: ${searchUrl.replace(apiKey || "", "API_KEY")}`)

    const response = await fetch(searchUrl)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Failed to fetch channel videos:", response.status, errorData)
      throw new Error(`Failed to fetch channel videos: ${response.status}`)
    }

    const data = await response.json()
    console.log(`Received ${data.items?.length || 0} channel videos`)

    return data.items || []
  } catch (error) {
    console.error("Error fetching channel videos:", error)
    throw error
  }
}

