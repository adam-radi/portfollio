export interface FaqAnswerPart {
  text: string;
  href?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: FaqAnswerPart[];
}

export const faqItems: FaqItem[] = [
  {
    id: "what-type-of-developer",
    question: "Quel type de développeur est Adam Radi ?",
    answer: [
      {
        text: "Adam Radi est un développeur Full-Stack spécialisé dans la création d'applications web modernes avec React, Next.js, TypeScript et Laravel. Il accompagne un projet web de la conception jusqu'à la mise en production, en soignant à la fois l'interface utilisateur et l'architecture côté serveur.",
      },
    ],
  },
  {
    id: "technologies-used",
    question: "Quelles technologies utilise Adam Radi ?",
    answer: [
      {
        text: "Son quotidien repose sur React, Next.js, TypeScript, JavaScript, Laravel, PHP, Node.js et MySQL, avec Git et GitHub pour le versionnement. Il travaille avec les technologies web modernes (HTML, CSS, Tailwind CSS, API REST) pour livrer des applications web rapides et maintenables. Le détail est disponible sur la page ",
      },
      { text: "mes compétences techniques", href: "/#skills" },
      { text: "." },
    ],
  },
  {
    id: "custom-web-applications",
    question: "Adam Radi développe-t-il des applications web sur mesure ?",
    answer: [
      {
        text: "Oui. Il développe des solutions adaptées aux besoins spécifiques de chaque projet : analyse du besoin, conception, développement, tests et mise en production. Que le besoin soit un site vitrine ou une application métier complète, la réponse est construite sur mesure plutôt que sur un modèle générique.",
      },
    ],
  },
  {
    id: "project-types",
    question: "Quels types de projets peut-il développer ?",
    answer: [
      {
        text: "Applications web, plateformes métier, dashboards, sites professionnels, portfolios, landing pages, systèmes CRUD et solutions digitales sur mesure. Quelques exemples concrets sont visibles dans ",
      },
      { text: "mes projets Full-Stack", href: "/#projects" },
      { text: "." },
    ],
  },
  {
    id: "react-nextjs-project",
    question: "Adam Radi peut-il travailler sur un projet React ou Next.js ?",
    answer: [
      {
        text: "Oui. Plusieurs de ses projets sont construits en React et Next.js avec TypeScript, en utilisant des architectures frontend/full-stack modernes (SSR, App Router, routage dynamique, API routes). Vous pouvez consulter ",
      },
      { text: "ses réalisations React et Next.js", href: "/#projects" },
      { text: " directement sur le portfolio." },
    ],
  },
  {
    id: "backend-development",
    question: "Peut-il développer le backend d'une application ?",
    answer: [
      {
        text: "Oui. Il développe des backends avec Laravel et PHP ainsi qu'avec Node.js : conception d'API, intégration de bases de données MySQL, authentification et rôles, et architecture backend pensée pour la sécurité et la maintenance dans la durée.",
      },
    ],
  },
  {
    id: "how-to-contact",
    question: "Comment contacter Adam Radi pour un projet ?",
    answer: [
      {
        text: "Le plus simple est de passer par la section ",
      },
      { text: "me contacter pour un projet", href: "/#contact" },
      {
        text: " : formulaire de contact, email direct ou WhatsApp. Une description courte du besoin (objectif, délai, technologies) suffit pour démarrer l'échange.",
      },
    ],
  },
  {
    id: "where-to-find-projects",
    question: "Où trouver les projets réalisés par Adam Radi ?",
    answer: [
      { text: "Les projets sont rassemblés dans la section ", },
      { text: "projets du portfolio", href: "/#projects" },
      {
        text: " ainsi que sur la page dédiée, avec pour chacun une description, les technologies utilisées, le code source GitHub et une démonstration en ligne.",
      },
    ],
  },
  {
    id: "clients-and-companies",
    question: "Adam Radi travaille-t-il avec des clients ou entreprises ?",
    answer: [
      {
        text: "Oui. Il peut intervenir sur des projets web et des solutions digitales pour clients et entreprises selon leurs besoins, en mission ponctuelle ou en collaboration régulière. Son ",
      },
      { text: "expérience professionnelle", href: "/#experience" },
      {
        text: " couvre aussi bien le développement web que l'infrastructure IT et les environnements métier.",
      },
    ],
  },
  {
    id: "location-and-remote",
    question: "Dans quelle région Adam Radi travaille-t-il ?",
    answer: [
      {
        text: "Adam Radi est basé au Maroc (Morocco) et collabore à distance avec des clients partout où le projet le demande. Les échanges se font en français, en anglais ou en arabe, en présentiel au Maroc ou en remote selon la pertinence du projet.",
      },
    ],
  },
];

export function faqAnswerToText(item: FaqItem): string {
  return item.answer.map((part) => part.text).join("");
}
