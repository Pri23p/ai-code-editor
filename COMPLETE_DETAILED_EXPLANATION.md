# 🎓 VIBE CODE EDITOR - COMPLETE DETAILED EXPLANATION

## Master Guide - Understanding Every Component, Feature & Concept

---

## 📑 Table of Contents
1. [Project Understanding](#project-understanding)
2. [Every Component Explained](#every-component-explained)
3. [Every Hook Explained](#every-hook-explained)
4. [Every API Endpoint Explained](#every-api-endpoint-explained)
5. [Database Models Explained](#database-models-explained)
6. [State Management Stores](#state-management-stores)
7. [Authentication System](#authentication-system)
8. [File Management System](#file-management-system)
9. [Code Execution in Browser](#code-execution-in-browser)
10. [AI Features](#ai-features)
11. [UI/UX Components](#uiux-components)
12. [Development Tools](#development-tools)

---

# PROJECT UNDERSTANDING

## What is Vibe Code Editor?

### Simple Explanation
A **web-based IDE** (Integrated Development Environment) where developers can:
- Write code inside a web browser
- Run code instantly (no setup needed)
- Get AI help while coding
- Save projects to account
- Execute projects with preview

### Real-World Analogy
```
Regular IDE (VS Code):
├─ Install on computer
├─ Takes 2GB space
├─ Local execution
└─ Access only on that machine

Vibe Code Editor:
├─ Open in any browser anytime
├─ No installation needed
├─ Cloud storage (MongoDB)
├─ Access from any device
└─ Instant code execution
```

### Core Problem Solved
```
❌ BEFORE: Developers need setup
  - Install Node.js
  - Install npm/yarn
  - Install VS Code
  - Setup environment
  - Install project dependencies
  → Takes 30+ minutes!

✅ AFTER: Click one button
  - Go to https://vibecode.app
  - Login with Google/GitHub
  - Start coding immediately
  → Takes 2 seconds!
```

---

# EVERY COMPONENT EXPLAINED

## Page Components (Highest Level)

### 1. Home Page - `app/(root)/page.tsx`

**What does it do?**
This is the first page users see when they visit the app. It's the landing page.

**Visual Layout:**
```
┌─────────────────────────────────────┐
│  Header with Logo                    │
├─────────────────────────────────────┤
│                                     │
│  Big Hero Section Image             │
│  "Vibe Code With Intelligence"      │
│                                     │
│  Description text                   │
│                                     │
│  [Get Started] Button               │
│                                     │
└─────────────────────────────────────┘
```

**Code Breakdown:**
```typescript
// app/(root)/page.tsx
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      
      {/* Hero Image Section */}
      <Image 
        src="/hero.svg"           // Path to hero image
        alt="Hero-Section"
        height={500}
        width={500}
      />

      {/* Main Heading */}
      <h1 className="text-6xl font-extrabold bg-gradient-to-r from-rose-500 to-pink-500">
        Vibe Code With Intelligence
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-600 max-w-2xl">
        VibeCode Editor is a powerful code editor with advanced features
      </p>

      {/* Call-to-Action Button */}
      <Link href="/dashboard">
        <Button variant="brand" size="lg">
          Get Started
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </div>
  );
}
```

**Why separate routes?**
```
(root) = Public area
  ├─ / (home page)
  ├─ /auth/sign-in (login)
  └─ Anyone can see

(auth) = Auth-specific
  └─ /auth/* (protected)

dashboard/ = User area
  └─ /dashboard (projects list)

playground/ = Editor
  └─ /playground/[id] (code editor)
```

---

### 2. Dashboard Page - `app/dashboard/page.tsx`

**What does it do?**
Shows the user's projects, allows creating new ones, and managing existing projects.

**Visual Layout:**
```
┌────────────────────────────────────────────────────┐
│  [New Project]         [Import from GitHub]        │
├────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐               │
│  │ Project 1    │  │ Project 2    │               │
│  │ React App    │  │ Express API  │               │
│  │ ⭐ ✏️ 🗑️    │  │ ⭐ ✏️ 🗑️    │               │
│  └──────────────┘  └──────────────┘               │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐               │
│  │ Project 3    │  │ Project 4    │               │
│  │ Next.js App  │  │ Vue Project  │               │
│  │ ⭐ ✏️ 🗑️    │  │ ⭐ ✏️ 🗑️    │               │
│  └──────────────┘  └──────────────┘               │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Code Breakdown:**
```typescript
// app/dashboard/page.tsx
const Page = async () => {
  // 1. Get current user's playgrounds
  const playgrounds = await getAllPlaygroundForUser();

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Top Section: Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Button 1: Create new project */}
        <AddNewButton />
        
        {/* Button 2: Import from GitHub */}
        <AddRepo />
      </div>

      {/* Main Section: Display projects */}
      <div className="mt-10 flex flex-col w-full">
        {/* If no projects, show empty state */}
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState />
        ) : (
          /* Show projects in table */
          <ProjectTable
            projects={playgrounds || []}
            onDeleteProject={deleteProjectById}
            onEditProject={editProjectById}
            onDuplicateProject={duplicateProjectById}
          />
        )}
      </div>
    </div>
  );
};
```

**Key Functions Used:**
```typescript
// 1. Get all playgrounds for current user
const playgrounds = await getAllPlaygroundForUser();
// Returns: Array of user's projects

// 2. Actions available on each project:
deleteProjectById(id)        // Delete project forever
editProjectById(id, data)    // Update name/description
duplicateProjectById(id)     // Clone project
toggleStarMark(id)          // Mark as favorite
```

---

### 3. Playground Page - `app/playground/[id]/page.tsx`

**What does it do?**
This is the **MAIN editor**. Where users code, see preview, and run code.

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Project Name | 3 Files Open | Save All | Settings  │
├──────────────┬──────────────────────────┬──────────────────┤
│              │ file1.tsx                │                  │
│  FILE TREE   │ file2.jsx (active) ✏️   │  AI CHAT SIDEBAR │
│              │ file3.ts                 │                  │
│  ├─src       │                          │  💬 Chat History │
│  │ ├─App     │  CODE EDITOR             │  💬 Chat Message │
│  │ │ (Monaco)                           │  💬 Chat Message │
│  │ └─Main    │  import React from ...   │                  │
│  │           │  export default function │ ┌──────────────┐│
│  └─public    │                          │ │  Type here...││
│    └─index   │                          │ └──────────────┘│
│              │                          │                  │
├──────────────┼──────────────────────────┼──────────────────┤
│              │      PREVIEW              │                  │
│   TERMINAL   │    (Live Browser)         │   (If visible)   │
│              │   http://localhost:5173   │                  │
│   $ npm run  │                          │                  │
│   dev        │  [App loads here]        │                  │
└──────────────┴──────────────────────────┴──────────────────┘
```

**Code Breakdown:**
```typescript
// app/playground/[id]/page.tsx - Main Editor Component

const MainPlaygroundPage = () => {
  // 1. Get playground ID from URL
  const { id } = useParams<{ id: string }>();

  // 2. Fetch all data for this playground
  const { playgroundData, templateData, saveTemplateData } = usePlayground(id);

  // 3. Get state management
  const {
    openFiles,           // Array of open file tabs
    activeFileId,        // Which file tab is selected
    editorContent,       // Text in Monaco editor
    updateFileContent,   // Function to update editor text
    handleAddFile,       // Add new file
    handleDeleteFile,    // Delete file
  } = useFileExplorer();

  // 4. Get WebContainer for code execution
  const { instance, serverUrl } = useWebContainer({ templateData });

  // 5. Render the complex layout
  return (
    <>
      {/* HEADER */}
      <header>
        <h1>{playgroundData?.title}</h1>
        <span>{openFiles.length} File(s) Open</span>
        
        {/* Save buttons */}
        <Button onClick={() => handleSave()}>Save</Button>
        <Button onClick={() => handleSaveAll()}>Save All</Button>
        
        {/* AI Toggle */}
        <ToggleAI isEnabled={aiEnabled} onToggle={toggleAI} />
        
        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger>Settings</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={closeAllFiles}>
              Close All Files
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="h-[calc(100vh-4rem)] flex">
        
        {/* LEFT SIDEBAR: FILE EXPLORER */}
        <TemplateFileTree
          data={templateData}
          onFileSelect={openFile}
          onAddFile={handleAddFile}
          onDeleteFile={handleDeleteFile}
          onRenameFile={handleRenameFile}
        />

        {/* MIDDLE: EDITOR SECTION */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          <div className="border-b">
            <Tabs value={activeFileId} onChange={setActiveFileId}>
              {openFiles.map(file => (
                <TabsTrigger key={file.id} value={file.id}>
                  {file.filename}.{file.fileExtension}
                  {file.hasUnsavedChanges && <UnsavedDot />}
                </TabsTrigger>
              ))}
            </Tabs>
          </div>

          {/* Editor Split: Code + Preview */}
          <ResizablePanelGroup direction="horizontal">
            
            {/* LEFT PANEL: Monaco Editor */}
            <ResizablePanel>
              <PlaygroundEditor
                activeFile={activeFile}
                content={editorContent}
                onContentChange={updateFileContent}
                suggestion={suggestion}
                onAcceptSuggestion={acceptSuggestion}
              />
            </ResizablePanel>

            {/* RIGHT PANEL: Preview */}
            {isPreviewVisible && (
              <ResizablePanel>
                <WebContainerPreview>
                  <iframe src={serverUrl} />
                  {/* Terminal inside */}
                  <Terminal instance={instance} />
                </WebContainerPreview>
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
        </div>

        {/* RIGHT SIDEBAR: AI CHAT */}
        <AIChatSidebar />
      </div>
    </>
  );
};
```

**Complex Features Combined:**
```
1. File Management
   └─ Open/close files
   └─ Create/delete/rename files and folders 
   └─ Track unsaved changes

2. Code Editing
   └─ Monaco editor with syntax highlighting
   └─ Real-time content updates
   └─ AI suggestions on Ctrl+Space

3. Code Execution
   └─ WebContainer runs code
   └─ Dev server (Vite/Next.js) starts automatically
   └─ Live preview updates as code changes

4. Terminal
   └─ Run npm commands
   └─ View server logs
   └─ Execute shell commands

5. AI Chat
   └─ Ask questions about code
   └─ Get suggestions
   └─ Share files with AI
```

---

## UI Components (Medium Level)

### PlaygroundEditor Component
**File:** `modules/playground/components/playground-editor.tsx`

**What does it do?**
Wraps Monaco Editor, adds AI suggestions, handles keyboard shortcuts.

**How it works:**
```typescript
export const PlaygroundEditor = ({
  activeFile,           // Currently selected file
  content,              // File content string
  onContentChange,      // Callback when user types
  suggestion,           // AI suggestion text
  suggestionLoading,    // Is fetching suggestion?
  suggestionPosition,   // Where to show suggestion
  onAcceptSuggestion,   // User pressed Tab
  onRejectSuggestion,   // User pressed Esc
  onTriggerSuggestion,  // User pressed Ctrl+Space
}) => {
  const editorRef = useRef();
  const monacoRef = useRef();

  return (
    <Editor
      language={detectLanguage(activeFile?.fileExtension)}
      value={content}
      onChange={(value) => onContentChange(value || "")}
      onMount={(editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        
        // Setup keybindings
        setupKeybindings(editor, monaco);
      }}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        formatOnSave: true,
        autoClosingBrackets: "always",
      }}
    />
  );
};
```

---

### TemplateFileTree Component
**File:** `modules/playground/components/playground-explorer.tsx`

**What does it do?**
Shows file/folder tree, allows CRUD operations on files.

**Features:**
```typescript
export function TemplateFileTree({
  data,              // File tree structure
  onFileSelect,      // User clicks file
  onAddFile,         // User creates file
  onDelete,          // User deletes
  onRename,          // User renames
}) {
  // Render tree recursively
  // Show icons for files/folders
  // Hover shows action buttons
  // Right-click context menu
  // Drag to reorder (future)
}

// Example usage in tree rendering:
<div className="ml-4">
  {folder.items.map((item) => (
    <TemplateNode key={item.id} item={item} />
  ))}
</div>
```

---

### WebContainerPreview Component
**File:** `modules/webcontainers/components/webcontainer-preview.tsx`

**What does it do?**
Shows live preview of running code and terminal output.

```typescript
export const WebContainerPreview = () => {
  // 1. Get WebContainer instance
  const { serverUrl, instance } = useWebContainer();

  // 2. Render iframe for preview
  return (
    <div className="h-full flex flex-col">
      {/* Browser preview */}
      {serverUrl && (
        <iframe 
          src={serverUrl}
          className="flex-1"
          sandbox="allow-same-origin allow-scripts"
        />
      )}

      {/* Terminal */}
      <Terminal instance={instance} />
    </div>
  );
};
```

---

### Terminal Component
**File:** `modules/webcontainers/components/terminal.tsx`

**What does it do?**
Interactive shell inside browser using xterm.js

```typescript
export const Terminal = ({ instance }) => {
  useEffect(() => {
    // 1. Create terminal UI
    const term = new Terminal({
      cols: 80,
      rows: 24,
      fontSize: 12,
      fontFamily: "Geist Mono",
    });

    // 2. Render to DOM
    term.open(document.getElementById("terminal"));

    // 3. Create bash process
    const shellProcess = await instance.spawn("bash", []);

    // 4. Connect input
    term.onData((data) => {
      shellProcess.input.write(data);
    });

    // 5. Connect output
    shellProcess.output.pipeTo(
      new WritableStream({
        write(chunk) {
          term.write(chunk);
        },
      })
    );
  }, [instance]);

  return <div id="terminal" className="h-full bg-black" />;
};
```

**What can user do?**
```bash
$ npm run dev              # Start dev server
$ npm install package-name # Install packages
$ npm run build            # Build project
$ ls -la                   # List files
$ cd src                   # Change directory
$ cat App.tsx             # View file
$ node script.js          # Run JavaScript
$ python script.py        # Run Python
# Full bash shell!
```

---

# EVERY HOOK EXPLAINED

## State Management Hooks (Zustand)

### 1. useFileExplorer Hook
**File:** `modules/playground/hooks/useFileExplorer.tsx`

**Purpose:** Manage all file-related state (open files, active file, etc.)

```typescript
// What data it stores
interface FileExplorerState {
  templateData: TemplateFolder | null;    // File tree
  openFiles: OpenFile[];                  // Open tabs
  activeFileId: string | null;            // Selected tab
  editorContent: string;                  // Monaco editor text
}

// How to use it
function MyComponent() {
  const { openFiles, activeFileId } = useFileExplorer();
  // Now I have access to state

  const { openFile, closeFile } = useFileExplorer();
  // Now I can call actions

  // When state changes, component re-renders automatically
}
```

**All Available Actions:**
```typescript
const store = useFileExplorer();

// ===== File Operations =====
store.openFile(file)              // Add file to tabs
store.closeFile(fileId)           // Remove from tabs
store.closeAllFiles()             // Clear all tabs

// ===== Content Operations =====
store.updateFileContent(id, text) // Change file content
store.setEditorContent(text)      // Change Monaco display

// ===== Folder Operations =====
store.handleAddFile(file, path)   // Create file
store.handleDeleteFile(file, path) // Delete file
store.handleRenameFile(...)       // Rename file
store.handleAddFolder(folder, path) // Create folder
store.handleDeleteFolder(...)     // Delete folder
store.handleRenameFolder(...)     // Rename folder

// ===== Getter Operations =====
store.setTemplateData(data)       // Set file tree
store.setPlaygroundId(id)         // Set project ID
store.setOpenFiles(files)         // Set open tabs
store.setActiveFileId(id)         // Set active tab
```

---

### 2. usePlayground Hook
**File:** `modules/playground/hooks/usePlayground.tsx`

**Purpose:** Fetch and manage playground data from database

```typescript
export const usePlayground = (id: string) => {
  const [playgroundData, setPlaygroundData] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlayground = async () => {
      try {
        // 1. Fetch playground from database
        const data = await getPlaygroundById(id);
        setPlaygroundData(data);

        // 2. Parse template files (JSON → object)
        const template = JSON.parse(data.templateFiles[0].content);
        setTemplateData(template);

        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadPlayground();
  }, [id]);

  // When user saves, call this
  const saveTemplateData = async (updatedTemplate) => {
    await SaveUpdatedCode(id, updatedTemplate);
  };

  return { playgroundData, templateData, isLoading, error, saveTemplateData };
};
```

**Flow:**
```
1. Component mounts
2. loadPlayground() called
3. Fetch from /api/template/[id]
4. Database returns playground data
5. Parse JSON file tree
6. Update state
7. Component re-renders
8. User starts editing
```

---

### 3. useAISuggestions Hook
**File:** `modules/playground/hooks/useAISuggestion.tsx`

**Purpose:** Manage AI code suggestions

```typescript
export const useAISuggestions = () => {
  const [state, setState] = useState({
    suggestion: null,           // "const x = 5"
    isLoading: false,           // Fetching?
    position: null,             // { line: 10, column: 5 }
    isEnabled: true,            // Feature on/off
    decoration: [],             // Monaco decorations
  });

  // 1. Ask for suggestion
  const fetchSuggestion = async (type, editor) => {
    const model = editor.getModel();
    const cursor = editor.getPosition();

    // Get code context
    const fileContent = model.getValue();
    const payload = {
      fileContent,
      cursorLine: cursor.lineNumber - 1,
      cursorColumn: cursor.column - 1,
      suggestionType: type,  // "completion" or "generation"
    };

    // Call AI API
    const response = await fetch("/api/code-completion", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Show suggestion
    setState(prev => ({
      ...prev,
      suggestion: data.suggestion,
      position: cursor,
      isLoading: false,
    }));
  };

  // 2. User accepts (press Tab)
  const acceptSuggestion = (editor, monaco) => {
    if (!state.suggestion) return;

    // Insert text at cursor
    editor.executeEdits("ai", [
      {
        range: new monaco.Range(
          state.position.line,
          state.position.column,
          state.position.line,
          state.position.column
        ),
        text: state.suggestion,
      },
    ]);

    // Clear suggestion
    clearSuggestion();
  };

  // 3. User rejects (press Esc)
  const rejectSuggestion = () => {
    clearSuggestion();
  };

  return {
    suggestion: state.suggestion,
    isLoading: state.isLoading,
    position: state.position,
    isEnabled: state.isEnabled,
    fetchSuggestion,
    acceptSuggestion,
    rejectSuggestion,
    toggleEnabled: () => setState(s => ({ ...s, isEnabled: !s.isEnabled })),
  };
};
```

---

### 4. useWebContainer Hook
**File:** `modules/webcontainers/hooks/useWebContainer.tsx`

**Purpose:** Initialize and manage WebContainer runtime

```typescript
export const useWebContainer = ({ templateData }) => {
  const [instance, setInstance] = useState(null);
  const [serverUrl, setServerUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initContainer = async () => {
      try {
        // 1. Boot WebContainer (downloads WASM)
        console.log("Booting WebContainer...");
        const container = await WebContainer.boot();
        setInstance(container);

        // 2. Write files to container filesystem
        console.log("Writing files...");
        await writeFilesToContainer(container, templateData);

        // 3. Install dependencies
        console.log("Installing dependencies...");
        const npm = await container.spawn("npm", ["install"]);
        const exitCode = await npm.exit;
        if (exitCode !== 0) throw new Error("npm install failed");

        // 4. Start dev server
        console.log("Starting dev server...");
        const devServer = await container.spawn("npm", ["run", "dev"]);

        // 5. Capture server URL
        for await (const chunk of devServer.output) {
          const match = chunk.match(/http:\/\/localhost:\d+/);
          if (match) {
            setServerUrl(match[0]);
            break;
          }
        }

        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    initContainer();
  }, [templateData]);

  const writeFileSync = async (filePath, content) => {
    if (!instance) return;
    // Create directories if needed
    const dir = filePath.split("/").slice(0, -1).join("/");
    await instance.fs.mkdir(dir, { recursive: true });
    // Write file
    await instance.fs.writeFile(filePath, content);
  };

  return { instance, serverUrl, isLoading, error, writeFileSync };
};
```

---

# EVERY API ENDPOINT EXPLAINED

### 1. POST /api/auth/[...nextauth]

**Purpose:** Handle OAuth authentication

```typescript
// app/api/auth/[...nextauth]/route.ts
export const { GET, POST } = handlers;

// Handles:
// 1. OAuth token exchange
// 2. User signup/login
// 3. Session management
// 4. Token refresh
```

**Flow:**
```
1. User clicks "Sign in with Google"
   ↓
2. Browser redirects to Google OAuth
   ↓
3. User grants permission
   ↓
4. Google redirects to /api/auth/callback/google?code=xyz
   ↓
5. Exchange code for tokens:
   POST https://oauth2.googleapis.com/token
   └─ Returns: access_token, id_token
   ↓
6. Extract user info from id_token
   {
     sub: "1234567890",      // Google ID
     name: "John Doe",
     email: "john@gmail.com",
     picture: "..."
   }
   ↓
7. Call signIn() callback in auth.ts
   ├─ Check if user exists in DB
   ├─ If not → Create new user
   ├─ If yes → Link account
   └─ Return true
   ↓
8. Create JWT token
   {
     sub: "user_db_id",
     name: "John Doe",
     email: "john@gmail.com",
     role: "USER"
   }
   ↓
9. Set httpOnly cookie with JWT
   ↓
10. Redirect to /dashboard
```

---

### 2. POST /api/code-completion

**Purpose:** Get AI code suggestions

**Request:**
```json
{
  "fileContent": "const handleClick = () => {",
  "cursorLine": 0,
  "cursorColumn": 27,
  "suggestionType": "completion",
  "fileName": "App.tsx"
}
```

**Response:**
```json
{
  "suggestion": "\n  console.log('clicked');\n}",
  "context": {
    "language": "typescript",
    "framework": "react",
    "position": { "line": 1, "column": 2 },
    "isInFunction": true,
    "isInClass": false
  }
}
```

**How it works:**
```typescript
// app/api/code-completion/route.ts

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { fileContent, cursorLine, cursorColumn, suggestionType } = body;

  // 1. Analyze code context
  const context = analyzeCodeContext(fileContent, cursorLine, cursorColumn);
  console.log("Context:", context);
  // {
  //   language: "typescript",
  //   framework: "react",
  //   beforeContext: "const handleClick = () => {",
  //   currentLine: "",
  //   afterContext: "",
  //   isInFunction: true
  // }

  // 2. Build a smart prompt
  const prompt = `
You are a code completion assistant for ${context.language} in ${context.framework}.

Current code:
${context.beforeContext}
[CURSOR_HERE]
${context.afterContext}

Generate ONE suggestion to complete the code. 
Only return the code, no explanations.
Max 3 lines.`;

  // 3. Call Ollama (local LLM)
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: "codellama:latest",    // Code-specific model
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,           // 0-1: 0=predictable, 1=creative
        num_predict: 100,           // Max tokens
        top_p: 0.9,                // Diversity
      },
    }),
  });

  const data = await response.json();

  // 4. Return suggestion
  return NextResponse.json({
    suggestion: data.response,
    context,
    metadata: { generatedAt: new Date() },
  });
}
```

---

### 3. POST /api/chat

**Purpose:** AI chat for code help

**Request:**
```json
{
  "message": "How do I create a React component?",
  "history": [
    { "role": "user", "content": "Help with React" },
    { "role": "assistant", "content": "Sure! ..." }
  ]
}
```

**Response:**
```json
{
  "response": "To create a React component, you can use..."
}
```

**Code:**
```typescript
// app/api/chat/route.ts

async function generateAIResponse(messages: ChatMessage[]): Promise<string> {
  // Build conversation
  const fullMessages = [
    { role: "system", content: "You are helpful..." },
    ...messages,
  ];

  // Send to Ollama
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: "codellama:latest",
      prompt: formatMessages(fullMessages),
      stream: false,
    }),
  });

  const data = await response.json();
  return data.response.trim();
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message, history } = body;

  // Validate
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  // Generate response
  const response = await generateAIResponse([...history, { role: "user", content: message }]);

  return NextResponse.json({ response });
}
```

---

### 4. GET /api/template/[id]

**Purpose:** Load template file structure

**Response:**
```json
{
  "success": true,
  "templateJson": {
    "items": [
      {
        "folderName": "src",
        "items": [
          {
            "filename": "App",
            "fileExtension": "tsx",
            "content": "export default..."
          },
          {
            "filename": "index",
            "fileExtension": "css",
            "content": "body { ... }"
          }
        ]
      }
    ]
  }
}
```

**Code:**
```typescript
// app/api/template/[id]/route.ts

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  // 1. Find playground in database
  const playground = await db.playground.findUnique({
    where: { id },
  });

  if (!playground) {
    return Response.json({ error: "Playground not found" }, { status: 404 });
  }

  // 2. Get template path (based on template type)
  const templateKey = playground.template; // "REACT", "NEXTJS", etc.
  const templatePath = templatePaths[templateKey];

  if (!templatePath) {
    return Response.json({ error: "Invalid template" }, { status: 404 });
  }

  // 3. Convert file system to JSON
  const inputPath = path.join(process.cwd(), templatePath);
  const result = await readTemplateStructureFromJson(inputPath);

  // 4. Validate JSON
  if (!validateJsonStructure(result)) {
    return Response.json({ error: "Invalid JSON structure" }, { status: 500 });
  }

  // 5. Return to client
  return Response.json({ success: true, templateJson: result });
}
```

---

# DATABASE MODELS EXPLAINED

### Overview of All Models

```
User
├─ Has many Accounts (OAuth)
├─ Has many Playgrounds (Projects)
├─ Has many StarMarks (Favorites)
└─ Has many ChatMessages (Chat history)

Account
├─ Belongs to User
└─ Stores OAuth tokens

Playground
├─ Belongs to User
├─ Has one TemplateFile
├─ Has many StarMarks
└─ Stores project metadata

TemplateFile
├─ Belongs to Playground
└─ Stores file tree as JSON

StarMark
├─ Belongs to User
├─ Belongs to Playground
└─ Tracks favorites

ChatMessage
├─ Belongs to User
└─ Stores message history
```

---

### 1. User Model

```prisma
model User {
  id              String    @id @default(cuid())     // Unique ID
  name            String?                            // User's name
  email           String    @unique                  // Email (must be unique)
  image           String?                            // Profile picture URL
  role            UserRole  @default(USER)           // USER, ADMIN, PREMIUM_USER
  
  // Relations
  accounts        Account[]                          // OAuth accounts
  myPlayground    Playground[]                       // User's projects
  staredPlayground StarMark[]                         // Favorites list
  chatMessages    ChatMessage[]                      // Chat history
  
  // Timestamps
  createdAt       DateTime  @default(now())          // When created
  updatedAt       DateTime  @updatedAt               // Last updated
}

enum UserRole {
  ADMIN          // Full access, manage other users
  USER           // Normal access
  PREMIUM_USER   // Premium features (future)
}
```

**Why these fields?**
- `id`: Every user needs unique identifier
- `email`: Used for login, must be unique
- `role`: Support different permission levels
- Relations: Connect to other data
- Timestamps: Track when data was created/updated

---

### 2. Account Model

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")         // Foreign key to User
  type              String                           // "oauth", "email", etc.
  provider          String                           // "google", "github"
  providerAccountId String                           // ID from OAuth provider
  
  // OAuth tokens
  refreshToken      String? @map("refresh_token")   // Renew access token
  accessToken       String? @map("access_token")    // Use immediately
  expiresAt         Int?    @map("expires_at")      // Token expiration timestamp
  tokenType         String? @map("token_type")      // "Bearer", etc.
  scope             String?                         // "email", "profile", etc.
  idToken           String? @map("id_token")        // Identity token
  sessionState      String? @map("session_state")   // OAuth state parameter
  
  // Relation
  user              User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Constraints
  @@unique([provider, providerAccountId])           // Each provider once per user
  @@index([userId])                                 // Quick lookup by user
}
```

**Why separate Account model?**
```
One user can have multiple accounts:
├─ Google OAuth (john@gmail.com)
├─ GitHub OAuth (john-dev)
└─ Future: Email/password

This model links them together and stores tokens.
```

---

### 3. Playground Model

```prisma
enum Templates {
  REACT      // React + Vite
  NEXTJS     // Next.js full-stack
  EXPRESS    // Express.js backend
  VUE        // Vue framework
  HONO       // Hono lightweight framework
  ANGULAR    // Angular framework
}

model Playground {
  id              String      @id @default(cuid())
  title           String                             // Project name
  description     String?                            // Project description
  template        Templates   @default(REACT)        // Framework chosen
  slug            String?                            // URL-friendly name (future)
  
  // Relations
  userId          String                             // Project owner
  user            User @relation(fields: [userId], references: [id], onDelete: Cascade)
  Starmark        StarMark[]                          // Favorited by users
  templateFiles   TemplateFile[]                      // File structure
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

**Flow when creating project:**
```
1. User clicks "New Project"
2. Dialog appears with template choices
3. User selects "React" template
4. User enters title: "My App"
5. System creates Playground record:
   {
     id: "uid_123",
     title: "My App",
     template: "REACT",
     userId: "user_456",
     createdAt: now()
   }
6. Fetch template files for React
7. Create TemplateFile with default files
8. Redirect to /playground/uid_123
```

---

### 4. TemplateFile Model

```prisma
model TemplateFile {
  id            String  @id @default(cuid())
  content       Json                                 // File tree as JSON
  playgroundId  String  @unique                      // 1-to-1 with Playground
  
  // Relation
  playground    Playground @relation(fields: [playgroundId], references: [id], onDelete: Cascade)
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**Why Json field?**
```
Normal approach:
├─ File table (id, filename, content, playgroundId)
└─ Problem: Nested folders need recursive queries

Better approach (used):
├─ TemplateFile stores entire tree as JSON
└─ Advantage: Single query gets everything

Example content:
{
  "folderName": "root",
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
```

---

### 5. StarMark Model

```prisma
model StarMark {
  id           String  @id @default(cuid())
  userId       String
  playgroundId String
  isMarked     Boolean                               // true = favorited
  
  // Relations
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  playground   Playground @relation(fields: [playgroundId], references: [id], onDelete: Cascade)
  
  // Constraints
  @@unique([userId, playgroundId])                  // Can't star same project twice
  createdAt    DateTime @default(now())
}
```

**How favorites work:**
```
1. User clicks star icon on project
2. Check if StarMark exists for this user+project
3. If not exists:
   └─ Create: { userId, playgroundId, isMarked: true }
4. If exists:
   └─ Toggle isMarked: true ↔ false
5. Star icon fills/unfills based on state
6. Show starred projects first in dashboard
```

---

### 6. ChatMessage Model

```prisma
model ChatMessage {
  id       String @id @default(cuid())
  userId   String
  role     String                                   // "user" or "assistant"
  content  String                                  // Message text
  
  // Relation
  user     User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Timestamps
  @@index([userId])                                // Quick lookup by user
  createdAt DateTime @default(now())
}
```

**Chat history:**
```
When user sends message:
1. Create ChatMessage:
   { userId: "123", role: "user", content: "How to use React?" }

2. Get AI response

3. Create ChatMessage:
   { userId: "123", role: "assistant", content: "React is..." }

4. Next time user opens chat:
   - Load all messages for this user
   - Show conversation history
   - Allow to continue chatting
```

---

# STATE MANAGEMENT STORES

## Complete Zustand Store Pattern

```typescript
import { create } from "zustand";

// Step 1: Define types
interface MyStore {
  // State
  count: number;
  message: string;
  
  // Actions
  increment: () => void;
  setMessage: (msg: string) => void;
}

// Step 2: Create store
export const useMyStore = create<MyStore>((set, get) => ({
  // Initial state
  count: 0,
  message: "Hello",

  // Actions
  increment: () => set(state => ({ count: state.count + 1 })),
  
  setMessage: (msg: string) => set({ message: msg }),
}));

// Step 3: Use in components
function Component() {
  const { count, message } = useMyStore();
  const { increment, setMessage } = useMyStore();

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </>
  );
}
```

## useFileExplorer Store - Complete

```typescript
import { create } from "zustand";

interface OpenFile extends TemplateFile {
  id: string;                      // Unique ID
  hasUnsavedChanges: boolean;      // Dirty flag
  originalContent: string;         // Last saved version
}

interface FileExplorerState {
  // ===== STATE =====
  templateData: TemplateFolder | null;
  playgroundId: string;
  openFiles: OpenFile[];
  activeFileId: string | null;
  editorContent: string;

  // ===== SETTERS =====
  setTemplateData: (data: TemplateFolder | null) => void;
  setPlaygroundId: (id: string) => void;
  setOpenFiles: (files: OpenFile[]) => void;
  setActiveFileId: (fileId: string | null) => void;
  setEditorContent: (content: string) => void;

  // ===== FILE OPERATIONS =====
  openFile: (file: TemplateFile) => void;
  closeFile: (fileId: string) => void;
  closeAllFiles: () => void;
  updateFileContent: (fileId: string, content: string) => void;

  // ===== FOLDER OPERATIONS =====
  handleAddFile: (file: TemplateFile, path: string, ...) => void;
  handleDeleteFile: (file: TemplateFile, path: string) => void;
  handleRenameFile: (...) => void;
  handleAddFolder: (folder: TemplateFolder, path: string, ...) => void;
  handleDeleteFolder: (folder: TemplateFolder, path: string) => void;
  handleRenameFolder: (...) => void;
}

export const useFileExplorer = create<FileExplorerState>((set, get) => ({
  // ===== INITIAL STATE =====
  templateData: null,
  playgroundId: "",
  openFiles: [],
  activeFileId: null,
  editorContent: "",

  // ===== SETTERS =====
  setTemplateData: (data) => set({ templateData: data }),
  setPlaygroundId: (id) => set({ playgroundId: id }),
  setOpenFiles: (files) => set({ openFiles: files }),
  setActiveFileId: (fileId) => set({ activeFileId: fileId }),
  setEditorContent: (content) => set({ editorContent: content }),

  // ===== OPEN FILE ACTION =====
  openFile: (file) => {
    const fileId = generateFileId(file, get().templateData!);
    const existing = get().openFiles.find(f => f.id === fileId);

    if (existing) {
      // File already open - just switch to it
      set({
        activeFileId: fileId,
        editorContent: existing.content,
      });
    } else {
      // New file - add to tabs
      const newOpenFile: OpenFile = {
        ...file,
        id: fileId,
        hasUnsavedChanges: false,
        content: file.content || "",
        originalContent: file.content || "",
      };

      set((state) => ({
        openFiles: [...state.openFiles, newOpenFile],
        activeFileId: fileId,
        editorContent: file.content || "",
      }));
    }
  },

  // ===== CLOSE FILE ACTION =====
  closeFile: (fileId) => {
    const { openFiles, activeFileId } = get();
    const newFiles = openFiles.filter((f) => f.id !== fileId);

    // If closing active file, switch to another
    let newActiveFileId = activeFileId;
    let newEditorContent = get().editorContent;

    if (activeFileId === fileId) {
      if (newFiles.length > 0) {
        const lastFile = newFiles[newFiles.length - 1];
        newActiveFileId = lastFile.id;
        newEditorContent = lastFile.content;
      } else {
        newActiveFileId = null;
        newEditorContent = "";
      }
    }

    set({
      openFiles: newFiles,
      activeFileId: newActiveFileId,
      editorContent: newEditorContent,
    });
  },

  // ===== CLOSE ALL FILES ACTION =====
  closeAllFiles: () => {
    set({
      openFiles: [],
      activeFileId: null,
      editorContent: "",
    });
  },

  // ===== UPDATE CONTENT ACTION =====
  updateFileContent: (fileId, content) => {
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
      editorContent:
        fileId === state.activeFileId ? content : state.editorContent,
    }));
  },

  // ===== ADD FILE ACTION =====
  handleAddFile: async (
    newFile,
    parentPath,
    writeFileSync,
    instance,
    saveTemplateData
  ) => {
    const { templateData } = get();
    if (!templateData) return;

    try {
      // 1. Create a deep copy
      const updated = JSON.parse(JSON.stringify(templateData));
      
      // 2. Navigate to parent folder
      const pathParts = parentPath.split("/").filter(Boolean);
      let current = updated;
      for (const part of pathParts) {
        const found = current.items.find(
          (i) => "folderName" in i && i.folderName === part
        );
        if (!found) return;
        current = found;
      }

      // 3. Add file to parent
      current.items.push(newFile);

      // 4. Update state
      set({ templateData: updated });

      // 5. Sync to WebContainer
      if (instance && writeFileSync) {
        const filePath = `${parentPath}/${newFile.filename}.${newFile.fileExtension}`;
        await writeFileSync(filePath, newFile.content || "");
      }

      // 6. Save to database
      await saveTemplateData(updated);
      
      toast.success("File created");
    } catch (error) {
      toast.error("Failed to create file");
    }
  },

  // ... Similar patterns for delete, rename, etc.
}));
```

---

# AUTHENTICATION SYSTEM

## Complete OAuth Flow

### Step 1: Initial Setup in `auth.ts`

```typescript
// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { auth, handlers, signIn, signOut } = NextAuth({
  // 1. Database adapter
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
    async signIn({ user, account, profile }) {
      // Callback 1: When user tries to sign in
      // Purpose: Create or link accounts
      
      if (!user || !account) return false;

      const existingUser = await db.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        // New user - create account
        await db.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,
            accounts: {
              create: {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refreshToken: account.refresh_token,
                accessToken: account.access_token,
                expiresAt: account.expires_at,
                tokenType: account.token_type,
              },
            },
          },
        });
      } else {
        // Existing user - link account if needed
        const existingAccount = await db.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        if (!existingAccount) {
          await db.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refreshToken: account.refresh_token,
              accessToken: account.access_token,
              expiresAt: account.expires_at,
              tokenType: account.token_type,
            },
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // Callback 2: Create or update JWT
      // Purpose: Add user data to token
      
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);
      if (!dbUser) return token;

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.role = dbUser.role;

      return token;
    },

    async session({ session, token }) {
      // Callback 3: Return session to client
      // Purpose: Attach token data to session
      
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }

      return session;
    },
  },

  // 4. JWT configuration
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
});
```

### Step 2: Route Protection in `middleware.ts`

```typescript
// middleware.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // 1. Check if API auth route (allow all)
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  if (isApiAuthRoute) return null;

  // 2. Check if auth route (sign-in page)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  if (isAuthRoute) {
    if (isLoggedIn) {
      // Already logged in, redirect home
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    // Allow auth page
    return null;
  }

  // 3. Check if protected route
  const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
  if (!isLoggedIn && isProtectedRoute) {
    // Not logged in, redirect to login
    return Response.redirect(new URL("/auth/sign-in", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### Step 3: Using Auth in Components

```typescript
// app/dashboard/page.tsx - Server Component
const Page = async () => {
  // Get current user on server
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  // Now I can access user data
  console.log(session.user.id);      // Database ID
  console.log(session.user.email);   // Email
  console.log(session.user.role);    // Role

  // Use in database queries
  const playgrounds = await db.playground.findMany({
    where: { userId: session.user.id },
  });

  return <Dashboard playgrounds={playgrounds} />;
};
```

```typescript
// modules/dashboard/components/UserMenu.tsx - Client Component
"use client";
import { useSession, signOut } from "next-auth/react";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Skeleton />;
  if (!session) return <Button onClick={() => signIn()}>Login</Button>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          src={session.user?.image}
          alt="Profile"
          className="rounded-full"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem disabled>
          {session.user?.name}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

# FILE MANAGEMENT SYSTEM

## Complete File CRUD Operations

### Create File

```typescript
const handleAddFile = async () => {
  // 1. Open dialog
  const filename = prompt("Enter filename");
  const extension = prompt("File extension (e.g., tsx, js, css)");

  // 2. Create file object
  const newFile: TemplateFile = {
    filename,
    fileExtension: extension,
    content: "", // Empty file
  };

  // 3. Call Zustand action
  await handleAddFile(newFile, "src/components", writeFileSync, instance, saveTemplateData);

  // Inside Zustand:
  // ├─ Find parent folder in tree
  // ├─ Add file to parent's items array
  // ├─ Write to WebContainer filesystem
  // ├─ Save to MongoDB
  // └─ Show success toast
};
```

### Read File

```typescript
const handleFileClick = (file: TemplateFile) => {
  // 1. File clicked in explorer
  // 2. Open in new tab
  openFile(file);
  
  // Inside Zustand:
  // ├─ Check if already open
  // ├─ If yes: just switch active tab
  // ├─ If no: add to openFiles array
  // ├─ Set as activeFileId
  // └─ Show content in Monaco editor
};
```

### Update File

```typescript
const handleFileEdit = (newContent: string) => {
  // 1. User types in Monaco
  // 2. onChange event fires
  // 3. Update state
  updateFileContent(activeFileId, newContent);

  // Inside Zustand:
  // ├─ Find file in openFiles by ID
  // ├─ Update content
  // ├─ Compare with originalContent
  // ├─ Set hasUnsavedChanges flag
  // └─ Re-render with orange dot on tab
};

const handleSave = async () => {
  // 1. User presses Ctrl+S or clicks Save
  // 2. Get current file content
  const content = get().editorContent;
  
  // 3. Call server action
  await SaveUpdatedCode(playgroundId, templateData);

  // Inside server action:
  // ├─ Convert templateData to JSON
  // ├─ Upsert TemplateFile in MongoDB
  // ├─ Update originalContent in state
  // ├─ Set hasUnsavedChanges = false
  // └─ Remove orange dot from tab
};
```

### Delete File

```typescript
const handleDeleteFile = (file: TemplateFile, parentPath: string) => {
  // 1. User right-clicks, selects Delete
  // 2. Show confirmation
  if (!confirm("Delete file permanently?")) return;

  // 3. Close if open
  const openFile = openFiles.find(f => f.filename === file.filename);
  if (openFile) {
    closeFile(openFile.id);
  }

  // 4. Remove from tree
  // Inside Zustand:
  // ├─ Find parent folder
  // ├─ Filter out the file
  // ├─ Delete from WebContainer
  // ├─ Save to MongoDB
  // └─ Show deleted toast

  handleDeleteFile(file, parentPath, saveTemplateData);
};
```

---

Continue in next part...

# CODE EXECUTION IN BROWSER

## WebContainersBoot Process

###Step 1: Initialize

```typescript
    const initWebContainer = async () => {
        console.log("1️⃣  Preparing WebContainer...");
        
        //Download lightweight WASM Linux kernel + Node.js
        const container = await WebContainer.boot();
        
        console.log("2️⃣  Environment ready!");
        return container;
    };
```

###Step 2: File Sync

```typescript
const syncFiles = async (container, templateData) => {
    console.log("3️⃣  Writing files to container...");
    
    // Recursive function to write all files
    const writeNode = async (item, currentPath) => {
        if ("folderName" in item) {
            // It's a folder
            const folderPath = `${currentPath}/${item.folderName}`;
            await container.fs.mkdir(folderPath, { recursive: true });
            
            // Write all files inside
            for (const child of item.items) {
                await writeNode(child, folderPath);
            }
        } else {
            // It's a file
            const filePath = `${currentPath}/${item.filename}.${item.fileExtension}`;
            await container.fs.writeFile(filePath, item.content);
        }
    };

    await writeNode(templateData, "");
    console.log("✅ Files written!");
};
```

### Step 3: Install Dependencies

```typescript
const installDeps = async (container) => {
    console.log("4️⃣  Installing npm packages...");
    
    // Run: npm install
    const process = await container.spawn("npm", ["install"]);
    
    // Watch output
    for await (const chunk of process.output) {
        console.log(chunk);  // Show npm progress
    }
    
    const exitCode = await process.exit;
    
    if (exitCode !== 0) {
        throw new Error("npm install failed");
    }
    
    console.log("✅ Packages installed!");
};
```

### Step 4: Start Dev Server

```typescript
const startDevServer = async (container) => {
    console.log("5️⃣  Starting development server...");
    
    // Run: npm run dev
    const process = await container.spawn("npm", ["run", "dev"]);
    
    // Capture server URL
    let serverUrl = null;
    for await (const chunk of process.output) {
        console.log(chunk);  // Show Vite/Next.js output
        
        // Look for URL in output
        const match = chunk.match(/http:\/\/localhost:\d+/);
        if (match && !serverUrl) {
            serverUrl = match[0];
            console.log(`✅ Server running at: ${serverUrl}`);
            return serverUrl;
        }
    }
    
    throw new Error("Could not find server URL");
};
```

### Full Example in Hook

```typescript
export const useWebContainer = ({ templateData }) => {
    const [instance, setInstance] = useState(null);
    const [serverUrl, setServerUrl] = useState("");
    const [status, setStatus] = useState("idle");

    useEffect(() => {
        const boot = async () => {
            try {
                setStatus("initializing");
                const container = await WebContainer.boot();
                
                setStatus("syncing");
                await syncFilesToContainer(container, templateData);
                
                setStatus("installing");
                await installDeps(container);
                
                setStatus("starting");
                const url = await startDevServer(container);
                
                setInstance(container);
                setServerUrl(url);
                setStatus("ready");
            } catch (error) {
                console.error("Boot failed:", error);
                setStatus("error");
            }
        };

        boot();
    }, [templateData]);

    return {
        instance,           // WebContainer API
        serverUrl,          // http://localhost:xxxx
        status,             // "initializing" | "ready" | "error"
        writeFileSync: async (path, content) => {
            if (instance) {
                await instance.fs.writeFile(path, content);
            }
        },
    };
};
```

---

# AI FEATURES

## Code Completion Flow

### Complete AI Suggestion Process

```typescript
// Step 1: User triggers suggestion
const handleKeyDown = (editor, event) => {
    if (event.ctrlKey && event.key === " ") {
        // Ctrl+Space pressed
        event.preventDefault();
        fetchSuggestion("completion", editor);
    }
};

// Step 2: Fetch suggestion
const fetchSuggestion = async (type, editor) => {
    // Get editor state
    const model = editor.getModel();
    const position = editor.getPosition();
    const fileContent = model.getValue();

    // Build request
    const payload = {
        fileContent,                    // Full file
        cursorLine: position.lineNumber - 1,
        cursorColumn: position.column - 1,
        suggestionType: type,
        fileName: activeFile.filename,
    };

    // Call API
    const response = await fetch("/api/code-completion", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("🤖 AI Suggestion:", data.suggestion);

    // Show suggestion
    showInlineCompletion(editor, data.suggestion, position);
};

// Step 3: Show inline completion
const showInlineCompletion = (editor, suggestion, position) => {
    // Add decoration (ghost text)
    const decorations = editor.deltaDecorations([], [
        {
            range: new monaco.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column
            ),
            options: {
                glyphMarginHoverMessage: [
                    { value: "AI Suggestion (Tab to accept)" }
                ],
                className: "ai-suggestion",
                stickiness: 1,
            },
        },
    ]);

    // Store decoration ID for later
    currentSuggestionRef.current = {
        text: suggestion,
        position,
        decorationIds: decorations,
    };
};

// Step 4: Accept suggestion (Tab)
const acceptSuggestion = () => {
    const editor = editorRef.current;
    const suggestion = currentSuggestionRef.current;

    if (!suggestion || !editor) return;

    // Insert text
    editor.executeEdits("ai-completion", [
        {
            range: new monaco.Range(
                suggestion.position.lineNumber,
                suggestion.position.column,
                suggestion.position.lineNumber,
                suggestion.position.column
            ),
            text: suggestion.text,
        },
    ]);

    // Clear decoration
    editor.deltaDecorations(suggestion.decorationIds, []);
    currentSuggestionRef.current = null;
};

// Step 5: Reject suggestion (Esc)
const rejectSuggestion = () => {
    const editor = editorRef.current;
    const suggestion = currentSuggestionRef.current;

    if (!suggestion || !editor) return;

    // Just remove decoration
    editor.deltaDecorations(suggestion.decorationIds, []);
    currentSuggestionRef.current = null;
};
```

---

## AI Chat Feature

```typescript
// modules/ai-chat/components/AIChat.tsx

export const AIChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // 1. Add user message
        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // 2. Call AI API
            const response = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({
                    message: input,
                    history: messages,  // Include conversation history
                }),
            });

            const data = await response.json();

            // 3. Add AI response
            setMessages(prev => [...prev, {
                role: "assistant",
                content: data.response,
            }]);
        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat history */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={msg.role === "user" ? "text-right" : "text-left"}
                    >
                        <div className={`p-3 rounded ${
                            msg.role === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-black"
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="border-t p-4 flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask AI..."
                    className="flex-1 border rounded px-3 py-2"
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    );
};
```

---

This detailed explanation should cover everything! Would you like more specific details on any particular area?
