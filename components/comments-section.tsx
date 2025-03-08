"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { formatPublishedDate } from "@/utils/youtube"

// Define the comment interface
interface Comment {
  id: string
  text: string
  author: string
  authorAvatar?: string
  timestamp: string
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

interface CommentsProps {
  videoId: string
}

export default function CommentsSection({ videoId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [commentCount, setCommentCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sortByNewest, setSortByNewest] = useState(true)

  // Load comments from localStorage or use mock data
  useEffect(() => {
    const loadComments = async () => {
      setLoading(true)

      try {
        // In a real app, we would fetch comments from an API
        // For now, we'll use localStorage to persist comments
        const savedComments = localStorage.getItem(`comments-${videoId}`)

        if (savedComments) {
          const parsedComments = JSON.parse(savedComments)
          setComments(parsedComments)
          setCommentCount(parsedComments.length)
        } else {
          // If no saved comments, use mock data
          const mockComments = getMockComments()
          setComments(mockComments)
          setCommentCount(mockComments.length)

          // Save mock comments to localStorage
          localStorage.setItem(`comments-${videoId}`, JSON.stringify(mockComments))
        }
      } catch (error) {
        console.error("Error loading comments:", error)
        setComments([])
      } finally {
        setLoading(false)
      }
    }

    loadComments()
  }, [videoId])

  // Save comments to localStorage whenever they change
  useEffect(() => {
    if (!loading && comments.length > 0) {
      localStorage.setItem(`comments-${videoId}`, JSON.stringify(comments))
      setCommentCount(comments.length)
    }
  }, [comments, loading, videoId])

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: "You",
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    }

    setComments([newCommentObj, ...comments])
    setNewComment("")
  }

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const isLiked = !comment.isLiked
          return {
            ...comment,
            isLiked,
            likes: isLiked ? comment.likes + 1 : comment.likes - 1,
          }
        }
        return comment
      }),
    )
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortByNewest) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    } else {
      return b.likes - a.likes
    }
  })

  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="flex gap-3 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
        </div>

        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex gap-3 mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium">{commentCount} Comments</h3>
        <Button variant="ghost" size="sm" onClick={() => setSortByNewest(!sortByNewest)}>
          Sort by: {sortByNewest ? "Newest first" : "Top comments"}
        </Button>
      </div>

      {/* Add comment form */}
      <div className="flex gap-3 mb-6">
        <Avatar className="h-10 w-10">
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none mb-2"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setNewComment("")}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {sortedComments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{comment.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{comment.author}</p>
                <p className="text-xs text-muted-foreground">{formatPublishedDate(comment.timestamp)}</p>
              </div>
              <p className="mt-1 text-sm whitespace-pre-line">{comment.text}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <ThumbsUp className={`h-4 w-4 ${comment.isLiked ? "text-primary" : ""}`} />
                </Button>
                <span className="text-xs text-muted-foreground">{comment.likes}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  Reply
                </Button>
              </div>

              {/* Comment replies would go here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to generate mock comments
function getMockComments(): Comment[] {
  return [
    {
      id: "1",
      text: "This video was really helpful! I've been looking for a clear explanation on this topic for a while.",
      author: "Sarah Johnson",
      timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
      likes: 42,
      isLiked: false,
    },
    {
      id: "2",
      text: "Great content as always! Looking forward to more videos like this one.",
      author: "Michael Chen",
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
      likes: 18,
      isLiked: false,
    },
    {
      id: "3",
      text: "I have a question about the part at 3:45. Could you explain that in more detail?",
      author: "Alex Rodriguez",
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
      likes: 7,
      isLiked: false,
    },
    {
      id: "4",
      text: "I disagree with some points made in this video. I think there are other perspectives to consider.",
      author: "Jamie Taylor",
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
      likes: 3,
      isLiked: false,
    },
    {
      id: "5",
      text: "This is exactly what I needed to understand the concept. Thanks for making it so clear!",
      author: "Pat Wilson",
      timestamp: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
      likes: 29,
      isLiked: false,
    },
  ]
}

