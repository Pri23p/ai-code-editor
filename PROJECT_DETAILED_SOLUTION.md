# 🎯 Vibe Code Editor - Detailed Solution & Design Document

## Table of Contents
1. [Problem Statement](#problem-statement)
2. [Solution Overview](#solution-overview)
3. [Technology Selection & Rationale](#technology-selection--rationale)
4. [Architecture Design](#architecture-design)
5. [Core Implementation Details](#core-implementation-details)
6. [Feature-by-Feature Deep Dive](#feature-by-feature-deep-dive)
7. [Design Patterns Used](#design-patterns-used)
8. [Performance Optimization](#performance-optimization)
9. [Security Considerations](#security-considerations)
10. [Scalability Strategy](#scalability-strategy)
11. [Trade-offs & Decisions](#trade-offs--decisions)
12. [Testing Strategy](#testing-strategy)

---

## Problem Statement

### The Challenge
Building a **browser-based IDE** that:
- Allows developers to code **anywhere**, anytime, on any device
- **Executes code** directly in the browser (no server-side computation needed initially)
- Provides **real-time editing** with intelligent suggestions
- Supports **multiple templates** and frameworks
- Includes **AI assistance** for code completion
- Requires **zero setup** - just login and start coding
- Scales to **thousands** of concurrent users

### Requirements Analysis

#### Functional Requirements
✅ User authentication (OAuth)
✅ File management (CRUD operations)
✅ Code editing with syntax highlighting
✅ Code execution in browser
✅ AI-powered code suggestions
✅ Project templates
✅ Save/restore functionality
✅ Multi-file support
✅ Real-time preview

#### Non-Functional Requirements
✅ Fast load times (<2s initial load)
✅ Responsive UI (60 FPS)
✅ Secure authentication
✅ Data persistence
✅ High availability
✅ Scalable to 10k+ users
✅ Low latency API responses

---

## Solution Overview

### High-Level Approach

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER-BASED IDE                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend: React + Next.js (Type-Safe, SSR-Ready)           │
│  Editor: Monaco (Battle-tested, Feature-rich)               │
│  Execution: WebContainers (WASM + Node.js in Browser)       │
│  State: Zustand (Lightweight, Flexible)                      │
│  AI: Ollama (Local LLM, Privacy-first)                      │
│  Auth: NextAuth (OAuth 2.0, JWT)                            │
│  DB: MongoDB + Prisma (NoSQL Scalability)                   │
└─────────────────────────────────────────────────────────────┘
```

### Why This Approach?

**Browser-Centric**: Users need zero installation
**Stateless Execution**: WebContainers handle code running
**TypeScript-First**: Catch errors at compile-time
**Modular Architecture**: Scale individual features independently
**Privacy-Respecting**: AI runs locally (Ollama), not cloud LLMs

---

## Technology Selection & Rationale

### 1. **Frontend Framework: Next.js 15 with App Router**

#### Why Next.js?
| Aspect | Benefit |
|--------|---------|
| **Full-Stack** | Handle both frontend + backend in one codebase |
| **File-based Routing** | Automatic route generation (no config) |
| **Server Components** | Render heavy operations on server, ship less JS |
| **API Routes** | Built-in backend without separate server |
| **Edge Runtime** | Deploy close to users globally |
| **TypeScript** | Type safety across entire stack |
| **Production Ready** | Used by 1M+ developers globally |

#### Alternative Considered: Vite + Express
❌ Requires backend setup
❌ No integrated solution
❌ More configuration needed

---

### 2. **Editor: Monaco Editor**

#### Why Monaco?
```typescript
// Features needed in IDE editor
✅ Syntax highlighting (multiple languages)
✅ IntelliSense (code suggestions)
✅ Multi-cursor editing
✅ Minimap navigation
✅ Custom themes
✅ Keybindings (VS Code compatible)
✅ Code formatting
✅ Debug support
✅ Extension system
```

#### Why NOT?
- **CodeMirror 6**: Lighter but less feature-rich
- **Ace Editor**: Older, less maintained
- **Sublime Editor**: Proprietary, limited browser integration
- **Build from scratch**: 6+ months development

#### Implementation
```typescript
// Monaco configuration highlights
import Editor from "@monaco-editor/react";

<Editor
  value={fileContent}
  onChange={(value) => updateContent(value)}
  onMount={(editor, monaco) => setupKeybindings(editor, monaco)}
  language={detectLanguage(fileExtension)}
  theme={isDark ? "vs-dark" : "vs-light"}
  options={{
    minimap: { enabled: false }, // Save space
    formatOnSave: true,          // Auto-format
    autoClosingBrackets: "always",
    suggestOnTriggerCharacters: true,
    fontSize: 14,
    fontFamily: "Geist Mono",
  }}
/>
```

---

### 3. **Code Execution: WebContainers**

#### The Core Challenge
How do we run user code **safely** in a **browser**?

#### Solutions Analyzed

**Option A: Cloud-based Execution**
```
User Code → API → Cloud Server → Container
❌ Expensive (compute costs scale with users)
❌ Latency (network round-trip)
❌ Privacy concerns (code sent to server)
❌ Overkill for frontend code
```

**Option B: Local Execution (WebContainers) ✅ CHOSEN**
```
User Code → WebAssembly → Browser Process
✅ No server needed
✅ Instant execution
✅ Privacy (stays in browser)
✅ Scalable (users provide compute)
✅ Offline capable
```

#### How WebContainers Works
```typescript
// Under the hood
1. Download lightweight Debian filesystem (WASM)
2. Boot Node.js runtime in WASM
3. Mount virtual file system
4. Execute npm commands
5. Run dev servers (Vite, Next.js, Express, etc.)
6. Stream output to terminal
```

#### Implementation Example
```typescript
// modules/webcontainers/hooks/useWebContainer.tsx

const useWebContainer = ({ templateData }) => {
  const [instance, setInstance] = useState<WebContainer | null>(null);
  const [serverUrl, setServerUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Boot WebContainer
    const boot = async () => {
      const container = await WebContainer.boot();
      setInstance(container);

      // 2. Write files
      await writeFiles(container, templateData);

      // 3. Install dependencies
      const installProcess = await container.spawn("npm", ["install"]);
      await installProcess.exit;

      // 4. Start dev server
      const devProcess = await container.spawn("npm", ["run", "dev"]);
      
      // 5. Capture output URL
      let url = "";
      for await (const data of devProcess.output) {
        if (data.includes("http://")) {
          url = data.match(/http:\/\/[^\s]+/)[0];
          setServerUrl(url);
          break;
        }
      }
    };

    boot();
  }, []);

  return { instance, serverUrl, isLoading };
};
```

---

### 4. **State Management: Zustand**

#### The State Challenge
Multiple features need shared state:
- File explorer tree
- Open files list
- Active file content
- Editor state
- AI suggestions
- Terminal output

#### Why Zustand Over Redux?
| Aspect | Redux | Zustand | Winner |
|--------|-------|---------|--------|
| Boilerplate | High (actions, reducers) | Minimal | ✅ Zustand |
| Learning Curve | Steep | Gentle | ✅ Zustand |
| Bundle Size | ~8kb | ~1kb | ✅ Zustand |
| DevTools | ✅ Yes | ✅ Yes | 🟩 Tie |
| TypeScript | Good | Excellent | ✅ Zustand |
| Async Logic | Complex | Simple | ✅ Zustand |

#### Store Implementation Pattern
```typescript
// modules/playground/hooks/useFileExplorer.tsx
import { create } from "zustand";

interface FileExplorerState {
  // State
  templateData: TemplateFolder | null;
  openFiles: OpenFile[];
  activeFileId: string | null;
  editorContent: string;

  // Actions
  openFile: (file: TemplateFile) => void;
  closeFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
}

export const useFileExplorer = create<FileExplorerState>((set, get) => ({
  // Initial state
  templateData: null,
  openFiles: [],
  activeFileId: null,
  editorContent: "",

  // Action: Open file
  openFile: (file: TemplateFile) => {
    const fileId = generateFileId(file, get().templateData!);
    const existing = get().openFiles.find(f => f.id === fileId);

    if (existing) {
      // File already open, just switch to it
      set({ activeFileId: fileId, editorContent: existing.content });
    } else {
      // New file, add to open files
      set((state) => ({
        openFiles: [...state.openFiles, { ...file, id: fileId }],
        activeFileId: fileId,
        editorContent: file.content || "",
      }));
    }
  },

  // Action: Update content with unsaved changes tracking
  updateFileContent: (fileId: string, content: string) => {
    set((state) => ({
      openFiles: state.openFiles.map((file) =>
        file.id === fileId
          ? {
              ...file,
              content,
              hasUnsavedChanges: content !== file.originalContent,
            }
          : file
      ),
      editorContent: fileId === state.activeFileId ? content : state.editorContent,
    }));
  },
}));
```

---

### 5. **Authentication: NextAuth v5**

#### Why NextAuth?

**The Problem**: Implementing OAuth is complex
- Token exchange flow
- Session management
- CSRF protection
- Token refresh
- Database session storage

**NextAuth Solution**: Handles all of this!

```typescript
// auth.ts - Single configuration file
export const { auth, handlers, signIn, signOut } = NextAuth({
  // 1. Use Prisma adapter
  adapter: PrismaAdapter(db),

  // 2. OAuth providers
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],

  // 3. Custom callbacks
  callbacks: {
    /**
     * signIn callback: Run when user signs in
     * - Create user if doesn't exist
     * - Link accounts
     * - Custom validation
     */
    async signIn({ user, account, profile }) {
      const existingUser = await db.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        // Create new user
        await db.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,
            accounts: {
              create: {
                type: account!.type,
                provider: account!.provider,
                providerAccountId: account!.providerAccountId,
                refreshToken: account!.refresh_token,
                accessToken: account!.access_token,
                expiresAt: account!.expires_at,
              },
            },
          },
        });
      } else if (!account) {
        // Link account if user exists
        const existingAccount = await db.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account!.provider,
              providerAccountId: account!.providerAccountId,
            },
          },
        });

        if (!existingAccount) {
          await db.account.create({
            data: {
              userId: existingUser.id,
              type: account!.type,
              provider: account!.provider,
              providerAccountId: account!.providerAccountId,
              refreshToken: account!.refresh_token,
              accessToken: account!.access_token,
              expiresAt: account!.expires_at,
            },
          });
        }
      }

      return true;
    },

    /**
     * jwt callback: Add custom claims to JWT
     */
    async jwt({ token, user }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);
      if (!dbUser) return token;

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.role = dbUser.role;

      return token;
    },

    /**
     * session callback: Return user data to client
     */
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },

  // 4. JWT vs Session strategy
  session: { strategy: "jwt" }, // More scalable

  // 5. Secret for signing
  secret: process.env.AUTH_SECRET,
});
```

#### Why JWT Strategy Over Session?
| Aspect | Session | JWT | Winner |
|--------|---------|-----|--------|
| Scalability | Requires DB lookup per request | Stateless | ✅ JWT |
| Performance | Query latency | No DB hit | ✅ JWT |
| Distributed | Hard (shared state) | Easy | ✅ JWT |
| Logout | Immediate | Needs blacklist | 🟩 Session |
| Storage | Server (DB) | Client (Cookie) | ✅ JWT |

---

### 6. **Database: MongoDB + Prisma**

#### Why MongoDB?
```javascript
// Problem: Traditional SQL for Code Editor
- Fixed schema (difficult for user code changes)
- Requires migrations for schema changes
- Horizontal scaling is complex

// Solution: MongoDB
✅ Flexible schema (JSON documents)
✅ Easy to scale horizontally
✅ Natural fit for nested data (file trees)
✅ Rapid development iteration
✅ Document-based (matches app entities)
```

#### Why Prisma ORM?
```typescript
// Before Prisma: Manual queries
const user = db.collection('users').findOne({ email: 'user@email.com' });

// After Prisma: Type-safe, elegant
const user = await prisma.user.findUnique({
  where: { email: "user@email.com" },
  include: { accounts: true }, // Auto-join
});

// TypeScript knows:
// - All available fields
// - Exact return type
// - Relationship structure
// - Validation rules
```

#### Schema Design Rationale
```prisma
// Why separate Account model?
// - Supports multiple OAuth providers per user
// - Stores provider-specific tokens
// - Handles account linking

model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
  
  // Relations
  accounts Account[]      // Can have Google + GitHub
  playgrounds Playground[] // Can have multiple projects
}

