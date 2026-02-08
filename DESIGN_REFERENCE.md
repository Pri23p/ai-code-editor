# 📚 Vibe Code Editor - Complete Design & Model Reference

## Quick Navigation

| Document | Description | Link |
|----------|-------------|------|
| **Architecture & Data Models** | System architecture, database schemas, TypeScript interfaces, API design | [ARCHITECTURE_AND_MODELS.md](./ARCHITECTURE_AND_MODELS.md) |
| **UI/UX Design System** | Component library, color system, typography, layouts | [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md) |
| **WebContainers Architecture** | Code execution, file system, terminal, preview system | [WEBCONTAINERS_ARCHITECTURE.md](./WEBCONTAINERS_ARCHITECTURE.md) |
| **Complete Explanation** | Detailed component-by-component guide | [COMPLETE_DETAILED_EXPLANATION.md](./COMPLETE_DETAILED_EXPLANATION.md) |
| **Project Solution** | Problem statement, technology choices, tradeoffs | [PROJECT_DETAILED_SOLUTION.md](./PROJECT_DETAILED_SOLUTION.md) |

---

## 🏗️ System Architecture Summary

### High-Level Overview

```
┌────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────┐     │
│  │              PRESENTATION LAYER                      │     │
│  │  - Next.js Pages & Layouts                           │     │
│  │  - React Components (ShadCN UI)                      │     │
│  │  - TailwindCSS Styling                               │     │
│  │  - Zustand State Management                          │     │
│  └──────────────────────────────────────────────────────┘     │
│                        ↕                                       │
│  ┌──────────────────────────────────────────────────────┐     │
│  │            PLAYGROUND LAYER                          │     │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐         │     │
│  │  │ Monaco   │  │ xterm.js │  │  Preview   │         │     │
│  │  │ Editor   │  │ Terminal │  │  Iframe    │         │     │
│  │  └──────────┘  └──────────┘  └────────────┘         │     │
│  │              ↕                                       │     │
│  │      ┌──────────────────────┐                        │     │
│  │      │   WebContainers      │                        │     │
│  │      │   (Node.js WASM)     │                        │     │
│  │      │   Virtual File Sys   │                        │     │
│  │      └──────────────────────┘                        │     │
│  └──────────────────────────────────────────────────────┘     │
│                        ↕                                       │
└────────────────────────────────────────────────────────────────┘
                         ↕
┌────────────────────────────────────────────────────────────────┐
│                    NEXT.JS BACKEND                             │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐     │
│  │              API ROUTES                              │     │
│  │  - /api/auth/[...nextauth]   (OAuth)                │     │
│  │  - /api/chat                 (AI Chat)              │     │
│  │  - /api/code-completion      (AI Suggestions)       │     │
│  │  - /api/template/[id]        (Load Templates)       │     │
│  └──────────────────────────────────────────────────────┘     │
│                        ↕                                       │
│  ┌──────────────────────────────────────────────────────┐     │
│  │           SERVER ACTIONS                             │     │
│  │  - createPlayground()                                │     │
│  │  - getMyProjects()                                   │     │
│  │  - starPlayground()                                  │     │
│  │  - saveTemplateFiles()                               │     │
│  └──────────────────────────────────────────────────────┘     │
│                        ↕                                       │
│  ┌──────────────────────────────────────────────────────┐     │
│  │              PRISMA ORM                              │     │
│  └──────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────┘
                         ↕
┌────────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                             │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐           │
│  │ MongoDB  │  │  Ollama  │  │ OAuth Providers    │           │
│  │ Atlas    │  │  (Local) │  │ (Google/GitHub)    │           │
│  └──────────┘  └──────────┘  └────────────────────┘           │
└────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Models Summary

### Entity Relationship Overview

```
USER
 ├─ Has many → ACCOUNT (OAuth credentials)
 ├─ Creates many → PLAYGROUND (Projects)
 ├─ Stars many → STARMARK (Bookmarks)
 └─ Sends many → CHATMESSAGE (AI conversations)

PLAYGROUND
 ├─ Belongs to → USER
 ├─ Has one → TEMPLATEFILE (Code files)
 └─ Has many → STARMARK (Who starred it)

TEMPLATEFILE
 └─ Belongs to → PLAYGROUND (One-to-One)
