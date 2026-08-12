import { Skill } from "@/types/skill";

export const skills: Skill[] = [
  // ─── Frontend ──────────────────────────────────────────
  { id: "react",       name: "React",       category: "frontend", icon: "⚛️",  level: "advanced"     },
  { id: "nextjs",      name: "Next.js",     category: "frontend", icon: "▲",   level: "advanced"     },
  { id: "typescript",  name: "TypeScript",  category: "frontend", icon: "TS",  level: "intermediate" },
  { id: "javascript",  name: "JavaScript",  category: "frontend", icon: "JS",  level: "advanced"     },
  { id: "html",        name: "HTML",        category: "frontend", icon: "🌐",  level: "expert"       },
  { id: "css",         name: "CSS",         category: "frontend", icon: "🎨",  level: "advanced"     },
  { id: "tailwind",    name: "Tailwind",    category: "frontend", icon: "💨",  level: "advanced"     },

  // ─── Backend ───────────────────────────────────────────
  { id: "laravel",     name: "Laravel",     category: "backend",  icon: "🔴",  level: "intermediate" },
  { id: "php",         name: "PHP",         category: "backend",  icon: "🐘",  level: "intermediate" },
  { id: "rest-api",    name: "REST API",    category: "backend",  icon: "🔗",  level: "intermediate" },
  { id: "auth",        name: "Auth",        category: "backend",  icon: "🔒",  level: "intermediate" },

  // ─── Database ──────────────────────────────────────────
  { id: "mysql",       name: "MySQL",       category: "database", icon: "🐬",  level: "intermediate" },
  { id: "sqlite",      name: "SQLite",      category: "database", icon: "🗃️",  level: "intermediate" },

  // ─── DevOps ────────────────────────────────────────────
  { id: "git",         name: "Git",         category: "devops",   icon: "🌿",  level: "advanced"     },
  { id: "github",      name: "GitHub",      category: "devops",   icon: "🐙",  level: "advanced"     },
  { id: "vercel",      name: "Vercel",      category: "devops",   icon: "▲",   level: "intermediate" },
  { id: "linux",       name: "Linux",       category: "devops",   icon: "🐧",  level: "intermediate" },

  // ─── Tools ─────────────────────────────────────────────
  { id: "vscode",      name: "VS Code",     category: "tools",    icon: "💻",  level: "expert"       },
  { id: "postman",     name: "Postman",     category: "tools",    icon: "📬",  level: "intermediate" },
  { id: "figma",       name: "Figma",       category: "tools",    icon: "🖌️",  level: "beginner"     },

  // ─── Dental Technologies ───────────────────────────────
  { id: "exocad",      name: "Exocad",      category: "dental",   icon: "🦷",  level: "advanced"     },
  { id: "cadcam",      name: "CAD/CAM",     category: "dental",   icon: "📐",  level: "advanced"     },
  { id: "3d-scanner",  name: "3D Scanner",  category: "dental",   icon: "🔬",  level: "intermediate" },
  { id: "milling",     name: "Milling",     category: "dental",   icon: "⚙️",  level: "intermediate" },
];
