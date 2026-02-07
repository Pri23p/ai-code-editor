"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const AddRepo = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [repoUrl, setRepoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenRepo = async () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a valid GitHub repository URL")
      return
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+$/
    if (!githubUrlPattern.test(repoUrl)) {
      toast.error("Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)")
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement GitHub repository import logic
      // This would typically involve cloning the repo or fetching its contents
      toast.success("GitHub repository feature coming soon!")
      setIsDialogOpen(false)
      setRepoUrl("")
    } catch (error) {
      console.error("Error opening repository:", error)
      toast.error("Failed to open repository")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div
        onClick={() => setIsDialogOpen(true)}
        className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer 
        transition-all duration-300 ease-in-out
        hover:bg-background hover:border-[#E93F3F] hover:scale-[1.02]
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        hover:shadow-[0_10px_30px_rgba(233,63,63,0.15)]"
      >
      <div className="flex flex-row justify-center items-start gap-4">
        <Button
          variant={"outline"}
          className="flex justify-center items-center bg-white group-hover:bg-[#fff8f8] group-hover:border-[#E93F3F] group-hover:text-[#E93F3F] transition-colors duration-300"
          size={"icon"}
        >
          <ArrowDown size={30} className="transition-transform duration-300 group-hover:translate-y-1" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[#e93f3f]">Open Github Repository</h1>
          <p className="text-sm text-muted-foreground max-w-[220px]">Work with your repositories in our editor</p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <Image
          src={"/github.svg"}
          alt="Open GitHub repository"
          width={150}
          height={150}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Open GitHub Repository</DialogTitle>
          <DialogDescription>
            Enter the URL of a public GitHub repository to open it in the editor
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleOpenRepo()
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Example: https://github.com/facebook/react
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsDialogOpen(false)
              setRepoUrl("")
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleOpenRepo}
            disabled={isLoading || !repoUrl.trim()}
            className="bg-[#E93F3F] hover:bg-[#d03636]"
          >
            {isLoading ? "Opening..." : "Open Repository"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  )
}

export default AddRepo


