# 🎨 Vibe Code Editor - UI/UX Design System

## 📋 Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Library](#component-library)
6. [Page Layouts](#page-layouts)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)
9. [Animation & Motion](#animation--motion)
10. [Dark/Light Mode](#darklight-mode)

---

## Design Philosophy

### Core Principles

#### 1. **Developer-First**
- Interface optimized for coding workflow
- Keyboard shortcuts for common actions
- Minimal distractions, maximum productivity

#### 2. **Clean & Modern**
- Minimalist design with purpose
- Ample whitespace
- Clear visual hierarchy
- Professional color palette

#### 3. **Performance**
- Fast loading animations
- Smooth transitions
- No unnecessary re-renders
- Optimized bundle size

#### 4. **Accessibility**
- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- High contrast mode

---

## Color System

### Primary Colors

```css
/* Brand Colors */
--primary: 222.2 47.4% 11.2%       /* Dark slate - Main brand */
--primary-foreground: 210 40% 98%  /* Off-white text */

/* Accent Colors */
--accent: 210 40% 96.1%            /* Light blue accent */
--accent-foreground: 222.2 47.4% 11.2%

/* Muted Colors */
--muted: 210 40% 96.1%             /* Subtle backgrounds */
--muted-foreground: 215.4 16.3% 46.9%
```

### Semantic Colors

```css
/* Status Colors */
--success: 142 76% 36%     /* Green - Success states */
--warning: 38 92% 50%      /* Amber - Warning states */
--error: 0 72% 51%         /* Red - Error states */
--info: 199 89% 48%        /* Blue - Info states */

/* Syntax Highlighting */
--syntax-keyword: 204 100% 50%     /* Blue */
--syntax-string: 104 60% 45%      /* Green */
--syntax-number: 36 100% 40%      /* Orange */
--syntax-comment: 0 0% 50%        /* Gray */
--syntax-function: 271 80% 60%    /* Purple */
```

### Usage Examples

```typescript
// Button variants
<Button variant="default">     {/* bg-primary */}
<Button variant="secondary">   {/* bg-secondary */}
<Button variant="destructive"> {/* bg-error */}
<Button variant="outline">     {/* border-primary */}
<Button variant="ghost">       {/* transparent */}
```

---

## Typography

### Font Stack

```css
/* Sans-serif (UI Text) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;

/* Monospace (Code) */
font-family: 'JetBrains Mono', 'Fira Code', Consolas, 
             'Courier New', monospace;
```

### Type Scale

```css
/* Headings */
--text-5xl: 3rem      /* 48px - Hero titles */
--text-4xl: 2.25rem   /* 36px - Page titles */
--text-3xl: 1.875rem  /* 30px - Section titles */
--text-2xl: 1.5rem    /* 24px - Card titles */
--text-xl: 1.25rem    /* 20px - Subheadings */
--text-lg: 1.125rem   /* 18px - Large body */

/* Body */
--text-base: 1rem     /* 16px - Default */
--text-sm: 0.875rem   /* 14px - Small text */
--text-xs: 0.75rem    /* 12px - Captions */
```

### Font Weights

```css
--font-thin: 100
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

### Usage

```tsx
<h1 className="text-4xl font-bold">Vibe Code Editor</h1>
<p className="text-base text-muted-foreground">
  Build projects in your browser
</p>
<code className="font-mono text-sm">console.log('Hello')</code>
```

---

## Spacing System

### Scale (Tailwind)

```css
0   = 0px      /* No spacing */
1   = 0.25rem  /* 4px */
2   = 0.5rem   /* 8px */
3   = 0.75rem  /* 12px */
4   = 1rem     /* 16px - Base unit */
5   = 1.25rem  /* 20px */
6   = 1.5rem   /* 24px */
8   = 2rem     /* 32px */
10  = 2.5rem   /* 40px */
12  = 3rem     /* 48px */
16  = 4rem     /* 64px */
20  = 5rem     /* 80px */
```

### Application

```tsx
/* Padding */
<div className="p-4">      {/* 16px all sides */}
<div className="px-6 py-4"> {/* 24px horizontal, 16px vertical */}

/* Margin */
<div className="m-4">      {/* 16px all sides */}
<div className="mt-8 mb-4"> {/* 32px top, 16px bottom */}

/* Gap (Flexbox/Grid) */
<div className="flex gap-4">  {/* 16px between items */}
```

---

## Component Library

### 1. Button Component

**Variants**: Default, Secondary, Destructive, Outline, Ghost, Link

```tsx
interface ButtonProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

// Usage
<Button variant="default" size="lg">
  Get Started
</Button>

<Button variant="outline" size="sm">
  Cancel
</Button>

<Button variant="ghost" size="icon">
  <TrashIcon />
</Button>
```

**States**:
- Default
- Hover (brightness increase)
- Active (pressed)
- Disabled (opacity 50%)
- Loading (spinner icon)

---

### 2. Card Component

**Anatomy**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Project Name</CardTitle>
    <CardDescription>Created 2 days ago</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Project description goes here</p>
  </CardContent>
  <CardFooter className="flex gap-2">
    <Button>Open</Button>
    <Button variant="outline">Delete</Button>
  </CardFooter>
</Card>
```

**Styling**:
```css
.card {
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--card);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

### 3. Dialog/Modal Component

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Create Project</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogDescription>
        Choose a template to get started
      </DialogDescription>
    </DialogHeader>
    
    {/* Content */}
    <Form>...</Form>
    
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Create</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Features**:
- Focus trap
- Escape key to close
- Click outside to close
- Smooth enter/exit animations
- Portal rendering (outside DOM hierarchy)

---

### 4. Input Component

```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  disabled?: boolean
  error?: string
}

// Usage
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="you@example.com"
  />
  {error && <p className="text-sm text-destructive">{error}</p>}
</div>
```

**States**:
- Default
- Focus (ring/outline)
- Error (red border)
- Disabled (opacity 50%)

---

### 5. Select/Dropdown Component

```tsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select template" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="react">React</SelectItem>
    <SelectItem value="nextjs">Next.js</SelectItem>
    <SelectItem value="vue">Vue</SelectItem>
    <SelectItem value="angular">Angular</SelectItem>
  </SelectContent>
</Select>
```

**Features**:
- Keyboard navigation (arrow keys)
- Type-ahead search
- Multi-select support
- Custom option rendering

---

### 6. Toast/Notification Component

```tsx
import { useToast } from '@/hooks/use-toast'

// In component
const { toast } = useToast()

toast({
  title: "Project created!",
  description: "Your React project is ready.",
  variant: "success"
})

toast({
  title: "Error",
  description: "Failed to save changes.",
  variant: "destructive"
})
```

**Position**: Bottom-right
**Duration**: 5 seconds (configurable)
**Animation**: Slide in from right

---

### 7. Badge Component

```tsx
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Deleted</Badge>
<Badge variant="outline">Public</Badge>
```

**Use Cases**:
- Status indicators
- Tags/labels
- Count badges
- New feature indicators

---

### 8. Avatar Component

```tsx
<Avatar>
  <AvatarImage src={user.image} alt={user.name} />
  <AvatarFallback>{user.name[0]}</AvatarFallback>
</Avatar>
```

**Sizes**: sm (32px), md (40px), lg (48px), xl (64px)

---

### 9. Tabs Component

```tsx
<Tabs defaultValue="editor">
  <TabsList>
    <TabsTrigger value="editor">Editor</TabsTrigger>
    <TabsTrigger value="terminal">Terminal</TabsTrigger>
    <TabsTrigger value="preview">Preview</TabsTrigger>
  </TabsList>
  
  <TabsContent value="editor">
    <MonacoEditor />
  </TabsContent>
  
  <TabsContent value="terminal">
    <Terminal />
  </TabsContent>
  
  <TabsContent value="preview">
    <Preview />
  </TabsContent>
</Tabs>
```

---

### 10. Tooltip Component

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="icon">
      <InfoIcon />
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Additional information here</p>
  </TooltipContent>
</Tooltip>
```

**Delay**: 700ms
**Position**: Auto (top, bottom, left, right)

---

## Page Layouts

### 1. Home Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Header (fixed)                          [Login]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│                   Hero Section                      │
│            ┌─────────────────────┐                  │
│            │   Large Image/GIF   │                  │
│            └─────────────────────┘                  │
│                                                     │
│         "Build Code with Intelligence"              │
│         Professional AI-powered IDE                 │
│                                                     │
│            [Get Started for Free]                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                  Features Section                   │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐            │
│  │Icon 1│  │Icon 2│  │Icon 3│  │Icon 4│            │
│  │Title │  │Title │  │Title │  │Title │            │
│  │Desc. │  │Desc. │  │Desc. │  │Desc. │            │
│  └──────┘  └──────┘  └──────┘  └──────┘            │
├─────────────────────────────────────────────────────┤
│  Footer - Links, Social Media, Copyright           │
└─────────────────────────────────────────────────────┘
```

---

### 2. Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│  Header: [Logo]  Dashboard        [Avatar] [Theme] │
├─────────────────────────────────────────────────────┤
│  Title: "My Projects"           [+ New Project]     │
├─────────────────────────────────────────────────────┤
│  Tabs: [All] [Starred] [Recent]                     │
├─────────────────────────────────────────────────────┤
│  Grid Layout (Responsive)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Project  │  │ Project  │  │ Project  │          │
│  │  Card 1  │  │  Card 2  │  │  Card 3  │          │
│  │          │  │          │  │          │          │
│  │ [Open]   │  │ [Open]   │  │ [Open]   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Project  │  │ Project  │  │ Project  │          │
│  │  Card 4  │  │  Card 5  │  │  Card 6  │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

---

### 3. Playground/Editor Layout

```
┌─────────────────────────────────────────────────────┐
│  Header: [Logo] Project Name   [Save] [Share][Run] │
├──────────┬──────────────────────────────────────────┤
│          │  Editor Tabs: [App.tsx] [index.css][x]  │
│  File    ├──────────────────────────────────────────┤
│  Tree    │                                          │
│          │         Monaco Code Editor               │
│  📁 src  │                                          │
│   📄 App │                                          │
│   📄 ind │                                          │
│  📁 pub  │                                          │
│          │                                          │
├──────────┼──────────────────────────────────────────┤
│          │  Terminal / Preview (Tabs)              │
│          │  $ npm run dev                           │
│          │  > Starting development server...        │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Dimensions**:
- File Explorer: 250px (resizable)
- Editor: flex-grow
- Terminal/Preview: 300px height (resizable)

---

### 4. Split Editor/Preview Layout

```
┌─────────────────────────────────────────────────────┐
│  Header                                             │
├──────┬──────────────────────┬───────────────────────┤
│      │                      │                       │
│ File │    Code Editor       │   Live Preview        │
│ Tree │                      │   ┌─────────────┐     │
│      │  function App() {    │   │   [Result]  │     │
│ 📁   │    return (           │   │             │     │
│ 📄   │      <div>            │   │  Hello      │     │
│ 📄   │        Hello          │   │  World      │     │
│      │      </div>           │   │             │     │
│      │    )                 │   └─────────────┘     │
│      │  }                   │                       │
│      │                      │   [Iframe Preview]    │
├──────┴──────────────────────┴───────────────────────┤
│  Terminal: $ npm run dev                            │
└─────────────────────────────────────────────────────┘
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
sm:  640px   /* Small devices (phones) */
md:  768px   /* Medium devices (tablets) */
lg:  1024px  /* Large devices (laptops) */
xl:  1280px  /* Extra large (desktops) */
2xl: 1536px  /* 2XL (large desktops) */
```

### Responsive Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
  {projects.map(project => <ProjectCard key={project.id} {...project} />)}
</div>
```

### Mobile Navigation

```tsx
// Desktop: Horizontal nav
<nav className="hidden md:flex gap-4">
  <Link>Dashboard</Link>
  <Link>Projects</Link>
</nav>

// Mobile: Hamburger menu
<Sheet className="md:hidden">
  <SheetTrigger><MenuIcon /></SheetTrigger>
  <SheetContent>
    <nav className="flex flex-col gap-4">
      <Link>Dashboard</Link>
      <Link>Projects</Link>
    </nav>
  </SheetContent>
</Sheet>
```

### Playground Mobile Layout

```
Mobile (< 768px):
┌─────────────┐
│   Header    │
├─────────────┤
│   Tabs:     │
│ [📁][💻][▶] │
├─────────────┤
│             │
│  Active Tab │
│   Content   │
│             │
└─────────────┘

Desktop (>= 768px):
Split view (as shown above)
```

---

## Accessibility

### Keyboard Navigation

```tsx
// Focus visible on keyboard navigation
button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

// Skip to main content
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### ARIA Labels

```tsx
<button aria-label="Delete project">
  <TrashIcon />
</button>

<nav aria-label="Main navigation">
  ...
</nav>

<section aria-labelledby="projects-heading">
  <h2 id="projects-heading">My Projects</h2>
  ...
</section>
```

### Screen Reader Support

```tsx
// Visually hidden but available to screen readers
<span className="sr-only">Loading</span>

// Live regions for dynamic updates
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### Color Contrast

- Text: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio

### Focus Management

```tsx
// Dialog focus trap
useEffect(() => {
  if (isOpen) {
    const firstInput = dialogRef.current?.querySelector('input')
    firstInput?.focus()
  }
}, [isOpen])

// Return focus on close
const previousFocus = useRef<HTMLElement>()

const openDialog = () => {
  previousFocus.current = document.activeElement as HTMLElement
  setIsOpen(true)
}

const closeDialog = () => {
  setIsOpen(false)
  previousFocus.current?.focus()
}
```

---

## Animation & Motion

### Transition Utilities

```css
/* Smooth transitions */
.transition-base {
  transition: all 150ms ease-in-out;
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: ease-in-out;
  transition-duration: 150ms;
}
```

### Button Hover Effects

```tsx
<Button className="transition-all hover:scale-105 hover:shadow-lg">
  Get Started
</Button>
```

### Card Hover

```css
.card {
  transition: transform 200ms, box-shadow 200ms;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
```

### Page Transitions

```tsx
// Framer Motion
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

### Loading Skeletons

```tsx
<div className="animate-pulse">
  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
  <div className="h-4 bg-muted rounded w-1/2"></div>
</div>
```

---

## Dark/Light Mode

### Implementation

```tsx
// ThemeProvider
import { ThemeProvider } from 'next-themes'

function App({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  )
}

// Theme Toggle
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
```

### Color Variables

```css
:root {
  /* Light mode */
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 47.4% 11.2%;
}

.dark {
  /* Dark mode */
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  --card: 224 71% 4%;
  --card-foreground: 213 31% 91%;
}
```

### Usage

```tsx
<div className="bg-background text-foreground">
  <Card className="bg-card text-card-foreground">
    Content
  </Card>
</div>
```

---

## Component Composition Examples

### Project Card

```tsx
function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{project.template}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="mt-2">{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex gap-2">
        <Button className="flex-1">Open</Button>
        <Button variant="outline" size="icon">
          <StarIcon />
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### Header Component

```tsx
function Header() {
  const { data: session } = useSession()
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <CodeIcon className="h-6 w-6" />
            <span className="font-bold text-xl">Vibe Code</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/playground">Playground</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={session.user.image} />
                    <AvatarFallback>{session.user.name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
```

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Border Radius */
  --radius: 0.5rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-modal: 1300;
  --z-tooltip: 1500;
  --z-toast: 1600;
  
  /* Transitions */
  --transition-base: 150ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
  
  /* Container Max Width */
  --container-max: 1280px;
}
```

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Design System**: Based on ShadCN UI + TailwindCSS