model Account {
  id                String @id @default(cuid())
  userId            String
  provider          String // "google" or "github"
  providerAccountId String
  accessToken       String?
  refreshToken      String?
  
  user User @relation(fields: [userId])
  
  // Ensure unique constraints
  @@unique([provider, providerAccountId])
}

// Why TemplateFile as separate model?
// - File structure can be large (JSON object)
// - Updated independently from Playground
// - Optimizes queries (don't fetch content unless needed)

model TemplateFile {
  id            String @id @default(cuid())
  content       Json   // Entire file tree as JSON
  playgroundId  String @unique // 1-to-1 relationship
  
  playground Playground @relation(fields: [playgroundId])
}

// Why StarMark model?
// - Track favorites separately
// - Efficient querying: "Show all starred playgrounds"
// - Enables future features (sorting by stars)

model StarMark {
  id           String @id @default(cuid())
  userId       String
  playgroundId String
  isMarked     Boolean
  
  user       User       @relation(fields: [userId])
  playground Playground @relation(fields: [playgroundId])
  
  @@unique([userId, playgroundId]) // Can star once per project
}
```

---

### 7. **AI: Ollama (Local LLM)**

#### The AI Challenge
How to add intelligent code suggestions **without cloud LLMs**?

#### Solutions Compared

**Option A: OpenAI API**
```
Cost: $0.015 per 1K tokens (~$5-10/user/month)
Privacy: Code sent to OpenAI
Latency: Network dependent
❌ Not sustainable for free product
```

**Option B: Hugging Face API**
```
Cost: Similar to OpenAI
Privacy: Code sent externally
Latency: API latency
❌ Same issues as OpenAI
```

**Option C: Local LLM (Ollama) ✅ CHOSEN**
```
Cost: Zero (self-hosted)
Privacy: Code stays local
Latency: <100ms (local machine)
Model: CodeLlama (code-specific)
✅ Perfect for development environment
```

#### Implementation
```typescript
// app/api/code-completion/route.ts

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { fileContent, cursorLine, cursorColumn, suggestionType } = body;

  // 1. Analyze context
  const context = analyzeCodeContext(fileContent, cursorLine, cursorColumn);

  // 2. Build smart prompt
  const prompt = `
You are a code completion assistant.
Language: ${context.language}
Framework: ${context.framework}

Current code:
${context.beforeContext}
[CURSOR]
${context.afterContext}

Generate ONE suggestion that:
- Completes the current line
- Is syntactically correct
- Follows the existing code style
- Is 1-3 lines maximum

Suggestion:`;

  // 3. Call local Ollama
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: "codellama:latest",
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,        // Some creativity
        num_predict: 100,        // Max tokens
        top_p: 0.9,             // Diversity
      },
    }),
  });

  const data = await response.json();
  return NextResponse.json({ suggestion: data.response });
}
```

#### Why CodeLlama?
```javascript
Regular LLMs like GPT-4:
- General purpose
- Not optimized for code
- Slower