```

### Core Models Quick Reference

| Model | Key Fields | Purpose |
|-------|------------|---------|
| **User** | id, email, name, image, role | Authentication & profile |
| **Account** | userId, provider, accessToken | OAuth credentials |
| **Playground** | id, title, template, userId | Code projects |
| **TemplateFile** | playgroundId, content (JSON) | Project files & code |
| **StarMark** | userId, playgroundId, isMarked | Project bookmarks |
| **ChatMessage** | userId, role, content | AI chat history |

---

## 🎨 Design System Quick Reference

### Color Palette

```css
/* Light Mode */
Background: #FFFFFF
Foreground: #1A1A1A
Primary: #2563EB (Blue)
Secondary: #64748B (Slate)
Accent: #F59E0B (Amber)
Success: #10B981 (Green)
Error: #EF4444 (Red)

/* Dark Mode */
Background: #0A0A0F
Foreground: #F5F5F5
Primary: #3B82F6 (Lighter Blue)
Secondary: #94A3B8 (Lighter Slate)
```

### Typography Scale

```
Hero: 48px (3rem) - font-bold
H1:   36px (2.25rem) - font-bold
H2:   30px (1.875rem) - font-semibold
H3:   24px (1.5rem) - font-semibold
H4:   20px (1.25rem) - font-medium
Body: 16px (1rem) - font-normal
Small: 14px (0.875rem) - font-normal
Caption: 12px (0.75rem) - font-normal
```

### Spacing Scale

```
xs:  4px
sm:  8px
md:  16px (Base unit)
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

---

## 🧩 Component Library Reference

### Button Variants

```tsx
<Button variant="default">      Primary action
<Button variant="secondary">    Secondary action
<Button variant="destructive">  Delete/dangerous
<Button variant="outline">      Subtle action
<Button variant="ghost">        Minimal action
<Button variant="link">         Text link style

// Sizes
<Button size="sm">   Small
<Button size="default">  Medium (default)
<Button size="lg">   Large
<Button size="icon"> Icon only (square)
```

### Layout Components

```tsx
// Card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>

// Dialog
<Dialog>
  <DialogTrigger>Button</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    Content
    <DialogFooter>Actions</DialogFooter>
  </DialogContent>
</Dialog>

// Tabs
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content</TabsContent>
</Tabs>
```

---

## 🔌 API Endpoints Reference

### Authentication

```typescript
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/session
```

### Playground Operations

```typescript
// Server Actions (called from client)
createPlayground(data: CreatePlaygroundInput): Promise<Playground>
getMyProjects(userId: string): Promise<Playground[]>
starPlayground(playgroundId: string): Promise<void>
deletePlayground(playgroundId: string): Promise<void>

// API Routes
GET  /api/template/[id]     // Fetch project files
POST /api/template/[id]     // Save project files
```

### AI Services

```typescript
POST /api/code-completion
Request: {
  prompt: string
  language: string
  cursorPosition: number
}
Response: {
  completion: string
  confidence: number
}

POST /api/chat
Request: {
  messages: ChatMessage[]
  files?: string[]
}
Response: Server-Sent Events (streaming)
```

---

## ⚙️ WebContainers Reference

### Initialization

```typescript
// 1. Boot WebContainer
const wc = await WebContainer.boot()

// 2. Mount file system
await wc.mount(fileSystemTree)

// 3. Install dependencies
await wc.spawn('npm', ['install'])

// 4. Start dev server
await wc.spawn('npm', ['run', 'dev'])

// 5. Listen for server
wc.on('server-ready', (port, url) => {
  // Open preview
})
```

### File Operations

```typescript
// Read file
const content = await wc.fs.readFile('/src/App.tsx', 'utf-8')

// Write file
await wc.fs.writeFile('/src/App.tsx', newContent)

// Delete file
await wc.fs.rm('/src/Component.tsx')

// Create directory
await wc.fs.mkdir('/src/components', { recursive: true })

// List directory
const files = await wc.fs.readdir('/src')
```

### Terminal Commands

```typescript
// Execute command
const process = await wc.spawn('npm', ['install'])

// Stream output
process.output.pipeTo(new WritableStream({
  write(data) {
    terminal.write(data)
  }
}))

// Wait for completion
const exitCode = await process.exit
```

---

## 🗂️ Project Structure

