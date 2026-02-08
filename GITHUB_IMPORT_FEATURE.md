# 🚀 GitHub Repository Import Feature

## Overview

The GitHub Repository Import feature allows users to import any public GitHub repository directly into the Vibe Code Editor playground. This eliminates the need to manually create files and copy code.

## How It Works

### User Flow

1. **Navigate to Dashboard**: Go to the dashboard page
2. **Click "Open GitHub Repository"**: Click the card with the GitHub icon
3. **Enter Repository URL**: Paste the full GitHub repository URL
   - Example: `https://github.com/facebook/react`
4. **Import**: Click "Open Repository" button
5. **Auto-redirect**: Automatically redirected to the playground with imported files

### Technical Implementation

#### Backend (Server Action)

**File**: `modules/dashboard/actions/index.ts`

**Function**: `importGitHubRepository(repoUrl: string)`

**Features**:
- ✅ Parses GitHub URL to extract owner and repository name
- ✅ Validates repository exists and is public
- ✅ Fetches repository metadata from GitHub API
- ✅ Auto-detects project template type (React, Next.js, Vue, Angular, Express, Hono)
- ✅ Recursively fetches all files and folders
- ✅ Filters out unnecessary files (`.git`, `node_modules`, etc.)
- ✅ Limits file size to 1MB per file
- ✅ Creates a new playground in database
- ✅ Stores file structure in `TemplateFile` table

**Template Detection Logic**:
```typescript
// Reads package.json to detect framework
if (dependencies["next"]) → NEXTJS
if (dependencies["@angular/core"]) → ANGULAR
if (dependencies["vue"]) → VUE
if (dependencies["hono"]) → HONO
if (dependencies["express"]) → EXPRESS
if (dependencies["react"]) → REACT (default)
```

#### Frontend (Component)

**File**: `modules/dashboard/components/add-repo.tsx`

**Updates**:
- ✅ Added `useRouter` for navigation
- ✅ Imported `importGitHubRepository` server action
- ✅ Added loading toast during import
- ✅ Added error handling with user-friendly messages
- ✅ Auto-redirects to playground after successful import
- ✅ Added warning about public repositories only

### API Calls

The implementation uses GitHub's public REST API (no authentication required for public repos):

```typescript
// Fetch repository info
GET https://api.github.com/repos/{owner}/{repo}

// Fetch directory/file contents
GET https://api.github.com/repos/{owner}/{repo}/contents/{path}
```

**Rate Limits**:
- Unauthenticated requests: 60 requests/hour per IP
- For heavy usage, consider adding GitHub token authentication

## Usage Examples

### Example 1: Import React Project
```
URL: https://github.com/facebook/react
Result: Creates playground with React template
```

### Example 2: Import Next.js Project
```
URL: https://github.com/vercel/next.js
Result: Creates playground with Next.js template
```

### Example 3: Import Vue Project
```
URL: https://github.com/vuejs/vue
Result: Creates playground with Vue template
```

## Limitations

### Current Limitations
1. **Public repositories only** - Cannot import private repositories
2. **File size limit** - Files larger than 1MB are skipped
3. **Rate limiting** - Subject to GitHub API rate limits (60 req/hour without auth)
4. **Import time** - Large repositories may take 30-60 seconds to import
5. **No git history** - Only imports current state, not commit history

### Filtered Items
The following items are automatically excluded:
- `.git` directory
- `.github` directory
- `node_modules` folder
- `.DS_Store` files
- `.gitignore` file
- `.env` and `.env.local` files

## Error Handling

### Common Errors

**"Repository not found or is private"**
- Repository doesn't exist
- Repository is private
- Wrong URL format

**"Failed to fetch repository information"**
- Network issues
- GitHub API is down
- Rate limit exceeded

**"Failed to import repository"**
- Repository is too large
- Contains unsupported file types
- Network timeout

### User Feedback

**Loading State**:
```
Toast: "Importing repository... This may take a moment."
Button: "Opening..." (disabled)
```

**Success State**:
```
Toast: "Successfully imported {owner}/{repo}"
Action: Redirect to /playground/{id}
```

**Error State**:
```
Toast: Specific error message
Dialog: Remains open for retry
```

## Future Enhancements

### Planned Features
1. **GitHub Authentication** - Import private repositories
2. **Branch Selection** - Choose which branch to import
3. **Selective Import** - Choose specific folders/files
4. **Git Clone** - Full git integration with history
5. **Incremental Updates** - Sync changes from GitHub
6. **Fork Detection** - Detect and link forked repositories

### Performance Improvements
1. **Parallel Fetching** - Fetch multiple files simultaneously
2. **Caching** - Cache repository structures
3. **Streaming** - Stream large files instead of loading all at once
4. **Background Jobs** - Move import to background worker

## Testing

### Manual Testing Checklist

- [ ] Import small repository (< 10 files)
- [ ] Import medium repository (10-100 files)
- [ ] Import large repository (100+ files)
- [ ] Import React project
- [ ] Import Next.js project
- [ ] Import Vue project
- [ ] Import Express project
- [ ] Test invalid URL
- [ ] Test private repository
- [ ] Test non-existent repository
- [ ] Test rate limit handling

### Test Repositories

**Small**:
- https://github.com/octocat/Hello-World

**Medium**:
- https://github.com/airbnb/javascript

**React**:
- https://github.com/facebook/create-react-app

**Next.js**:
- https://github.com/vercel/next-learn

## Troubleshooting

### Issue: Import taking too long

**Solution**:
- Repository is large
- Many files being fetched
- Allow up to 2 minutes for large repos
- Check browser console for progress

### Issue: Some files missing

**Possible causes**:
- Files exceeded 1MB size limit
- Files were filtered (node_modules, etc.)
- Network errors during fetch

**Solution**:
- Check console logs
- Manually add missing files
- Use smaller repository

### Issue: Rate limit exceeded

**Error**: "API rate limit exceeded"

**Solution**:
- Wait 1 hour before trying again
- Add GitHub Personal Access Token (future enhancement)
- Use different IP/network

## Code References

### Server Action
```typescript
// modules/dashboard/actions/index.ts
export const importGitHubRepository = async (repoUrl: string) => {
  // 1. Parse URL
  // 2. Fetch repository info
  // 3. Detect template type
  // 4. Fetch all files recursively
  // 5. Create playground
  // 6. Save files
  // 7. Return success with playground ID
}
```

### Component
```tsx
// modules/dashboard/components/add-repo.tsx
const handleOpenRepo = async () => {
  // 1. Validate URL
  // 2. Show loading toast
  // 3. Call importGitHubRepository()
  // 4. Handle success/error
  // 5. Redirect to playground
}
```

## Security Considerations

### Input Validation
- URL pattern validation
- Repository name sanitization
- File size limits

### API Security
- No authentication tokens exposed
- Public API endpoints only
- Rate limiting protection

### Data Privacy
- Only public repositories can be imported
- No sensitive data stored
- Files stored securely in MongoDB

---

**Feature Status**: ✅ **Active**  
**Version**: 1.0  
**Last Updated**: February 9, 2026  
**Implemented By**: Vibe Code Team