CodeLlama specifics:
✅ Trained on code repositories (GitHub, etc.)
✅ Understands programming idioms
✅ 6B-34B variants (trade off accuracy vs speed)
✅ Can be fine-tuned on your codebase
```

---

### 8. **Styling: TailwindCSS + ShadCN UI**

#### Why Tailwind?

**Before Tailwind** (CSS approach):
```css
/* Verbose, repetitive */
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
}

.button:hover {
  background-color: #2563eb;
}

.button:active {
  background-color: #1d4ed8;
}
```

**With Tailwind**:
```jsx
// Concise, composable
<button className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 active:bg-blue-700 font-semibold text-white">
  Click me
</button>
```

#### Benefits
✅ Utility-first approach (build UIs without leaving HTML)
✅ Consistent spacing/colors (design system)
✅ Dark mode built-in
✅ Mobile-first responsive (sm:, md:, lg: breakpoints)
✅ JIT compilation (only ship used CSS)
✅ Fastest development speed

#### Why ShadCN UI on Top?

Tailwind gives utilities, but UI components need **logic**:
- Button with loading states
- Form validation states
- Dialog animations
- Dropdown interactions

ShadCN provides:
```tsx
// Pre-built, unstyled components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";

// Use like HTML elements
<Button onClick={handleClick}>Save File</Button>

