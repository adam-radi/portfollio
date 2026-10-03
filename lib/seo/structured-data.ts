import { SITE_CONFIG } from "@/lib/constants";
import { certifications } from "@/data/certifications";
import { faqItems, faqAnswerToText } from "@/data/faq";

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
    image: `${SITE_CONFIG.url}/images/adam-radi.jpeg`,
    email: SITE_CONFIG.email,
    jobTitle: "Full Stack Developer",
    description:
      "Adam Radi is a Full Stack Developer in Morocco specializing in Next.js, React, TypeScript, Laravel, IT support, and Exocad CAD.",
    knowsAbout: [
      "Full-Stack Development",
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
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "professional inquiries",
      email: SITE_CONFIG.email,
      areaServed: SITE_CONFIG.serviceArea,
      availableLanguage: ["English", "French", "Arabic"],
    },
    hasCredential: certifications.map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Certification",
      name: cert.title,
      recognizedBy: {
        "@type": "Organization",
        name: cert.issuer,
      },
      ...(cert.credentialUrl && { url: cert.credentialUrl }),
    })),
  };
}

/**
 * BreadcrumbList schema for the /projects archive page.
 */
export function buildProjectsPageBreadcrumb(): JsonLdObject {
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
        item: `${SITE_CONFIG.url}/projects`,
      },
    ],
  };
}

/**
 * CollectionPage + ItemList schema for the /projects archive page.
 */
export function buildProjectsCollectionSchema(
  projects: Array<{ title: string; slug: string; description: string }>
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_CONFIG.url}/projects/#collection`,
    name: "Projects | Adam Radi",
    description: "Explore web applications and software projects developed by Adam Radi.",
    url: `${SITE_CONFIG.url}/projects`,
    isPartOf: {
      "@id": `${SITE_CONFIG.url}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: p.title,
        url: `${SITE_CONFIG.url}/projects/${p.slug}`,
        description: p.description,
      })),
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
 * FAQPage schema for the homepage FAQ section.
 * Built from the exact same data rendered in the visible accordion,
 * so the structured data always matches the on-page content.
 */
export function buildFaqPageSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_CONFIG.url}/#faq`,
    url: SITE_CONFIG.url,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqAnswerToText(item),
      },
    })),
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
  githubUrl: string | null;
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
        item: `${SITE_CONFIG.url}/projects`,
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

/**
 * BreadcrumbList schema for the /insights archive page.
 */
export function buildInsightsPageBreadcrumb(): JsonLdObject {
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
        name: "Insights",
        item: `${SITE_CONFIG.url}/insights`,
      },
    ],
  };
}

/**
 * CollectionPage schema for the /insights archive page.
 */
export function buildInsightsCollectionSchema(
  articles: Array<{ title: string; slug: string; excerpt: string }>
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_CONFIG.url}/insights/#collection`,
    name: "Insights | Adam Radi",
    description:
      "Technical articles and insights on web development, Next.js, Laravel, and building software in Morocco.",
    url: `${SITE_CONFIG.url}/insights`,
    isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((a, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: a.title,
        url: `${SITE_CONFIG.url}/insights/${a.slug}`,
        description: a.excerpt,
      })),
    },
  };
}

/**
 * BreadcrumbList schema for an article detail page.
 */
export function buildArticleBreadcrumb(articleTitle: string, slug: string): JsonLdObject {
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
        name: "Insights",
        item: `${SITE_CONFIG.url}/insights`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: articleTitle,
        item: `${SITE_CONFIG.url}/insights/${slug}`,
      },
    ],
  };
}

/**
 * BlogPosting JSON-LD for a published article page.
 */
export function buildArticleSchema(article: {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  authorName: string;
}): JsonLdObject {
  const url = `${SITE_CONFIG.url}/insights/${article.slug}`;
  const schema: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: article.publishedAt
      ? article.publishedAt.toISOString()
      : article.updatedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      "@id": `${SITE_CONFIG.url}/#person`,
      name: article.authorName || SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Person",
      "@id": `${SITE_CONFIG.url}/#person`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
  };

  if (article.coverImage) {
    schema.image = absUrl(article.coverImage);
  }

  return schema;
}
