"use client"

import { Button } from "@/components/ui/button"

import { Star } from "lucide-react"
import type React from "react"
import { useState, useEffect, forwardRef } from "react"
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { toggleStarMarked } from "../actions"

interface MarkedToggleButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  markedForRevision: boolean
  id: string
}

export const MarkedToggleButton = forwardRef<HTMLButtonElement, MarkedToggleButtonProps>(
  ({ markedForRevision, id, onClick, className, children, ...props }, ref) => {
    const router = useRouter()
    const [isMarked, setIsMarked] = useState(markedForRevision)

    useEffect(() => {
      setIsMarked(markedForRevision)
    }, [markedForRevision])

    const handleToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent dropdown from closing
      event.preventDefault()
      event.stopPropagation()
      
      console.log("MarkedToggleButton clicked", { id, isMarked });
      
      // Call the original onClick if provided by the parent (DropdownMenuItem)
      onClick?.(event)

      const newMarkedState = !isMarked
      
      // Update state immediately for instant visual feedback
      setIsMarked(newMarkedState)

    try {
      const res = await toggleStarMarked(id, newMarkedState)
      const {success ,error , isMarked: updatedMarked} = res;

      if (updatedMarked && !error && success) {
        toast.success("Added to Favorites successfully")
      } else {
        toast.success("Removed from Favorites successfully")
      }

      // Refresh to update server-derived lists (e.g. sidebar starred list)
      router.refresh();
    } catch (error) {
      toast.error("Failed to update favorite status")
      // Revert state on error
      setIsMarked(!newMarkedState)
    }
    } 

    return (
      <Button
        ref={ref}
        variant="ghost"
        className={`flex items-center justify-start w-full px-2 py-1.5 text-sm rounded-md cursor-pointer ${className}`}
        onClick={handleToggle}
        {...props}
      >
        <Star 
          size={16} 
          className={`mr-2 transition-all ${
            isMarked 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'fill-none text-gray-400 hover:text-yellow-400'
          }`}
        />
        {children || (isMarked ? "Remove Favorite" : "Add to Favorite")}
      </Button>
    )
  }
)

MarkedToggleButton.displayName = "MarkedToggleButton"
