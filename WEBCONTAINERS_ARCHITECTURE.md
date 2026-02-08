# ⚙️ Vibe Code Editor - WebContainers & Execution Architecture

## 📋 Table of Contents
1. [WebContainers Overview](#webcontainers-overview)
2. [Virtual File System](#virtual-file-system)
3. [Code Execution Model](#code-execution-model)
4. [Terminal Integration](#terminal-integration)
5. [Preview System](#preview-system)
6. [AI Integration](#ai-integration)
7. [Template System](#template-system)
8. [Performance & Optimization](#performance--optimization)

---

## WebContainers Overview

### What are WebContainers?

WebContainers is a browser-based runtime that allows you to run **Node.js** applications entirely in the browser using **WebAssembly (WASM)**. No backend server required.

**Key Features**:
- ✅ Full Node.js environment in browser
- ✅ npm package installation
- ✅ Dev servers (Vite, Webpack, etc.)
- ✅ Terminal commands
- ✅ File system operations
- ✅ Network requests (localhost)

### Architecture

```
┌─────────────────────────────────────────────────────┐
│              Browser Tab (Chrome/Edge)              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────┐     │
│  │         WebContainer Instance             │     │
│  │  ┌─────────────────────────────────────┐  │     │
│  │  │      Node.js (WASM Runtime)         │  │     │
│  │  │  - V8 JavaScript Engine             │  │     │
│  │  │  - npm/pnpm Package Manager         │  │     │
│  │  │  - File System API                  │  │     │
│  │  └─────────────────────────────────────┘  │     │
│  │                                           │     │
│  │  ┌─────────────────────────────────────┐  │     │
│  │  │     Virtual File System (Memory)    │  │     │
│  │  │  /src/App.tsx                       │  │     │
│  │  │  /package.json                      │  │     │
│  │  │  /node_modules/...                  │  │     │
│  │  └─────────────────────────────────────┘  │     │
│  │                                           │     │
│  │  ┌─────────────────────────────────────┐  │     │
│  │  │      Dev Server (Vite/Webpack)      │  │     │
│  │  │  Listening on localhost:3000        │  │     │
│  │  └─────────────────────────────────────┘  │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
│  ┌───────────────────────────────────────────┐     │
│  │         Preview Iframe                    │     │
│  │  http://localhost:3000                    │     │
│  │  ┌─────────────────────────────────────┐  │     │
│  │  │   Running React App (rendered)      │  │     │
│  │  └─────────────────────────────────────┘  │     │
│  └───────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

### Initialization Flow

```typescript
// 1. Boot WebContainer
const webcontainer = await WebContainer.boot()

// 2. Mount file system
await webcontainer.mount({
  'src': {
    directory: {
      'App.tsx': {
        file: {
          contents: 'import React from "react"...'
        }
      }
    }
  },
  'package.json': {
    file: {
      contents: '{"name": "my-app"...}'
    }
  }
})

// 3. Install dependencies
const installProcess = await webcontainer.spawn('npm', ['install'])
await installProcess.exit

// 4. Start dev server
const devProcess = await webcontainer.spawn('npm', ['run', 'dev'])

// 5. Listen for server ready
webcontainer.on('server-ready', (port, url) => {
  // Open preview iframe to: url
  setPreviewUrl(url)
})
```

---

## Virtual File System

### File System Structure

```typescript
interface FileSystemTree {
  [key: string]: {
    directory?: FileSystemTree  // Nested directories
    file?: {
      contents: string          // File content
    }
  }
}

// Example: React project
const reactProject: FileSystemTree = {
  'package.json': {
    file: {
      contents: JSON.stringify({
        name: 'react-app',
        version: '1.0.0',
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0'
        },
        scripts: {
          'dev': 'vite',
          'build': 'vite build'
        }
      }, null, 2)
    }
  },
  'index.html': {
    file: {
      contents: '<!DOCTYPE html>...'
    }
  },
  'src': {
    directory: {
      'App.tsx': {
        file: {
          contents: 'import React from "react"...'
        }
      },
      'main.tsx': {
        file: {
          contents: 'import React from "react"...'
        }
      },
      'index.css': {
        file: {
          contents: 'body { margin: 0; }'
        }
      }
    }
  },
  'public': {
    directory: {
      'vite.svg': {
        file: {
          contents: '<svg>...</svg>'
        }
      }
    }
  }
}
```

### File Operations

#### 1. Create File
```typescript
async function createFile(
  webcontainer: WebContainer,
  path: string,
  content: string
) {
  await webcontainer.fs.writeFile(path, content)
}

// Usage
await createFile(webcontainer, '/src/NewComponent.tsx', `
export default function NewComponent() {
  return <div>Hello</div>
}
`)
```

#### 2. Read File
```typescript
async function readFile(
  webcontainer: WebContainer,
  path: string
): Promise<string> {
  const content = await webcontainer.fs.readFile(path, 'utf-8')
  return content
}

// Usage
const appContent = await readFile(webcontainer, '/src/App.tsx')
```

#### 3. Update File
```typescript
async function updateFile(
  webcontainer: WebContainer,
  path: string,
  newContent: string
) {
  await webcontainer.fs.writeFile(path, newContent)
}

// Hot reload automatically triggered
await updateFile(webcontainer, '/src/App.tsx', updatedCode)
```

#### 4. Delete File
```typescript
async function deleteFile(
  webcontainer: WebContainer,
  path: string
) {
  await webcontainer.fs.rm(path)
}
```

#### 5. Create Directory
```typescript
async function createDirectory(
  webcontainer: WebContainer,
  path: string
) {
  await webcontainer.fs.mkdir(path, { recursive: true })
}
```

#### 6. List Directory
```typescript
async function listDirectory(
  webcontainer: WebContainer,
  path: string
): Promise<string[]> {
  const files = await webcontainer.fs.readdir(path)
  return files
}
```

### File Watcher

```typescript
// Watch for file changes
webcontainer.on('fs:change', (event) => {
  console.log('File changed:', event.path)
  console.log('Change type:', event.type) // 'create' | 'update' | 'delete'
  
  // Update UI
  refreshFileTree()
  
  // Auto-save to database (debounced)
  debouncedSave()
})
```

---

## Code Execution Model

### Terminal Command Execution

```typescript
interface TerminalCommand {
  command: string
  args: string[]
  onOutput: (data: string) => void
  onError: (data: string) => void
  onExit: (code: number) => void
}

async function executeCommand(
  webcontainer: WebContainer,
  { command, args, onOutput, onError, onExit }: TerminalCommand
) {
  const process = await webcontainer.spawn(command, args)
  
  // Stream stdout
  process.output.pipeTo(
    new WritableStream({
      write(data) {
        onOutput(data)
      }
    })
  )
  
  // Wait for exit
  const exitCode = await process.exit
  onExit(exitCode)
  
  if (exitCode !== 0) {
    onError(`Process exited with code ${exitCode}`)
  }
}

// Usage
await executeCommand(webcontainer, {
  command: 'npm',
  args: ['install'],
  onOutput: (data) => {
    terminal.write(data)
  },
  onError: (error) => {
    console.error(error)
  },
  onExit: (code) => {
    if (code === 0) {
      toast({ title: 'Dependencies installed!' })
    }
  }
})
```

### Common Commands

```typescript
// Install dependencies
await webcontainer.spawn('npm', ['install'])

// Run dev server
await webcontainer.spawn('npm', ['run', 'dev'])

// Build project
await webcontainer.spawn('npm', ['run', 'build'])

// Run linter
await webcontainer.spawn('npm', ['run', 'lint'])

// Git operations (if git is available)
await webcontainer.spawn('git', ['init'])
await webcontainer.spawn('git', ['add', '.'])
await webcontainer.spawn('git', ['commit', '-m', 'Initial commit'])
```

---

## Terminal Integration

### xterm.js Integration

```typescript
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'

function TerminalComponent({ webcontainer }: { webcontainer: WebContainer }) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<Terminal>()
  
  useEffect(() => {
    if (!terminalRef.current) return
    
    // Create terminal
    const terminal = new Terminal({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4'
      },
      cursorBlink: true
    })
    
    // Add addons
    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)
    
    // Mount terminal
    terminal.open(terminalRef.current)
    fitAddon.fit()
    
    // Handle input
    let commandBuffer = ''
    terminal.onData((data) => {
      if (data === '\r') { // Enter key
        terminal.write('\r\n')
        executeCommand(webcontainer, commandBuffer)
        commandBuffer = ''
      } else if (data === '\u007F') { // Backspace
        if (commandBuffer.length > 0) {
          commandBuffer = commandBuffer.slice(0, -1)
          terminal.write('\b \b')
        }
      } else {
        commandBuffer += data
        terminal.write(data)
      }
    })
    
    xtermRef.current = terminal
    
    return () => {
      terminal.dispose()
    }
  }, [webcontainer])
  
  return <div ref={terminalRef} className="h-full w-full" />
}
```

### Terminal Features

**Supported**:
- ✅ Command history (up/down arrows)
- ✅ Tab completion
- ✅ Clickable links
- ✅ Copy/paste
- ✅ ANSI color codes
- ✅ Clear screen (Ctrl+L)

**Commands**:
```bash
$ npm install          # Install dependencies
$ npm run dev          # Start dev server
$ npm run build        # Production build
$ ls                   # List files
$ cat src/App.tsx      # View file content
$ clear                # Clear terminal
```

---

## Preview System

### Preview Iframe Setup

```typescript
interface PreviewState {
  url: string | null
  isLoading: boolean
  error: string | null
}

function PreviewPane({ webcontainer }: { webcontainer: WebContainer }) {
  const [preview, setPreview] = useState<PreviewState>({
    url: null,
    isLoading: true,
    error: null
  })
  
  useEffect(() => {
    // Listen for server ready
    webcontainer.on('server-ready', (port, url) => {
      setPreview({
        url,
        isLoading: false,
        error: null
      })
    })
    
    // Listen for errors
    webcontainer.on('error', (error) => {
      setPreview({
        url: null,
        isLoading: false,
        error: error.message
      })
    })
  }, [webcontainer])
  
  if (preview.isLoading) {
    return <LoadingSpinner />
  }
  
  if (preview.error) {
    return <ErrorDisplay error={preview.error} />
  }
  
  return (
    <iframe
      src={preview.url}
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  )
}
```

### Preview Features

**Auto-refresh**: Hot Module Replacement (HMR)
```typescript
// Vite/Webpack automatically refreshes on file changes
// No manual refresh needed

// Monaco Editor onChange
monaco.editor.onDidChangeModelContent((event) => {
  const newCode = monaco.getValue()
  
  // Update file in WebContainer
  await webcontainer.fs.writeFile('/src/App.tsx', newCode)
  
  // HMR automatically refreshes preview
})
```

**Console Output**: Capture browser console
```typescript
iframe.contentWindow.console.log = (...args) => {
  // Forward to terminal
  terminal.write(`[LOG] ${args.join(' ')}\n`)
}

iframe.contentWindow.console.error = (...args) => {
  // Show error in UI
  terminal.write(`\x1b[31m[ERROR] ${args.join(' ')}\x1b[0m\n`)
}
```

---

## AI Integration

### Code Completion with Ollama

```typescript
interface CodeCompletionRequest {
  prompt: string
  language: string
  cursorPosition: number
  temperature?: number
}

async function getCodeCompletion(
  request: CodeCompletionRequest
): Promise<string> {
  const response = await fetch('/api/code-completion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'codellama:7b',
      prompt: request.prompt,
      options: {
        temperature: request.temperature || 0.2,
        top_p: 0.95,
        max_tokens: 200
      }
    })
  })
  
  const data = await response.json()
  return data.completion
}
```

### Monaco Integration

```typescript
// Register completion provider
monaco.languages.registerCompletionItemProvider('typescript', {
  provideCompletionItems: async (model, position) => {
    const textBeforeCursor = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    })
    
    // Get AI suggestion
    const completion = await getCodeCompletion({
      prompt: textBeforeCursor,
      language: 'typescript',
      cursorPosition: textBeforeCursor.length
    })
    
    return {
      suggestions: [
        {
          label: 'AI Suggestion',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: completion,
          documentation: 'Generated by AI'
        }
      ]
    }
  }
})
```

### Inline Suggestions

```typescript
// Show ghost text (like GitHub Copilot)
let currentSuggestion = ''