// Fully customizable via Tailwind
<Button className="bg-green-500 hover:bg-green-600">Custom</Button>
```

---

## Architecture Design

### 1. **Layered Architecture**

```
┌─────────────────────────────────────────┐
│    PRESENTATION LAYER                   │
│  React Components + UI                  │
│  Monaco Editor, Terminal                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    STATE LAYER                          │
│  Zustand Stores                         │
│  Session State (NextAuth)               │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    ROUTING LAYER                        │
│  Next.js App Router                     │
│  Middleware                             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    API LAYER                            │
│  Route Handlers                         │
│  Server Actions                         │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┬──────────┐
       │               │          │
┌──────▼────┐  ┌──────▼──┐  ┌────▼──────┐
│ DATABASE  │  │EXTERNAL │  │ RUNTIME   │
│ MongoDB   │  │ Ollama  │  │WebContainer
└───────────┘  └─────────┘  └───────────┘
```

### 2. **Module-Based Organization**

```
modules/
├── auth/               # Authentication logic
│   ├── actions/        # Server-side auth operations
│   ├── components/     # Auth UI components
│   └── hooks/          # Auth custom hooks
│
├── dashboard/          # Project management
│   ├── actions/        # Playground CRUD
│   └── components/     # Dashboard UI
│
├── playground/         # Main editor
│   ├── hooks/          # State management (Zustand)
│   ├── components/     # Editor components
│   ├── lib/           # Utility functions
│   └── actions/        # Save/load logic
│
├── webcontainers/      # Code execution
│   ├── hooks/          # WebContainer logic
│   └── components/     # Preview/terminal UI
│
└── ai-chat/            # AI features
    └── components/     # Chat UI
```

**Why Modules?**
- **Separation of Concerns**: Each module owns its domain
- **Easy to Scale**: Add features without touching other modules
- **Testability**: Mock module dependencies
- **Reusability**: Import components/hooks across app
- **Code Organization**: Find features quickly

### 3. **Component Hierarchy**

```
App Root
├── SessionProvider (NextAuth)
├── ThemeProvider (Dark/Light)
├── Toaster (Notifications)
│
├── Home Page
│   ├── Hero Section
│   └── CTA Buttons
│
├── Dashboard Page
│   ├── DashboardSidebar
│   ├── ProjectTable/Cards
│   └── NewProjectDialog
│
└── Playground Page [id]
    ├── Header
    │   ├── Title
    │   ├── SaveButtons
    │   └── Settings Menu
    ├── Main Layout (Resizable)
    │   ├── FileExplorer Sidebar
    │   │   ├── File Tree
    │   │   ├── Context Menus
    │   │   └── New File/Folder Dialogs
    │   │
    │   ├── Editor Area
    │   │   ├── TabBar (Open Files)
    │   │   ├── MonacoEditor
    │   │   └── AI Suggestions Overlay
    │   │
    │   ├── Preview Panel
    │   │   ├── WebContainer Preview (iframe)
    │   │   └── Terminal (xterm.js)
    │   │
    │   └── AI Chat Sidebar
    │       ├── Message History
    │       └── Input Box
    │
    └── Modals/Dialogs
        ├── NewFileDialog
        ├── RenameDialog
        ├── DeleteConfirmation
        └── SettingsModal
```

---

## Core Implementation Details

### 1. **File Management System**

#### How Files Are Stored

```typescript
// In MongoDB
{
  "_id": "playground_1",
  "templateFiles": [
    {
      "id": "template_file_1",
      "content": {
        "items": [
          {
            "folderName": "src",
            "items": [
              {
                "filename": "App",
                "fileExtension": "tsx",
                "content": "export default function App() { ... }"
              }
            ]
          }
        ]
      }
    }
  ]
}

// In Memory (Client)
templateData = {
  folderName: "root",
  items: [
    {
      folderName: "src",
      items: [
        {
          filename: "App",
          fileExtension: "tsx",
          content: "..."
        }
      ]
    }
  ]
}

// Open Files Tracking
openFiles = [
  {
    id: "file_123",              // Unique identifier
    filename: "App",
    fileExtension: "tsx",
    content: "...",              // Current editor content
    originalContent: "...",      // Last saved version
    hasUnsavedChanges: true      // Dirty flag
  }
]
```

#### Why This Structure?

```
✅ Nested folders represented as tree
✅ Each file tracks original vs current content
✅ Unsaved changes marked with dirty flag
✅ Easy to sync with WebContainer fs
✅ Supports JSON serialization (MongoDB friendly)
```

---

### 2. **Save Mechanism with Debouncing**

```typescript
// modules/playground/hooks/useFileExplorer.tsx

// Track if auto-save is needed
const [needsSave, setNeedsSave] = useState(false);

// Debounced save (prevents saving every keystroke)
useEffect(() => {
  if (!needsSave) return;

  const saveTimer = setTimeout(() => {
    handleSaveAll();
    setNeedsSave(false);
  }, 1000); // Wait 1 second after last change

  return () => clearTimeout(saveTimer);
}, [needsSave, editorContent]);

