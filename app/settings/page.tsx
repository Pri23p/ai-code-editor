import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Shield } from "lucide-react"
import LogoutButton from "@/modules/auth/components/logout-button"
import { Button } from "@/components/ui/button"

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth")
  }

  const { user } = session

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your account details from your OAuth provider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback className="bg-red-500 text-white text-2xl">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{user.name || "User"}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Account Role</span>
                </div>
                <Badge variant="secondary">
                  {user.role || "USER"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Member Since</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your coding experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <Badge variant="outline">Light/Dark (Toggle in header)</Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Editor Settings</p>
                <p className="text-sm text-muted-foreground">
                  Font size, tab size, and more
                </p>
              </div>
              <Badge variant="outline">Available in playground</Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">AI Code Completion</p>
                <p className="text-sm text-muted-foreground">
                  Powered by Ollama (Ctrl+Space)
                </p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Enabled
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>
              Manage your account and sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <LogoutButton>
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </LogoutButton>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Connected Accounts</p>
                <p className="text-sm text-muted-foreground">
                  Google or GitHub OAuth
                </p>
              </div>
              <Badge variant="secondary">1 Connected</Badge>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About Vibe Code Editor</CardTitle>
            <CardDescription>
              Information about the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <strong>Version:</strong> 1.0.0
            </p>
            <p className="text-sm">
              <strong>Features:</strong> WebContainers, Monaco Editor, AI Code Completion
            </p>
            <p className="text-sm">
              <strong>Support:</strong> Contact us for help and feedback
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