monaco.editor.onDidChangeCursorPosition(async (event) => {
  // Debounce to avoid too many requests
  await sleep(500)
  
  const code = monaco.getValue()
  const position = monaco.getPosition()
  
  const suggestion = await getCodeCompletion({
    prompt: code,
    language: 'typescript',
    cursorPosition: position.column
  })
  
  // Show as ghost text
  monaco.editor.setDecorations([
    {
      range: {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column + suggestion.length
      },
      options: {
        className: 'ghost-text',
        after: {
          content: suggestion,
          opacity: '0.5'
        }
      }
    }
  ])
  
  currentSuggestion = suggestion
})

// Accept with Tab
monaco.editor.onKeyDown((event) => {
  if (event.keyCode === monaco.KeyCode.Tab && currentSuggestion) {
    event.preventDefault()
    monaco.editor.trigger('keyboard', 'type', { text: currentSuggestion })
    currentSuggestion = ''
  }
})
```

### AI Chat Assistant

```typescript
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  files?: string[] // Shared file contents
}

async function sendChatMessage(
  messages: ChatMessage[],
  files?: string[]
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      files,
      model: 'codellama:7b'
    })
  })
  
  // Stream response
  const reader = response.body.getReader()
  let result = ''
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    const text = new TextDecoder().decode(value)
    result += text
    
    // Update UI incrementally
    setChatResponse(result)
  }
  
  return result
}
```

---

## Template System

### Available Templates

```typescript
enum Templates {
  REACT = 'REACT',
  NEXTJS = 'NEXTJS',
  EXPRESS = 'EXPRESS',
  VUE = 'VUE',
  HONO = 'HONO',
  ANGULAR = 'ANGULAR'
}
```

### Template Loader

```typescript
async function loadTemplate(
  template: Templates
): Promise<FileSystemTree> {
  const response = await fetch(`/vibecode-starters/${template.toLowerCase()}-app/template.json`)
  const templateFiles = await response.json()
  return templateFiles
}