// When content changes
const handleContentChange = (newContent: string) => {
  updateFileContent(activeFileId, newContent);
  setNeedsSave(true); // Queue for saving
};

// Manual save
const handleSaveAll = async () => {
  try {
    const result = await SaveUpdatedCode(playgroundId, templateData);
    if (result) {
      toast.success("All changes saved");
      clearUnsavedMarks(); // Remove orange dots
    }
  } catch (error) {
    toast.error("Failed to save");
  }
};
```

#### Why Debouncing?
❌ **Without debouncing**: Save on every keystroke
- 50 saves per second (overkill!)
- Database overwhelmed
- Network congestion
- Battery drain

✅ **With debouncing**: Save after pauses in typing
- Intelligent batching
- Respects user rhythm
- Efficient API usage
- Better UX

---

### 3. **Real-time File Sync Between Editor & WebContainer**

```typescript
// When user clicks Run/Preview
const syncFilesToContainer = async () => {
  for (const file of openFiles) {
    const filePath = `${projectPath}/${file.filename}.${file.fileExtension}`;
    
    // Write to WebContainer filesystem
    await writeFileSync(filePath, file.content);
  }

  // Then npm install & npm run dev
  await runDevServer();
};

// When user saves a file
const handleSave = async () => {
  // 1. Update state
  updateFileContent(fileId, newContent);

  // 2. Save to database
  await SaveUpdatedCode(playgroundId, templateData);

  // 3. Sync to WebContainer (if running)
  if (instance) {
    await writeFileSync(filePath, newContent);
    // WebContainer auto-reloads (hot reload)
  }
};
```

#### Challenges Solved
| Challenge | Solution |
|-----------|----------|
| File write latency | Buffer writes, batch operations |
| npm install time | Cache node_modules |
| Hot reload | Use Vite/Next.js dev servers |
| Large file trees | Only write changed files |

---

### 4. **AI Suggestion Integration**

```typescript
// User presses Ctrl+Space
const handleAISuggestion = async (editor) => {
  // 1. Get context
  const cursorPos = editor.getPosition();
  const fileContent = editor.getValue();
  
  // 2. Detect language
  const language = detectLanguage(activeFile.fileExtension);
  
  // 3. Figure out what kind of help needed
  const suggestionType = guessContext(fileContent, cursorPos);
  // → "completion", "generation", "function", etc.
  
  // 4. Call API
  const response = await fetch("/api/code-completion", {
    method: "POST",
    body: JSON.stringify({
      fileContent,
      cursorLine: cursorPos.lineNumber - 1,
      cursorColumn: cursorPos.column - 1,
      suggestionType,
      fileName: activeFile.filename,
    }),
  });

  const data = await response.json();

  // 5. Show inline suggestion
  showInlineCompletion(editor, data.suggestion, cursorPos);

  // 6. User can accept (Tab) or reject (Esc)
};

// Accept suggestion
const acceptSuggestion = (editor, monaco) => {
  editor.executeEdits("ai", [
    {
      range: new monaco.Range(
        suggestionPos.line,
        suggestionPos.column,
        suggestionPos.line,
        suggestionPos.column
      ),
      text: suggestion,
    },
  ]);
  
  // Clear the ghost text
  clearSuggestionDecoration();
};
```

---

## Feature-by-Feature Deep Dive

### Feature 1: Authentication Flow (OAuth)

**User Journey**:
```
1. User clicks "Sign in with Google"
   ↓
2. Redirects to Google OAuth consent screen
   ↓
3. User grants permission
   ↓
4. Google redirects back with auth code
   ↓
5. NextAuth exchanges code for tokens:
   POST https://oauth2.googleapis.com/token
   {
     code: "...",
     client_id: "...",
     client_secret: "...",
     redirect_uri: "..."
   }
   ↓
   Returns: { access_token, id_token, ... }
   
6. NextAuth calls signIn() callback
   ├─ Extract user info from token
   ├─ Check if user exists in DB
   ├─ If not → Create new user
   ├─ If yes → Link new account
   └─ Return true/false
   
7. If success → Create JWT token
   {
     sub: "user_123",        // Subject (user ID)
     name: "John Doe",
     email: "john@example.com",
     role: "USER",
     iat: 1234567890,        // Issued at
     exp: 1234654290         // Expires at
   }
   
8. Set httpOnly cookie with JWT
   ↓
9. Redirect to dashboard
   ↓
10. Session available via useSession()
```

**Why JWT Over Sessions?**
```
Session approach:
├─ User logs in
├─ Create session in DB
├─ Set session ID in cookie
└─ On each request → DB lookup (slow!)

JWT approach:
├─ User logs in
├─ Create signed JWT (no DB)
├─ Set JWT in cookie
└─ Browser sends JWT, server verifies signature (fast!)
   └─ Signature proves JWT wasn't forged
