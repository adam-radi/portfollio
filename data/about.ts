export interface AboutStat {
  id: string;
  value: string;
  label: string;
  color?: string;
}

export interface AboutData {
  intro: string;
  story: string[];
  stats: AboutStat[];
}

export const about: AboutData = {
  intro:
    "Full Stack Developer with hands-on experience in IT support and digital dental technologies. I bridge the gap between elegant interfaces and robust systems.",

  story: [
    "I started my journey in tech with a passion for problem-solving — from fixing computers to building web applications from scratch.",
    "Over time, I've developed a multi-disciplinary skill set spanning Full Stack development (React, Next.js, Laravel), IT infrastructure support, and precision dental CAD design using Exocad.",
    "This portfolio itself is built with Next.js App Router — implementing SSR, dynamic routing, and structured data — a reflection of the same standards I bring to every project I build.",
  ],

  stats: [
    {
      id: "projects",
      value: "10+",        // TODO: Update with real count
      label: "Projects Completed",
      color: "text-blue-400",
    },
    {
      id: "technologies",
      value: "20+",        // TODO: Update with real count
      label: "Technologies Used",
      color: "text-cyan-400",
    },
    {
      id: "experience",
      value: "3+",         // TODO: Update with real years
      label: "Years of Learning",
      color: "text-indigo-400",
    },
  ],
};
