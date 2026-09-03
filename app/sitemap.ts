import { MetadataRoute } from "next";
import { getProjects } from "@/lib/db/data-fetchers";
import { SITE_CONFIG } from "@/lib/constants";

function isRouteSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  const projects = await getProjects();

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((project) => project.published !== false && isRouteSlug(project.slug))
    .map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly",
      priority: project.featured ? 0.8 : 0.6,
    }));

  return [...routes, ...projectRoutes];
}
