"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";
import { revalidatePath } from "next/cache";

export const toggleStarMarked = async (
  playgroundId: string,
  isChecked: boolean
) => {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error("User Id is Required");
  }

  try {
    if (isChecked) {
      await db.starMark.create({
        data: {
          userId: userId!,
          playgroundId,
          isMarked: isChecked,
        },
      });
    } else {
        await db.starMark.delete({
        where: {
          userId_playgroundId: {
            userId,
            playgroundId: playgroundId,

          },
        },
      });
    }

     revalidatePath("/dashboard");
    return { success: true, isMarked: isChecked };
  } catch (error) {
       console.error("Error updating problem:", error);
    return { success: false, error: "Failed to update problem" };
  }
};

export const getAllPlaygroundForUser = async () => {
  const user = await currentUser();

  try {
    const playground = await db.playground.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        user: true,
        Starmark:{
            where:{
                userId:user?.id!
            },
            select:{
                isMarked:true
            }
        }
      },
    });

    return playground;
  } catch (error) {
    console.log(error);
  }
};

export const createPlayground = async (data: {
  title: string;
  template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
  description?: string;
}) => {
  const user = await currentUser();

  const { template, title, description } = data;

  try {
    const playground = await db.playground.create({
      data: {
        title: title,
        description: description,
        template: template,
        userId: user?.id!,
      },
    });

    return playground;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProjectById = async (id: string) => {
  try {
    await db.playground.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

export const editProjectById = async (
  id: string,
  data: { title: string; description: string | null}
) => {
  try {
    await db.playground.update({
      where: {
        id,
      },
      data: data,
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

export const duplicateProjectById = async (id: string) => {
  try {
    const originalPlayground = await db.playground.findUnique({
      where: { id },
      // todo: add tempalte files
    });
    if (!originalPlayground) {
      throw new Error("Original playground not found");
    }

    await db.playground.create({
      data: {
        title: `${originalPlayground.title} (Copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: originalPlayground.userId,

        // todo: add template files
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error duplicating project:", error);
  }
};

// Helper function to fetch file content from GitHub
async function fetchGitHubFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "VibeCode-Editor",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${path}`);
    }

    const data = await response.json();
    
    if (data.type === "file" && data.content) {
      // GitHub returns base64 encoded content
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    
    return "";
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return "";
  }
}

// Helper function to recursively fetch repository tree
async function fetchGitHubTree(
  owner: string,
  repo: string,
  path: string = ""
): Promise<any> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "VibeCode-Editor",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tree: ${path}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching tree ${path}:`, error);
    return [];
  }
}

// Helper function to convert GitHub tree to file system structure
async function buildFileSystemTree(
  owner: string,
  repo: string,
  items: any[],
  basePath: string = "",
  depth: number = 0,
  skippedFiles: { name: string; reason: string }[] = []
): Promise<{ tree: any; skipped: { name: string; reason: string }[] }> {
  const tree: any = {};

  // Prevent infinite recursion - limit depth to 10 levels
  if (depth > 10) {
    return { tree, skipped: skippedFiles };
  }

  // Filter out only essential items to ignore
  const ignoredItems = [
    ".git",
    "node_modules",
    ".DS_Store",
  ];

  // Optional items that can be skipped but aren't critical
  const optionalIgnored = [
    ".github",
    ".gitignore",
    ".env.example", // Keep example files
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
  ];

  for (const item of items) {
    // Skip critical ignored items
    if (ignoredItems.includes(item.name)) {
      skippedFiles.push({ 
        name: item.path || item.name, 
        reason: `System file/folder (${item.name})`
      });
      continue;
    }

    // Skip optional ignored items (but log them)
    if (optionalIgnored.includes(item.name)) {
      skippedFiles.push({ 
        name: item.path || item.name, 
        reason: `Lock file or config (${item.name})`
      });
      continue;
    }

    const itemPath = basePath ? `${basePath}/${item.name}` : item.name;

    if (item.type === "file") {
      // Increase file size limit to 5MB (more reasonable)
      if (item.size > 5000000) {
        skippedFiles.push({ 
          name: item.path || item.name, 
          reason: `File too large (${(item.size / 1000000).toFixed(2)}MB)`
        });
        continue;
      }

      // Skip binary files that are too large
      const binaryExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip', '.tar', '.gz'];
      const isBinary = binaryExtensions.some(ext => item.name.toLowerCase().endsWith(ext));
      
      if (isBinary && item.size > 500000) { // 500KB limit for binary files
        skippedFiles.push({ 
          name: item.path || item.name, 
          reason: `Binary file too large (${(item.size / 1000).toFixed(2)}KB)`
        });
        continue;
      }

      const content = await fetchGitHubFileContent(owner, repo, item.path);
      
      if (content === "" && item.size > 0) {
        skippedFiles.push({ 
          name: item.path || item.name, 
          reason: "Failed to fetch content"
        });
      }
      
      tree[item.name] = {
        file: {
          contents: content,
        },
      };
    } else if (item.type === "dir") {
      const subItems = await fetchGitHubTree(owner, repo, item.path);
      if (Array.isArray(subItems)) {
        const result = await buildFileSystemTree(
          owner,
          repo,
          subItems,
          itemPath,
          depth + 1,
          skippedFiles
        );
        tree[item.name] = {
          directory: result.tree,
        };
      }
    }
  }

  return { tree, skipped: skippedFiles };
}

export const importGitHubRepository = async (repoUrl: string) => {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Parse GitHub URL
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = repoUrl.match(urlPattern);

    if (!match) {
      throw new Error("Invalid GitHub URL format");
    }

    const owner = match[1];
    let repo = match[2];

    // Remove .git extension if present
    repo = repo.replace(/\.git$/, "");

    // Fetch repository information
    const repoInfoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "VibeCode-Editor",
        },
        cache: "no-store",
      }
    );

    if (!repoInfoResponse.ok) {
      if (repoInfoResponse.status === 404) {
        throw new Error("Repository not found or is private");
      }
      throw new Error("Failed to fetch repository information");
    }

    const repoInfo = await repoInfoResponse.json();

    // Detect template type based on package.json or other indicators
    let template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR" = "REACT";
    
    try {
      const packageJsonContent = await fetchGitHubFileContent(owner, repo, "package.json");
      if (packageJsonContent) {
        const packageJson = JSON.parse(packageJsonContent);
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        if (dependencies["next"]) {
          template = "NEXTJS";
        } else if (dependencies["@angular/core"]) {
          template = "ANGULAR";
        } else if (dependencies["vue"]) {
          template = "VUE";
        } else if (dependencies["hono"]) {
          template = "HONO";
        } else if (dependencies["express"]) {
          template = "EXPRESS";
        } else if (dependencies["react"]) {
          template = "REACT";
        }
      }
    } catch (error) {
      console.log("Could not detect template type, defaulting to REACT");
    }

    // Fetch repository contents
    const rootContents = await fetchGitHubTree(owner, repo);
    
    if (!Array.isArray(rootContents)) {
      throw new Error("Failed to fetch repository contents");
    }

    // Build file system tree
    const { tree: fileSystemTree, skipped: skippedFiles } = await buildFileSystemTree(
      owner, 
      repo, 
      rootContents
    );

    // Create playground
    const playground = await db.playground.create({
      data: {
        title: repoInfo.name || repo,
        description: repoInfo.description || `Imported from ${owner}/${repo}`,
        template: template,
        userId: user.id,
      },
    });

    // Save template files
    await db.templateFile.create({
      data: {
        playgroundId: playground.id,
        content: fileSystemTree,
      },
    });

    revalidatePath("/dashboard");
    
    // Build message with skip information
    let message = `Successfully imported ${owner}/${repo}`;
    if (skippedFiles.length > 0) {
      const skipSummary = skippedFiles.slice(0, 5).map(f => f.name).join(", ");
      const moreCount = skippedFiles.length > 5 ? ` and ${skippedFiles.length - 5} more` : "";
      message += ` (${skippedFiles.length} files skipped: ${skipSummary}${moreCount})`;
    }
    
    return { 
      success: true, 
      playgroundId: playground.id,
      message,
      skippedFiles: skippedFiles.length
    };
  } catch (error: any) {
    console.error("Error importing GitHub repository:", error);
    throw new Error(error.message || "Failed to import repository");
  }
};