```

---

### Feature 2: File Explorer + CRUD

**Create File**:
```typescript
handleAddFile(newFile, parentPath) {
  // 1. Find parent folder in tree
  const parentFolder = findFolderByPath(templateData, parentPath);
  
  // 2. Add new file to parent's items
  parentFolder.items.push({
    filename: newFile.filename,
    fileExtension: newFile.fileExtension,
    content: "",
  });
  
  // 3. Update state
  setTemplateData({ ...templateData });
  
  // 4. Sync to database
  await SaveUpdatedCode(playgroundId, templateData);
  
  // 5. Sync to WebContainer
  await writeFileSync(`${parentPath}/${newFile.filename}`, "");
  
  // 6. Show success
  toast.success("File created");
}
```

**Delete File** (with validation):
```typescript
handleDeleteFile(file, parentPath) {
  // 1. Check if file is open
  if (openFiles.find(f => f.filename === file.filename)) {
    closeFile(fileId); // Close before deleting
  }
  
  // 2. Find and remove from tree
  const parent = findFolderByPath(templateData, parentPath);
  parent.items = parent.items.filter(
    f => f.filename !== file.filename
  );
  
  // 3. Update state → DB → WebContainer
  // ... same sync process
  
  // 4. If there are unsaved changes, mark
  if (editorContent !== file.originalContent) {
    toast.warning("Lost unsaved changes");
  }
}
```

**Rename File**:
```typescript
handleRenameFile(oldName, newName, parentPath) {
  // 1. Find file in tree
  const file = findFileByPath(templateData, parentPath, oldName);
  
  // 2. Update filename
  file.filename = newName;
  
  // 3. If file is open, update tab label
  // (content stays same, just display name changes)
  
  // 4. Update state → DB → WebContainer
}
```

---

### Feature 3: Code Execution via WebContainers

**Startup Process**:
```typescript
useEffect(() => {
  const initContainer = async () => {
    // 1. Boot WebContainer
    const container = await WebContainer.boot();
    
    // 2. Write all template files to container filesystem
    await syncTemplateToContainer(container, templateData);
    
    // 3. Install dependencies (npm install)
    const installProcess = await container.spawn("npm", ["install"]);
    const exitCode = await installProcess.exit;
    
    if (exitCode !== 0) {
      setError("Failed to install dependencies");
      return;
    }
    
    // 4. Start dev server
    const devProcess = await container.spawn("npm", ["run", "dev"]);
    
    // 5. Capture console output to find server URL
    const urlRegex = /http:\/\/localhost:[0-9]+/;
    for await (const chunk of devProcess.output) {
      const match = chunk.match(urlRegex);
      if (match) {
        setServerUrl(match[0]);
        break;
      }
    }
  };

  initContainer();
}, [templateData]);
```

**File Updates During Development**:
```typescript
// User edits App.tsx and saves
handleSave() {
  updateFileContent(fileId, newContent);
  await SaveUpdatedCode(playgroundId, templateData);
  
  // 4. If container is running, sync just this file
  if (instance && serverUrl) {
    const filePath = "src/App.tsx";
    await instance.fs.writeFile(filePath, newContent);
    
    // Vite/Next.js detects change via file watcher
    // Automatically hot-reloads in browser
    // User sees updated UI instantly
  }
}
```

---

### Feature 4: Terminal Integration

```typescript
// modules/webcontainers/components/terminal.tsx

useEffect(() => {
  const initTerminal = async () => {
    // 1. Create xterm.js terminal UI
    const term = new Terminal({
      cols: 80,
      rows: 24,
      fontSize: 12,
      fontFamily: "Geist Mono",
    });
    
    // 2. Render to DOM
    term.open(document.getElementById("terminal"));
    
    // 3. Create shell process in WebContainer
    const shellProcess = await instance.spawn("bash", []);
    
    // 4. Connect terminal input to shell
    term.onData((data) => {
      shellProcess.input.write(data);
    });
    
    // 5. Connect shell output to terminal display
    shellProcess.output.pipeTo(
      new WritableStream({
        write(chunk) {
          term.write(chunk);
        },
      })
    );
  };

  initTerminal();
}, [instance]);
```

**Terminal Capabilities**:
```bash
$ npm run dev          # Start dev server
$ npm install package  # Install packages
$ ls -la              # List files
$ cat file.txt        # View file contents
$ echo "Hello"        # Echo output
$ node script.js      # Run Node scripts
# Full bash shell inside browser!
```

---

## Design Patterns Used

### 1. **Singleton Pattern** (Zustand Stores)
```typescript
// Create once, use everywhere
export const useFileExplorer = create(() => ({
  // Store state and methods
}));

// In components
function Component1() {
  const { openFiles } = useFileExplorer();
  // Access same state instance
}

function Component2() {
  const { openFiles } = useFileExplorer();
  // Same state instance (not duplicated)
}
```

### 2. **Observer Pattern** (React State)
```typescript
// Component subscribes to state changes
function Editor() {
  const editorContent = useFileExplorer(state => state.editorContent);
  // Re-renders when editorContent changes
}

// Another component also subscribes
function StatusBar() {
  const editorContent = useFileExplorer(state => state.editorContent);
  // Gets updates too
}
```

### 3. **Factory Pattern** (Component Factories)
```typescript
// Generate components based on data
const componentMap = {
  "tsx": <TSXEditor />,
  "js": <JSEditor />,
  "css": <CSSEditor />,
  "json": <JSONEditor />,
};

const EditorComponent = componentMap[fileExtension] || <TextEditor />;
```

### 4. **Adapter Pattern** (Prisma)
```typescript
// Adapts MongoDB API to Prisma syntax
// Without: db.collection("users").findOne({...})
// With Prisma:
const user = await db.user.findUnique({
  where: { email: "..." },
});
```

### 5. **Strategy Pattern** (AI Suggestions)
```typescript
// Different strategies based on context
const strategies = {
  "completion": completionStrategy,
  "generation": generationStrategy,
  "refactoring": refactoringStrategy,
};

const suggestion = await strategies[suggestionType](code);
```

---

## Performance Optimization

### 1. **Code Splitting**
```typescript
// Load editor on demand (not on home page)
const PlaygroundEditor = dynamic(
  () => import("@/modules/playground/components/playground-editor"),
  { loading: () => <Loading /> }
);

