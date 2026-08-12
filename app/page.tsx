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
import { getProjects, getExperiences, getSkills, getCertifications } from "@/lib/db/data-fetchers";

export default async function Home() {
  const [projects, experiences, skills, certifications] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkills(),
    getCertifications(),
  ]);

  return (
    <PageWrapper>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills initialSkills={skills} />
        <Experience initialExperiences={experiences} />
        <Certifications initialCertifications={certifications} />
        <Projects initialProjects={projects} />
        <Contact />
      </main>
      <Footer />
    </PageWrapper>
  );
}