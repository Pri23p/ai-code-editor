# 🏗️ Vibe Code Editor - Architecture & Data Models

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Database Models](#database-models)
3. [TypeScript Interfaces](#typescript-interfaces)
4. [API Endpoints](#api-endpoints)
5. [State Management](#state-management)
6. [Design Patterns](#design-patterns)
7. [Security Model](#security-model)
8. [Performance Optimizations](#performance-optimizations)

---

## System Overview

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  Next.js 15 (App Router) + React + TailwindCSS          │
│  - Pages & Layouts                                       │
│  - UI Components (ShadCN)                                │
│  - Client-side State (Zustand)                           │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                      │
│  Feature Modules + Custom Hooks                          │
│  - Auth Module                                           │
│  - Dashboard Module                                       │
│  - Playground Module                                      │
│  - AI Chat Module                                         │
│  - WebContainers Module                                   │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                        │
│  API Routes + Server Actions                              │
│  - Authentication (NextAuth)                              │
│  - CRUD Operations                                        │
│  - AI Integration (Ollama)                                │
│  - Template Management                                    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                      DATA LAYER                           │
│  Prisma ORM + MongoDB                                     │
│  - User Management                                        │
│  - Project Storage                                        │
│  - Chat History                                           │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend** | Next.js 15 | SSR, Routing, Full-stack framework |
| **UI Library** | React 18 | Component-based UI |
| **Styling** | TailwindCSS + ShadCN | Utility-first CSS + Beautiful components |
| **Language** | TypeScript | Type safety |
| **State Management** | Zustand | Lightweight state management |
| **Code Editor** | Monaco Editor | VSCode editor in browser |
| **Terminal** | xterm.js | Terminal emulator |
| **Code Execution** | WebContainers | Run Node.js in browser (WASM) |
| **Authentication** | NextAuth v5 | OAuth 2.0 (Google, GitHub) |
| **Database** | MongoDB + Prisma | NoSQL database + Type-safe ORM |
| **AI Integration** | Ollama | Local LLM for code completion |
| **File System** | Virtual FS | In-memory file system |

---

## Database Models

### 1. User Model

**Purpose**: Store user account information and authentication data

```prisma
model User {
  id       String    @id @default(cuid()) @map("_id")
  name     String?
  email    String    @unique
  image    String?
  accounts Account[]
  role     UserRole  @default(USER)

  myPlaground      Playground[]
  staredPlayground StarMark[]
  chatMessages     ChatMessage[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Fields Explanation**:
- `id`: Unique identifier (CUID for MongoDB)
- `name`: User's display name (optional)
- `email`: Unique email address (required)
- `image`: Profile picture URL from OAuth provider
- `role`: User permission level (USER, ADMIN, PREMIUM_USER)
- `accounts`: OAuth accounts linked to this user
- `myPlaground`: Projects created by this user
- `staredPlayground`: Projects starred/bookmarked by user
- `chatMessages`: AI chat messages from this user

**Use Cases**:
- User authentication and authorization
- Display user profile information
- Track user ownership of projects
- Manage user permissions

---

### 2. Account Model

**Purpose**: Store OAuth provider credentials for authentication

```prisma
model Account {
  id                String  @id @default(cuid()) @map("_id")
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String
  refreshToken      String? @map("refresh_token")
  accessToken       String? @map("access_token")
  expiresAt         Int?    @map("expires_at")
  tokenType         String? @map("token_type")
  scope             String?
  idToken           String? @map("id_token")
  sessionState      String? @map("session_state")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}
```

**Fields Explanation**:
- `provider`: OAuth provider (google, github)
- `providerAccountId`: User ID from the OAuth provider
- `accessToken`: OAuth access token for API calls
- `refreshToken`: Token to refresh expired access tokens
- `expiresAt`: Unix timestamp when token expires

**Relations**:
- `user`: Belongs to one User (Many-to-One)
- Cascade delete: If user deleted, all accounts deleted

**Use Cases**:
- OAuth authentication flow
- Token refresh for expired sessions
- Link multiple OAuth providers to one user

---

### 3. Playground Model

**Purpose**: Store code projects/playgrounds created by users

```prisma
model Playground {
  id          String    @id @default(cuid()) @map("_id")
  title       String
  description String?
  template    Templates @default(REACT)
  slug        String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
 
  Starmark      StarMark[]
  userId        String
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  templateFiles TemplateFile[]
}
```

**Fields Explanation**:
- `title`: Project name (e.g., "My React App")
- `description`: Optional project description
- `template`: Starting template (REACT, NEXTJS, EXPRESS, VUE, HONO, ANGULAR)
- `slug`: URL-friendly identifier
- `userId`: Owner of the project

**Relations**:
- `user`: Belongs to one User
- `Starmark`: Can be starred by multiple users
- `templateFiles`: Has one TemplateFile (project code)

**Use Cases**:
- Create new coding projects
- List user's projects in dashboard
- Search and filter projects
- Share projects via slug URL

---

### 4. TemplateFile Model

**Purpose**: Store the actual file structure and code content of projects

```prisma
model TemplateFile {
  id           String     @id @default(cuid()) @map("_id")
  content      Json
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  playgroundId String     @unique
  playground   Playground @relation(fields: [playgroundId], references: [id], onDelete: Cascade)
}
```

**Fields Explanation**:
- `content`: JSON structure containing file tree and file contents
- `playgroundId`: Links to parent Playground (One-to-One)

**Content JSON Structure**:
```typescript
{
  "files": {
    "src/App.tsx": {
      "file": {
        "contents": "import React from 'react'..."
      }
    },
    "src/index.css": {
      "file": {
        "contents": "body { margin: 0; }"
      }
    },
    "package.json": {
      "file": {
        "contents": "{\"name\": \"my-app\"...}"
      }
    }
  }
}
```

**Use Cases**:
- Save user's code changes
- Load project files into editor
- Restore project state
- Version control (via updatedAt)

---

### 5. StarMark Model

**Purpose**: Track which users have starred/bookmarked which projects

```prisma
model StarMark {
  id           String     @id @default(cuid()) @map("_id")
  userId       String
  playgroundId String
  isMarked     Boolean
  createdAt    DateTime   @default(now())
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  playground   Playground @relation(fields: [playgroundId], references: [id], onDelete: Cascade)

  @@unique([userId, playgroundId])
}
```

**Fields Explanation**:
- `userId`: User who starred the project
- `playgroundId`: Project that was starred
- `isMarked`: Current star state (true/false)

**Constraints**:
- Unique constraint on `[userId, playgroundId]` prevents duplicate stars

**Use Cases**:
- Star/unstar projects
- Show starred projects in dashboard
- Display star count on projects
- Filter "My Starred Projects"

---

### 6. ChatMessage Model

**Purpose**: Store AI chat conversation history

```prisma
model ChatMessage {
  id        String   @id @default(cuid()) @map("_id")
  userId    String 
  role      String   // "user" or "assistant"
  content   String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

**Fields Explanation**:
- `role`: Message sender ("user" or "assistant")
- `content`: Message text
- `userId`: User who owns this chat

**Use Cases**:
- Display chat history
- Context for AI responses
- User conversation logs
- Debug AI interactions

---

## TypeScript Interfaces

### Frontend Models

#### User Interface
```typescript
export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  PREMIUM_USER = 'PREMIUM_USER'
}
```

#### Project Interface
```typescript
export interface Project {
  id: string
  title: string
  description: string | null
  template: Template
  createdAt: Date
  updatedAt: Date
  userId: string
  user: User
  Starmark: { isMarked: boolean }[]
}

export enum Template {
  REACT = 'REACT',
  NEXTJS = 'NEXTJS',
  EXPRESS = 'EXPRESS',
  VUE = 'VUE',
  HONO = 'HONO',
  ANGULAR = 'ANGULAR'
}
```

#### File System Types
```typescript
export interface FileNode {
  name: string
  type: 'file' | 'directory'
  children?: FileNode[]
  content?: string
  path: string
}

export interface FileSystemTree {
  [key: string]: {
    directory?: FileSystemTree
    file?: {
      contents: string
    }
  }
}
```

#### Editor State Types
```typescript
export interface EditorState {
  activeFile: string | null
  openFiles: string[]
  fileContents: Record<string, string>
  cursorPosition: { line: number; column: number }
  isDirty: boolean
}

export interface TerminalState {
  output: string[]
  isRunning: boolean
  currentCommand: string | null
}

export interface PreviewState {
  url: string | null
  port: number | null
  isLoading: boolean
}
```

#### AI Chat Types
```typescript
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface CodeCompletionRequest {
  prompt: string
  language: string
  cursorPosition: number
  context?: string
}

export interface CodeCompletionResponse {
  completion: string
  confidence: number
}
```

---

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/[...nextauth]`
**Purpose**: Handle OAuth authentication flow

**Request**:
```typescript
// Handled by NextAuth automatically
```

**Response**:
```typescript
{
  user: {
    id: string
    name: string
    email: string
    image: string
  }
  session: {
    expires: string
  }
}
```

**Error Codes**:
- `401`: Invalid credentials
- `403`: Access denied
- `500`: Server error

---

### Playground Endpoints

#### GET `/api/template/[id]`
**Purpose**: Fetch project files by playground ID

**Parameters**:
- `id`: Playground ID

**Response**:
```typescript
{
  success: true,
  data: {
    content: {
      files: {
        "src/App.tsx": {
          file: { contents: "..." }
        }
      }
    }
  }
}
```

**Error Codes**:
- `404`: Playground not found
- `401`: Unauthorized
- `500`: Server error

---

### AI Endpoints

#### POST `/api/code-completion`
**Purpose**: Get AI code completion suggestions

**Request Body**:
```typescript
{
  prompt: string      // Current code context
  language: string    // e.g., "typescript", "python"
  cursorPosition: number
}
```

**Response**:
```typescript
{
  completion: string
  confidence: number
}
```

**Example**:
```json
{
  "prompt": "function calculateSum(",
  "language": "typescript",
  "cursorPosition": 20
}

// Response:
{
  "completion": "a: number, b: number): number {\n  return a + b;\n}",
  "confidence": 0.92
}
```

---

#### POST `/api/chat`
**Purpose**: AI chat assistant for code help

**Request Body**:
```typescript
{
  messages: ChatMessage[]
  files?: string[]  // Optional file contents for context
}
```

**Response** (Streaming):
```typescript
// Server-Sent Events (SSE)
data: {"token": "Here"}
data: {"token": " is"}
data: {"token": " the"}
data: {"token": " solution"}
```

---

## State Management

### Zustand Stores Architecture

#### 1. Editor Store
```typescript
interface EditorStore {
  // State
  activeFile: string | null
  openFiles: string[]
  fileContents: Record<string, string>
  
  // Actions
  openFile: (path: string) => void
  closeFile: (path: string) => void
  updateFileContent: (path: string, content: string) => void
  setActiveFile: (path: string) => void
}

// Usage:
const useEditorStore = create<EditorStore>((set) => ({
  activeFile: null,
  openFiles: [],
  fileContents: {},
  
  openFile: (path) => set((state) => ({
    openFiles: [...state.openFiles, path],
    activeFile: path
  })),
  
  closeFile: (path) => set((state) => ({
    openFiles: state.openFiles.filter(f => f !== path)
  })),
  
  updateFileContent: (path, content) => set((state) => ({
    fileContents: { ...state.fileContents, [path]: content }
  }))
}))
```

#### 2. File System Store
```typescript
interface FileSystemStore {
  // State
  files: FileNode[]
  selectedFile: string | null
  
  // Actions
  createFile: (path: string, content: string) => void
  createFolder: (path: string) => void
  deleteFile: (path: string) => void
  renameFile: (oldPath: string, newPath: string) => void
}
```

#### 3. Terminal Store
```typescript
interface TerminalStore {
  // State
  output: string[]
  isRunning: boolean
  webContainer: WebContainer | null
  
  // Actions
  executeCommand: (command: string) => Promise<void>
  clearOutput: () => void
  initWebContainer: () => Promise<void>
}
```

#### 4. Preview Store
```typescript
interface PreviewStore {
  // State
  url: string | null
  isLoading: boolean
  
  // Actions
  setPreviewUrl: (url: string) => void
  refreshPreview: () => void
}
```

---

## Design Patterns

### 1. Module Pattern
**Used in**: Feature modules (`modules/auth`, `modules/dashboard`, `modules/playground`)

**Structure**:
```
modules/
  feature-name/
    ├── components/      # UI components
    ├── actions/         # Server actions
    ├── hooks/          # Custom hooks
    ├── types.ts        # TypeScript types
    └── lib/            # Utility functions
```

**Benefits**:
- Clear separation of concerns
- Easy to test in isolation
- Reusable across app
- Scalable architecture

---

### 2. Server Actions Pattern
**Used in**: All data mutations

**Example**:
```typescript
'use server'

export async function createPlayground(data: CreatePlaygroundInput) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  
  const playground = await prisma.playground.create({
    data: {
      title: data.title,
      description: data.description,
      template: data.template,
      userId: session.user.id
    }
  })
  
  revalidatePath('/dashboard')
  return { success: true, data: playground }
}
```

**Benefits**:
- Type-safe RPC calls
- Automatic revalidation
- No API route boilerplate
- Built-in security

---

### 3. Compound Component Pattern
**Used in**: UI components (Dialog, Card, etc.)

**Example**:
```typescript
<Card>
  <CardHeader>
    <CardTitle>Project Name</CardTitle>
    <CardDescription>Description here</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Benefits**:
- Flexible composition
- Clear hierarchy
- Reusable pieces
- Better DX

---

### 4. Provider Pattern
**Used in**: Theme, Auth context

**Example**:
```typescript
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
```

---

### 5. Custom Hook Pattern
**Used in**: Reusable logic

**Example**:
```typescript
export function useWebContainer() {
  const [container, setContainer] = useState<WebContainer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    WebContainer.boot().then(setContainer)
      .finally(() => setIsLoading(false))
  }, [])
  
  return { container, isLoading }
}
```

---

## Security Model

### Authentication & Authorization

#### 1. OAuth 2.0 Flow
```
User → OAuth Provider (Google/GitHub)
     ← Authorization Code
     → NextAuth Server
     ← Access Token + Refresh Token
     → MongoDB (Store tokens)
     ← Session Cookie (JWT)
```

#### 2. Session Management
- **JWT tokens** stored in HTTP-only cookies
- **Secure** flag enabled in production
- **SameSite=Lax** prevents CSRF attacks
- **Token rotation** on refresh
- **Expiry**: 30 days (configurable)

#### 3. Route Protection
```typescript
// Middleware
export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }
  
  // Public routes
  return NextResponse.next()
}
```

#### 4. API Security
```typescript
// Server action with auth check
'use server'

export async function deletePlayground(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  // Check ownership
  const playground = await prisma.playground.findUnique({
    where: { id },
    select: { userId: true }
  })
  
  if (playground?.userId !== session.user.id) {
    throw new Error('Forbidden')
  }
  
  // Delete
  await prisma.playground.delete({ where: { id } })
}
```

### Data Security

#### 1. Input Validation
```typescript
import { z } from 'zod'

const createPlaygroundSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  template: z.enum(['REACT', 'NEXTJS', 'EXPRESS', 'VUE', 'HONO', 'ANGULAR'])
})

export async function createPlayground(data: unknown) {
  const validated = createPlaygroundSchema.parse(data)
  // ... proceed with validated data
}
```

#### 2. SQL Injection Prevention
- Using **Prisma ORM** (parameterized queries)
- No raw SQL queries
- MongoDB injection protection

#### 3. XSS Prevention
- React auto-escapes JSX
- DOMPurify for user HTML (if needed)
- Content Security Policy headers

---

## Performance Optimizations

### 1. Code Splitting
```typescript
// Dynamic imports for heavy components
const MonacoEditor = dynamic(() => import('./MonacoEditor'), {
  ssr: false,
  loading: () => <EditorSkeleton />
})
```

### 2. Image Optimization
```typescript
import Image from 'next/image'

<Image
  src="/logo.png"
  width={200}
  height={50}
  alt="Logo"
  priority // Above fold
/>
```

### 3. Database Indexing
```prisma
model User {
  email String @unique  // Auto-indexed
  
  @@index([createdAt])  // Manual index
}

model Playground {
  userId String
  
  @@index([userId])  // Query optimization
}
```

### 4. Caching Strategy
```typescript
// Static page generation
export const revalidate = 3600 // 1 hour

// Dynamic with cache
export async function getProjects(userId: string) {
  return unstable_cache(
    async () => await prisma.playground.findMany({ where: { userId } }),
    [`projects-${userId}`],
    { revalidate: 60 }
  )()
}
```

### 5. Lazy Loading
```typescript
// Intersection Observer for images
<LazyImage src="/preview.png" />

// Virtualized lists for large datasets
<VirtualList
  items={projects}
  itemHeight={80}
  renderItem={(project) => <ProjectCard {...project} />}
/>
```

---

## File Upload Flow

```typescript
// Future enhancement: File upload to cloud storage
interface FileUploadFlow {
  // 1. User selects file
  input: File
  
  // 2. Validate file
  validation: {
    maxSize: 10_000_000 // 10MB
    allowedTypes: ['.zip', '.json']
  }
  
  // 3. Upload to S3/CloudFlare R2
  storage: 'cloud'
  
  // 4. Save metadata to DB
  database: {
    url: string
    size: number
    type: string
  }
}
```

---

## Monitoring & Logging

### Error Tracking
```typescript
// Production error handling
try {
  await riskyOperation()
} catch (error) {
  // Log to service (Sentry, LogRocket)
  logger.error('Operation failed', {
    error,
    userId: session.user.id,
    context: 'playground-creation'
  })
  
  // User-friendly message
  return { error: 'Something went wrong. Please try again.' }
}
```

### Analytics Events
```typescript
// Track user actions
analytics.track('playground_created', {
  template: 'REACT',
  userId: session.user.id,
  timestamp: new Date()
})

analytics.track('ai_completion_accepted', {
  language: 'typescript',
  userId: session.user.id
})
```

---

## Future Enhancements

### 1. Real-time Collaboration
```typescript
// WebSocket/Socket.io integration
interface CollaborationFeature {
  users: OnlineUser[]
  cursors: Record<userId, CursorPosition>
  changes: OperationalTransform[]
}
```

### 2. Version Control
```typescript
// Git-like functionality
interface VersionControl {
  commits: Commit[]
  branches: Branch[]
  currentBranch: string
  diff: (commit1: string, commit2: string) => Diff
}
```

### 3. Marketplace
```typescript
// Template marketplace
interface Template {
  id: string
  name: string
  author: User
  price: number
  downloads: number
  rating: number
}
```

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Maintained By**: Vibe Code Team