// Only loads when user navigates to playground
```

### 2. **Image Optimization**
```typescript
import Image from "next/image";

// Automatic:
// ✅ AVIF format for modern browsers
// ✅ WebP fallback
// ✅ Lazy loading
// ✅ Responsive sizes

<Image
  src="/hero.svg"
  alt="Hero"
  width={500}
  height={500}
  priority // Load immediately
/>
```

### 3. **Memoization**
```typescript
// Prevent unnecessary re-renders
const PlaygroundEditor = memo(({ content, onChange }) => {
  return <MonacoEditor value={content} onChange={onChange} />;
});

// Or with useCallback
const handleSave = useCallback(() => {
  // Expensive operation
}, [dependencies]);
```

### 4. **Virtualization** (Long Lists)
```typescript
// For large file trees, render only visible items
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={600}
  itemCount={files.length}
  itemSize={35}
>
  {({ index, style }) => (
    <FileItem file={files[index]} style={style} />
  )}
</FixedSizeList>
```

### 5. **Debouncing & Throttling**
```typescript
// Debounce save (wait for pause)
const debouncedSave = debounce((content) => {
  SaveUpdatedCode(playgroundId, content);
}, 1000);

// Throttle scroll (max once per 16ms = 60fps)
const handleScroll = throttle(() => {
  updateVisibleItems();
}, 16);
```

### 6. **Caching Strategy**
```typescript
// Cache template structures
const cachedTemplates = new Map();

export const getTemplate = async (id) => {
  if (cachedTemplates.has(id)) {
    return cachedTemplates.get(id);
  }
  
  const template = await fetchFromDB(id);
  cachedTemplates.set(id, template);
  return template;
};
```

---

## Security Considerations

### 1. **CSRF Protection**
```typescript
// NextAuth handles via tokens
// Each mutation includes CSRF token
// Prevents cross-site request forgery
```

### 2. **XSS Prevention**
```typescript
// React escapes by default
// User-submitted code displayed safely
<pre>{userCode}</pre> // ✅ Safe

// Monaco editor in sandbox
<iframe sandbox="allow-scripts" src={previewUrl} />
```

### 3. **SQL Injection Prevention**
```typescript
// Prisma uses parameterized queries
await db.user.findUnique({
  where: { email: userInput }, // ✅ Parameterized
});

// Not vulnerable to injection
```

### 4. **JWT Token Security**
```typescript
// Stored in httpOnly cookie
// Cannot access via JavaScript
// Automatically sent with requests
// Protected from XSS attacks

// Set-Cookie: __Secure-next-auth.session-token=...; HttpOnly; Secure; SameSite=Lax
```

### 5. **Rate Limiting** (Future)
```typescript
// Prevent brute force on AI endpoint
import rateLimit from 'bottleneck';

const limiter = new rateLimit.Limiter({
  maxConcurrent: 1,
  minTime: 100, // 100ms between requests
});

await limiter.schedule(() => callAI());
```

### 6. **Environment Variables**
```
// .env.local (NEVER commit)
DATABASE_URL=mongodb://...
AUTH_SECRET=xxx
AUTH_GOOGLE_ID=xxx
AUTH_GOOGLE_SECRET=xxx

// Next.js exposes only what's needed to browser
NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## Scalability Strategy

### 1. **Horizontal Scaling**
```
Current: Single Next.js server
├─ File: .env.local (local)
├─ Database: MongoDB (cloud-hosted)
└─ Cache: Redis (for sessions)

Scaled approach:
├─ Load Balancer
│  ├─ Next.js Server 1
│  ├─ Next.js Server 2
│  └─ Next.js Server 3
├─ MongoDB Replica Set
│  ├─ Primary
│  ├─ Secondary 1
│  └─ Secondary 2
├─ Redis Cluster (session cache)
└─ CDN (static assets)
```

### 2. **Database Optimization**
```typescript
// Add indexes on frequently queried fields
model Playground {
  id        String @id
  userId    String @db.ObjectId
  createdAt DateTime
  
  // Index by userId for quick lookups
  @@index([userId])
  
  // Compound index for favorites
  @@index([userId, id])
}

// Pagination for large result sets
const playgrounds = await db.playground.findMany({
  where: { userId },
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: "desc" },
});
```

### 3. **API Rate Limiting**
```typescript
// app/api/middleware/rateLimit.ts
export const rateLimit = async (req: NextRequest) => {
  const ip = req.ip || "unknown";
  const key = `rate-limit:${ip}`;
  
  // Check Redis for request count
  const count = await redis.incr(key);
  
  if (count > RATE_LIMIT) {
    return new Response("Too many requests", { status: 429 });
  }
  
  // Set 1-minute expiration
  if (count === 1) {
    await redis.expire(key, 60);
  }
};
```

### 4. **WebContainer Pooling** (Future)
```typescript
// Instead of booting container per user
// Maintain pool of pre-booted containers

class ContainerPool {
  private containers: WebContainer[] = [];
  
  async acquire() {
    if (this.containers.length > 0) {
      return this.containers.pop(); // Reuse
    }
    return await WebContainer.boot(); // Boot new
  }
  
  release(container: WebContainer) {
    this.containers.push(container); // Return to pool
  }
}
```

### 5. **Content Delivery Network (CDN)**
```typescript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['cdn.example.com'],
    formats: ['image/avif', 'image/webp'],
  },
};

// Serve JS/CSS from CDN (CloudFlare, Vercel Edge)
// Distribute globally for faster downloads
```