// Usage
const reactTemplate = await loadTemplate(Templates.REACT)
await webcontainer.mount(reactTemplate)
```

### React Template Structure

```typescript
{
  'package.json': {
    file: {
      contents: `{
        "name": "vite-react-app",
        "version": "1.0.0",
        "type": "module",
        "scripts": {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview"
        },
        "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0"
        },
        "devDependencies": {
          "@vitejs/plugin-react": "^4.0.0",
          "vite": "^4.3.9"
        }
      }`
    }
  },
  'vite.config.js': {
    file: {
      contents: `
        import { defineConfig } from 'vite'
        import react from '@vitejs/plugin-react'
        
        export default defineConfig({
          plugins: [react()]
        })
      `
    }
  },
  'index.html': { ... },
  'src': {
    directory: {
      'main.tsx': { ... },
      'App.tsx': { ... },
      'index.css': { ... }
    }
  }
}
```

### Custom Template Creation

```typescript
interface CustomTemplate {
  name: string
  description: string
  files: FileSystemTree
  dependencies: Record<string, string>
  scripts: Record<string, string>
}

function createCustomTemplate(
  config: CustomTemplate
): FileSystemTree {
  return {
    'package.json': {
      file: {
        contents: JSON.stringify({
          name: config.name,
          dependencies: config.dependencies,
          scripts: config.scripts
        }, null, 2)
      }
    },
    ...config.files
  }
}
```

---

## Performance & Optimization

### 1. Lazy Loading WebContainer

```typescript
// Don't boot WebContainer until user opens playground
const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null)

