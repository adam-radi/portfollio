import { getProjects, getPublishedArticles } from "@/lib/db/data-fetchers";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 3600;

const BASE = SITE_CONFIG.url;

function isRouteSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function clean(value: string | null | undefined, max = 240): string {
  const text = (value ?? "")
    .replace(/[\u0000-\u001F\u007F\uFFFD]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function link(path: string): string {
  return `${BASE}${path}`;
}

function bullet(url: string, title: string, description: string): string {
  return `- [${title}](${url}): ${description}`;
}

export async function GET() {
  const [projects, articles] = await Promise.all([
    getProjects(),
    getPublishedArticles(),
  ]);

  const publishedProjects = projects.filter(
    (project) => project.published !== false && isRouteSlug(project.slug)
  );
  const publishedArticles = articles.filter((article) => isRouteSlug(article.slug));

  const lines: string[] = [
    `# ${SITE_CONFIG.name} — Full-Stack Developer, IT Specialist & CAD Designer`,
    "",
    `> ${clean(SITE_CONFIG.description, 400)}`,
    ">",
    "> Available for freelance and remote work from Morocco, in French, English or Arabic.",
    "",
    "## Pages",
    "",
    bullet(link("/"), "Home", "hero, about, skills, experience, projects, certifications and contact form."),
    bullet(link("/projects"), "Projects", "all case studies with problem, solution, tech stack, GitHub and live demo."),
    bullet(link("/insights"), "Insights", "technical articles on web development, Next.js, Laravel and building software in Morocco."),
    bullet(link("/#about"), "About", "background, story and key stats."),
    bullet(link("/#skills"), "Skills", "technical stack with categories and proficiency levels."),
    bullet(link("/#experience"), "Experience", "professional history including IT support and dental CAD design."),
    bullet(link("/#contact"), "Contact", "contact form, email and social links."),
    bullet(`${BASE}/sitemap.xml`, "Sitemap", "every indexable URL on this site."),
    "",
    "## Projects",
    "",
    ...(publishedProjects.length > 0
      ? publishedProjects.map((project) =>
          bullet(
            link(`/projects/${project.slug}`),
            clean(project.title, 80),
            `${clean(project.description || project.overview)}` +
              (project.technologies.length > 0
                ? ` Stack: ${clean(project.technologies.join(", "), 160)}.`
                : "") +
              (project.liveUrl ? ` Live: ${project.liveUrl}` : "")
          )
        )
      : [`- [Projects](${link("/projects")}): project index.`]),
    "",
    "## Insights",
    "",
    ...(publishedArticles.length > 0
      ? publishedArticles.map((article) =>
          bullet(
            link(`/insights/${article.slug}`),
            clean(article.title, 120),
            `${clean(article.category, 40)} — ${clean(article.excerpt)}`
          )
        )
      : ["- No published articles at the moment."]),
    "",
    "## Services & Stack",
    "",
    "- Custom web applications: React, Next.js (App Router, SSR), TypeScript, Tailwind CSS.",
    "- Backend & APIs: Laravel, PHP, Node.js, REST APIs, MySQL, Prisma, authentication and role-based access.",
    "- IT support: workstation setup, networking, maintenance, backups and data security.",
    "- CAD design: Exocad digital dental prosthetics on CAD/CAM stations.",
    "",
    "## Contact",
    "",
    `- Email: ${SITE_CONFIG.email}`,
    `- GitHub: ${SITE_CONFIG.socials.github}`,
    `- LinkedIn: ${SITE_CONFIG.socials.linkedin}`,
    `- Location: ${SITE_CONFIG.location} (remote worldwide)`,
    "",
    "## Optional",
    "",
    `- [llms.txt](${BASE}/llms.txt): this summary file.`,
    `- [CV (PDF)](${link("/cv/adam-radi-cv.pdf")}): curriculum vitae of ${SITE_CONFIG.name}.`,
    "",
    "This file is generated automatically from site content and follows the llmstxt.org format.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