---

## Trade-offs & Decisions

### 1. **WebContainers vs Cloud Execution**

| Aspect | WebContainers | Cloud |
|--------|---------------|-------|
| Cost | Free | $5-50/user/month |
| Latency | <100ms | 200ms+ |
| Privacy | Local | Sent to server |
| Scalability | User-limited | Infinite |
| Offline | Possible | No |
| Complex apps | Limited | Full support |

**Decision**: WebContainers for MVP
**Future**: Hybrid (small projects local, large projects cloud)

---

### 2. **MongoDB vs PostgreSQL**

| Aspect | MongoDB | PostgreSQL |
|--------|---------|-----------|
| Schema | Flexible | Rigid |
| Scalability | Horizontal | Complex |
| Joins | Expensive | Optimized |
| JSON support | Native | JSONB |
| ACID | Not guaranteed | Strong |

**Decision**: MongoDB
**Rationale**: 
- Rapid development (no migrations)
- Natural JSON fit for file trees
- Horizontal scaling

---

### 3. **Real-time Updates: WebSockets vs Polling**

| Method | Latency | Complexity | Cost |
|--------|---------|-----------|------|
| WebSockets | <50ms | Medium | Higher |
| Polling | 1-5s | Simple | Lower |

**Decision**: Polling (debounced saves)
**Rationale**: 
- Single-user editing (no collaboration yet)
- Simpler implementation
- Good enough for use case

**Future**: WebSockets for collaborative editing

---

### 4. **Local AI vs Cloud AI**

| Aspect | Local (Ollama) | Cloud (OpenAI) |
|--------|----------------|----------------|
| Cost | Free | $0.015/1K tokens |
| Privacy | 100% local | Data sent out |
| Quality | Good (6-34B) | Better (GPT-4) |
| Speed | <100ms | 500ms+ |
| Offline | Works | No |

**Decision**: Local Ollama
**Rationale**:
- Privacy for developers
- Zero API costs
- Fast feedback loops
- Works offline

---

## Testing Strategy

### 1. **Unit Tests** (Functions)
```typescript
// lib/__tests__/utils.test.ts
describe("generateFileId", () => {
  test("should generate unique IDs", () => {
    const id1 = generateFileId({ filename: "App", fileExtension: "tsx" });
    const id2 = generateFileId({ filename: "App", fileExtension: "tsx" });
    
    expect(id1).toBe(id2); // Same file = same ID
  });
});
```

### 2. **Integration Tests** (Features)
```typescript
// app/api/__tests__/code-completion.test.ts
describe("/api/code-completion", () => {
  test("should return suggestion for TypeScript", async () => {
    const response = await fetch("/api/code-completion", {
      method: "POST",
      body: JSON.stringify({
        fileContent: "const x = ",
        cursorLine: 0,
        cursorColumn: 10,
        suggestionType: "completion",
      }),
    });

    const data = await response.json();
    expect(data.suggestion).toMatch(/\w/); // Has content
  });
});
```

### 3. **E2E Tests** (User Flows)
```typescript
// e2e/editor.spec.ts
test("user can create, edit, and save file", async ({
  page,
}) => {
  // 1. Login
  await page.goto("/");
  await page.click("[data-testid=login-button]");
  
  // 2. Navigate to playground
  await page.click("[data-testid=new-project]");
  
  // 3. Create file
  await page.click("[data-testid=add-file]");
  
  // 4. Edit file
  await page.type("[data-testid=editor]", "console.log('hello')");
  
  // 5. Save
  await page.click("[data-testid=save]");
  
  // 6. Assert saved
  await expect(page.locator("[data-testid=save-indicator]")).toBeHidden();
});
```

### 4. **Performance Tests**
```typescript
// e2e/performance.spec.ts
test("editor should load within 2 seconds", async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto("/playground/test-id");
  await page.waitForSelector("[data-testid=editor]");
  
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(2000);
});
```

---

## Summary

### Key Design Principles

1. **Browser-First**: Code execution in browser (WebContainers)
2. **Privacy-Respecting**: Local AI (Ollama), all data stays with user
3. **Developer Experience**: Familiar tools (Monaco, VS Code keybindings)
4. **Type-Safe**: TypeScript throughout
5. **Modular**: Feature modules, independent scaling
6. **Stateless**: JWT-based auth, 12-factor app ready
7. **Performant**: Debouncing, code splitting, lazy loading
8. **Secure**: CSRF protection, XSS prevention, secure headers

### Architecture Strengths

✅ Scalable horizontally (stateless API)
✅ Privacy-first (code stays local)
✅ Fast (WebContainers, CDN)
✅ Maintainable (modular structure)
✅ Type-safe (TypeScript)
✅ User-friendly (familiar tools)

### Future Improvements

1. **Collaborative Editing** (WebSockets + Yjs)
2. **Advanced Debugging** (Chrome DevTools integration)
3. **Cloud Code Execution** (for compute-heavy tasks)
4. **GitHub Integration** (clone/push repos)
5. **Docker Support** (run containerized apps)
6. **Database Support** (connect to PostgreSQL, MongoDB)
7. **Testing Framework Integration** (Jest, Vitest)
8. **Version Control** (Git history, branching)
9. **Sharing & Collaboration** (Real-time collaboration)
10. **Extensions Marketplace** (Custom tools)

---

**Document Version**: 2.0
**Last Updated**: February 6, 2026
**Maintained By**: Development Team