useEffect(() => {
  let mounted = true
  
  async function boot() {
    const wc = await WebContainer.boot()
    if (mounted) {
      setWebcontainer(wc)
    }
  }
  
  boot()
  
  return () => {
    mounted = false
  }
}, [])
```

### 2. Debounced File Saves

```typescript
import { useDebouncedCallback } from 'use-debounce'

const debouncedSave = useDebouncedCallback(
  async (content: string) => {
    await saveToDatabase(content)
  },
  1000 // Wait 1 second after last change
)

// On Monaco change
monaco.editor.onDidChangeModelContent(() => {
  const content = monaco.getValue()
  debouncedSave(content)
})
```

### 3. Virtual Scrolling for File Tree

```typescript
import { FixedSizeList } from 'react-window'

function FileTree({ files }: { files: FileNode[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={files.length}
      itemSize={32}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <FileItem file={files[index]} />
        </div>
      )}
    </FixedSizeList>
  )
}
```

### 4. Code Splitting

```typescript
// Lazy load Monaco
const MonacoEditor = lazy(() => import('./MonacoEditor'))

// Lazy load WebContainer
const PlaygroundEditor = lazy(() => import('./PlaygroundEditor'))

// Usage
<Suspense fallback={<LoadingSpinner />}>
  <MonacoEditor />