```
codeditor/
├── app/
│   ├── (auth)/              # Auth pages (login)
│   ├── (root)/              # Home page
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth
│   │   ├── chat/            # AI chat
│   │   ├── code-completion/ # AI suggestions
│   │   └── template/        # Load/save templates
│   ├── dashboard/           # User dashboard
│   └── playground/          # Code editor
│       └── [id]/            # Dynamic playground page
│
├── components/
│   ├── providers/           # Context providers
│   └── ui/                  # ShadCN components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...
│
├── modules/
│   ├── auth/                # Authentication module
│   │   ├── actions/         # Server actions
│   │   ├── components/      # Auth UI
│   │   └── types.ts
│   ├── dashboard/           # Dashboard module
│   ├── playground/          # Playground module
│   │   ├── components/
│   │   │   ├── FileExplorer.tsx
│   │   │   ├── MonacoEditor.tsx
│   │   │   ├── Terminal.tsx
│   │   │   └── Preview.tsx
│   │   └── lib/
│   ├── ai-chat/             # AI chat module
│   └── webcontainers/       # WebContainer integration
│       ├── hooks/
│       │   ├── useWebContainer.ts
│       │   └── transformer.ts
│       └── ...
│
├── lib/
│   ├── db.ts                # Prisma client
│   ├── template.ts          # Template utilities
│   └── utils.ts             # Helper functions
│
├── prisma/
│   └── schema.prisma        # Database schema
│
├── public/                  # Static assets
│
├── vibecode-starters/       # Project templates
│   ├── react-app/
│   ├── nextjs-new/
│   ├── express-simple/
│   ├── vue/
│   ├── hono-app/
│   └── angular-app/
│
├── auth.ts                  # NextAuth config
├── middleware.ts            # Route protection
├── next.config.ts           # Next.js config
└── package.json
```

---

## 🚀 Key Features Implementation

### 1. Authentication Flow

```
User clicks "Login with Google"
    ↓
Redirect to Google OAuth
    ↓
User grants permission
    ↓
Google returns auth code
    ↓
NextAuth exchanges code for token
    ↓
Create/update User & Account in MongoDB
    ↓
Set session cookie (JWT)
    ↓
Redirect to Dashboard
```

### 2. Create Project Flow

```
User clicks "New Project"
    ↓
Dialog opens with template selection
    ↓
User selects template (React, Vue, etc.)
    ↓
Server action: createPlayground()
    ↓
Create Playground record in DB
    ↓
Load template files
    ↓
Create TemplateFile record
    ↓
Redirect to /playground/[id]
    ↓
Boot WebContainer
    ↓
Mount file system
    ↓
Install dependencies
    ↓
Start dev server
    ↓
Show live preview
```

### 3. Code Editing Flow

```
User types in Monaco Editor
    ↓
Debounced save (1 second)
    ↓
Update file in WebContainer
    ↓
WebContainer triggers HMR
    ↓
Preview iframe auto-refreshes
    ↓
Save to database (background)
```

### 4. AI Completion Flow

```
User presses Ctrl+Space
    ↓
Get code context (current file)
    ↓
POST to /api/code-completion
    ↓
Forward to Ollama (local LLM)
    ↓
Generate code suggestion
    ↓
Display as ghost text in Monaco
    ↓
User presses Tab to accept
    ↓
Insert completion
```

---

## 📦 Technology Stack Summary

| Category | Technology | Why? |
|----------|-----------|------|
| **Framework** | Next.js 15 | Full-stack React framework with SSR |
| **Language** | TypeScript | Type safety across entire stack |
| **UI Library** | React 18 | Component-based UI |
| **Styling** | TailwindCSS | Utility-first CSS |
| **Components** | ShadCN UI | Beautiful, accessible components |
| **State** | Zustand | Lightweight state management |
| **Database** | MongoDB | NoSQL for flexible schema |
| **ORM** | Prisma | Type-safe database client |
| **Auth** | NextAuth v5 | OAuth 2.0 authentication |
| **Editor** | Monaco | VSCode editor in browser |
| **Terminal** | xterm.js | Terminal emulator |
| **Runtime** | WebContainers | Node.js in browser (WASM) |
| **AI** | Ollama | Local LLM for code suggestions |

---

## 🔐 Security Features

### Authentication
- ✅ OAuth 2.0 (Google, GitHub)
- ✅ JWT session tokens
- ✅ HTTP-only cookies
- ✅ CSRF protection
- ✅ Secure flag in production

### Authorization
- ✅ Server-side session validation
- ✅ User ownership checks
- ✅ Protected API routes
- ✅ Middleware route protection

### Data Security
- ✅ Prisma parameterized queries (SQL injection prevention)
- ✅ Input validation (Zod schemas)
- ✅ XSS prevention (React auto-escaping)
- ✅ CORS configuration

### Code Execution
- ✅ Sandboxed iframe (restricted permissions)
- ✅ WebContainer isolation
- ✅ No arbitrary code on server
- ✅ Rate limiting on AI endpoints

