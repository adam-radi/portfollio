import { SITE_CONFIG } from "@/lib/constants";

type JsonLdObject = Record<string, unknown>;

function absUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_CONFIG.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Person schema — built exclusively from real data available in the project.
 * No invented employers, addresses, awards or profiles.
 */
export function buildPersonSchema(): JsonLdObject {
  const sameAs: string[] = [];
  if (SITE_CONFIG.socials.github) sameAs.push(SITE_CONFIG.socials.github);
  if (SITE_CONFIG.socials.linkedin) sameAs.push(SITE_CONFIG.socials.linkedin);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_CONFIG.url}/#person`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    jobTitle: "Full Stack Developer",
    description:
      "Adam Radi is a Full Stack Developer based in Morocco, specializing in modern web application development with Next.js, React, TypeScript and Laravel, IT infrastructure support, and digital dental CAD design with Exocad.",
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "Laravel",
      "PHP",
      "MySQL",
      "REST API",
      "Tailwind CSS",
      "Git",
      "Linux",
      "Exocad",
      "CAD/CAM",
      "3D Scanning",
    ],
    ...(sameAs.length > 0 && { sameAs }),
    address: {
      "@type": "PostalAddress",
      addressCountry: SITE_CONFIG.countryCode,
    },
  };
}

/**
 * WebSite schema for site-wide structured data.
 */
export function buildWebsiteSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    name: `${SITE_CONFIG.name} Portfolio`,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: "en",
    author: {
      "@id": `${SITE_CONFIG.url}/#person`,
    },
    publisher: {
      "@id": `${SITE_CONFIG.url}/#person`,
    },
  };
}

/**
 * ProfilePage + WebPage schema for the homepage.
 */
export function buildProfilePageSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_CONFIG.url}/#profile`,
    name: `${SITE_CONFIG.name} — Full Stack Developer Portfolio`,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: "en",
    isPartOf: {
      "@id": `${SITE_CONFIG.url}/#website`,
    },
    mainEntity: {
      "@id": `${SITE_CONFIG.url}/#person`,
    },
  };
}

/**
 * SoftwareSourceCode schema for a project page.
 */
export function buildProjectSchema(project: {
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
}): JsonLdObject {
  const url = `${SITE_CONFIG.url}/projects/${project.slug}`;
  const programmingLanguage = project.technologies
    .filter((tech) => /javascript|typescript|php|python|java|go|ruby|dart|swift/i.test(tech))
    .map((tech) => (tech.toLowerCase() === "js" ? "JavaScript" : tech));

  const schema: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    url,
    description: project.description,
    inLanguage: "en",
    ...(programmingLanguage.length > 0 && { programmingLanguage }),
    ...(project.technologies.length > 0 && {
      keywords: project.technologies.join(", "),
    }),
    author: {
      "@id": `${SITE_CONFIG.url}/#person`,
    },
  };

  if (project.githubUrl) schema.codeRepository = absUrl(project.githubUrl);

  return schema;
}

/**
 * BreadcrumbList schema for a project page.
 */
export function buildProjectBreadcrumb(projectTitle: string, slug: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${SITE_CONFIG.url}/#projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: projectTitle,
        item: `${SITE_CONFIG.url}/projects/${slug}`,
      },
    ],
  };
}