</Suspense>
```

### 5. Service Worker Caching

```typescript
// Cache WebContainer WASM files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('webcontainer-v1').then((cache) => {
      return cache.addAll([
        '/webcontainer.wasm',
        '/node-runtime.wasm'
      ])
    })
  )
})
```

---

## Error Handling

### WebContainer Errors

```typescript
try {
  const webcontainer = await WebContainer.boot()
} catch (error) {
  if (error.message.includes('SharedArrayBuffer')) {
    // Browser doesn't support required features
    showError('Your browser is not supported. Please use Chrome or Edge.')
  } else if (error.message.includes('cross-origin')) {
    // CORS headers not set correctly
    showError('Server configuration error.')
  } else {
    showError('Failed to initialize playground.')
  }
}
```

### Runtime Errors

```typescript
webcontainer.on('error', (error) => {
  console.error('WebContainer error:', error)
  
  // Show in terminal
  terminal.write(`\x1b[31mError: ${error.message}\x1b[0m\n`)
  
  // Show toast
  toast({
    title: 'Runtime Error',
    description: error.message,
    variant: 'destructive'
  })
})
```

### File System Errors

```typescript
try {
  await webcontainer.fs.writeFile('/src/App.tsx', newContent)
} catch (error) {
  if (error.code === 'ENOENT') {
    // File doesn't exist
    toast({ title: 'File not found', variant: 'destructive' })
  } else if (error.code === 'EACCES') {
    // Permission denied
    toast({ title: 'Permission denied', variant: 'destructive' })
  } else {
    toast({ title: 'Failed to save file', variant: 'destructive' })
  }
}
```

---

## Security Considerations

### 1. Sandbox Iframe

```tsx
<iframe
  src={previewUrl}
  sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
  // Restricted: no popups, no top navigation
/>
```

### 2. Content Security Policy

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          }
        ]
      }
    ]
  }
}
```

### 3. Rate Limiting

```typescript
// Limit AI completions
const rateLimiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  max: 20 // 20 requests per minute
})

app.post('/api/code-completion', rateLimiter, handler)
```

---

## Future Enhancements

### 1. Multi-file Editing

```typescript
// Multiple Monaco instances
<Split>
  <MonacoEditor file="src/App.tsx" />
  <MonacoEditor file="src/utils.ts" />
</Split>
```

### 2. Debugging Support

```typescript
// Chrome DevTools Protocol integration
const debugger = await webcontainer.attachDebugger()

debugger.setBreakpoint('/src/App.tsx', 10)
debugger.stepOver()
debugger.evaluate('myVariable')
```

### 3. Package Search

```typescript
// Search npm packages in-app
const packages = await searchNpmPackages('react', { limit: 10 })

// Install with one click
await installPackage('lodash', '4.17.21')
```

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**WebContainers Version**: 1.x
