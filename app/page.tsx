import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getProjects, getExperiences, getSkills, getCertifications } from "@/lib/db/data-fetchers";
import { SITE_CONFIG } from "@/lib/constants";
import { buildPersonSchema, buildProfilePageSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Full Stack Developer in Morocco — Next.js, React & Laravel",
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
  const [projects, experiences, skills, certifications] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkills(),
    getCertifications(),
  ]);

  return (
    <PageWrapper>
      <JsonLd data={buildPersonSchema()} />
      <JsonLd data={buildProfilePageSchema()} />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills initialSkills={skills} />
        <Experience initialExperiences={experiences} />
        <Projects initialProjects={projects} />
        <Certifications initialCertifications={certifications} />
        
        <Contact />
      </main>
      <Footer />
    </PageWrapper>
  );
}