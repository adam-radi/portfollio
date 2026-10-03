import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications";
import Projects from "@/components/sections/Projects";
import Faq from "@/components/sections/Faq";
import Reviews from "@/components/sections/Reviews";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getProjects, getExperiences, getSkills, getCertifications, getApprovedReviews } from "@/lib/db/data-fetchers";
import { getLikeCounts } from "@/lib/db/likes";
import type { PublicReview } from "@/types/review";
import { SITE_CONFIG } from "@/lib/constants";
import { buildPersonSchema, buildProfilePageSchema, buildFaqPageSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Adam Radi — Full Stack Developer in Morocco | Next.js, React & Laravel",
  description: SITE_CONFIG.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: `${SITE_CONFIG.url}/`,
    siteName: `${SITE_CONFIG.name} Portfolio`,
    title: "Adam Radi — Full Stack Developer in Morocco",
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Radi — Full Stack Developer in Morocco",
    description: SITE_CONFIG.description,
  },
};

export default async function Home() {
  const [projects, experiences, skills, certifications, reviews] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkills(),
    getCertifications(),
    getApprovedReviews(),
  ]);

  // Batched like counts — one grouped query per content type (no N+1).
  const [projectLikes, skillLikes] = await Promise.all([
    getLikeCounts(
      "PROJECT",
      projects.filter((p) => p.published !== false).map((p) => p.id)
    ),
    getLikeCounts("SKILL", skills.map((s) => s.id)),
  ]);

  // Strip internal fields (id, status, timestamps) before serializing to the client.
  const publicReviews: PublicReview[] = reviews.map(
    ({ name, role, company, content, rating, linkedinUrl, websiteUrl }) => ({
      name,
      role,
      company,
      content,
      rating,
      linkedinUrl,
      websiteUrl,
    })
  );

  return (
    <PageWrapper>
      <JsonLd data={buildPersonSchema()} />
      <JsonLd data={buildProfilePageSchema()} />
      <JsonLd data={buildFaqPageSchema()} />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills initialSkills={skills} likeCounts={skillLikes} />
        <Experience initialExperiences={experiences} />
        <Projects initialProjects={projects} likeCounts={projectLikes} />
        <Certifications initialCertifications={certifications} />
        <Faq />
        <Reviews initialReviews={publicReviews} />
        <Contact />
      </main>
      <Footer />
    </PageWrapper>
  );
}