---

## 📈 Performance Optimizations

### Frontend
- ✅ Code splitting (dynamic imports)
- ✅ Lazy loading heavy components
- ✅ Image optimization (Next.js Image)
- ✅ Font optimization
- ✅ Tree shaking

### Backend
- ✅ Database indexing
- ✅ API response caching
- ✅ Static page generation
- ✅ Edge runtime for APIs

### Playground
- ✅ Debounced file saves
- ✅ Virtual scrolling (file tree)
- ✅ WebContainer boot on demand
- ✅ Service worker caching

---

## 🎯 User Flows

### First-Time User

```
1. Visit homepage
2. Click "Get Started"
3. Login with Google/GitHub
4. Redirected to Dashboard
5. See "Create your first project" prompt
6. Click "New Project"
7. Choose React template
8. Playground loads
9. Edit code, see live preview
10. Auto-saved to account
```

### Returning User

```
1. Visit site (auto-login if session valid)
2. Dashboard shows existing projects
3. Click project to open
4. Continue coding
5. Use AI assistance (Ctrl+Space)
6. Share project (copy link)
```

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Component tests (React Testing Library)
test('Button renders correctly', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})

// Function tests (Jest)
test('createPlayground validates input', async () => {
  await expect(createPlayground({ title: '' }))
    .rejects.toThrow('Title required')
})
```

### Integration Tests
```typescript
// API route tests
test('POST /api/template/:id saves files', async () => {
  const response = await fetch('/api/template/123', {
    method: 'POST',
    body: JSON.stringify({ content: {...} })
  })
  expect(response.status).toBe(200)
})
```

### E2E Tests (Playwright)
```typescript
test('User can create and run project', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Get Started')
  // ... login flow
  await page.click('text=New Project')
  await page.click('text=React')
  await expect(page.locator('iframe')).toBeVisible()
})
```

---

## 🚧 Future Enhancements

### Phase 1 (MVP) ✅
- ✅ OAuth authentication
- ✅ Project CRUD
- ✅ Monaco editor
- ✅ WebContainers integration
- ✅ Basic AI completion
- ✅ 6 project templates

### Phase 2 (Enhanced)
- [ ] Real-time collaboration (multiplayer)
- [ ] Git integration (commit, push, pull)
- [ ] Package search & install UI
- [ ] Advanced AI chat (context-aware)
- [ ] Debugging tools
- [ ] Extensions marketplace

### Phase 3 (Advanced)
- [ ] Custom domains for projects
- [ ] Deployment integration (Vercel, Netlify)
- [ ] Team workspaces
- [ ] Code reviews & comments
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

---

## 📝 Quick Start Checklist

### Development Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd codeditor

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Setup database
npx prisma generate
npx prisma db push

# 5. Start Ollama (for AI features)
ollama run codellama

# 6. Start development server
npm run dev

# 7. Open browser
# http://localhost:3000
```

### Environment Variables Required

```env
# Authentication
AUTH_SECRET=<random-string>
AUTH_GOOGLE_ID=<google-oauth-client-id>
AUTH_GOOGLE_SECRET=<google-oauth-secret>
AUTH_GITHUB_ID=<github-oauth-client-id>
AUTH_GITHUB_SECRET=<github-oauth-secret>

# Database
DATABASE_URL=<mongodb-connection-string>

# App
NEXTAUTH_URL=http://localhost:3000
```

---

## 🆘 Troubleshooting

### Common Issues

**WebContainer not loading**
```
Error: SharedArrayBuffer is not defined

Solution:
- Ensure headers are set in next.config.ts:
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
```

**OAuth redirect error**
```
Error: Redirect URI mismatch

Solution:
- Add http://localhost:3000/api/auth/callback/google
  to Google Cloud Console OAuth settings
```

**Prisma client not found**
```
Error: Cannot find module '.prisma/client'

Solution:
- Run: npx prisma generate
```

**Ollama connection failed**
```
Error: Failed to fetch code completion

Solution:
- Start Ollama: ollama serve
- Run model: ollama run codellama
```

---

## 📞 Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [WebContainers API](https://webcontainers.io/api)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/api)
- [ShadCN UI](https://ui.shadcn.com)

### Community
- GitHub Issues: Report bugs
- Discord: Join community
- Twitter: Follow updates

---

## 📄 License

MIT License - See LICENSE file for details

---

**Document Version**: 1.0  
**Last Updated**: February 9, 2026  
**Project**: Vibe Code Editor  
**Status**: Production Ready
