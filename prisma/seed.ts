import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MySQL database...\n");

  // ── 1. Admin User ─────────────────────────────────────────────
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD must be set before seeding the database.");
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

  const adminUser = await prisma.user.upsert({
    where: { username: "adamradi" },
    update: {},
    create: {
      email: "radi.adam.2006@gmail.com",
      username: "adamradi",
      name: "Adam Radi",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user:", adminUser.username);

  // ── 2. Projects ───────────────────────────────────────────────
  await prisma.project.upsert({
    where: { slug: "agriflow" },
    update: {},
    create: {
      id: "agriflow",
      title: "AgriFlow",
      slug: "agriflow",
      description:
        "A full-stack agricultural marketplace connecting farmers and buyers with real-time inventory, orders, and secure authentication.",
      overview:
        "AgriFlow is a modern digital marketplace built to streamline the buying and selling of agricultural products. It provides farmers a platform to list their produce and buyers a seamless way to discover, filter, and purchase directly from local producers.",
      problem:
        "Farmers in Morocco face challenges reaching buyers beyond their immediate region, while buyers have no reliable digital channel to source fresh agricultural products.",
      solution:
        "AgriFlow provides a structured marketplace with role-based access, real-time inventory management, a secure REST API powered by Laravel Sanctum, and a React/Redux frontend.",
      technologies: [
        "Laravel",
        "React",
        "TypeScript",
        "MySQL",
        "Sanctum",
        "Redux Toolkit",
        "REST API",
        "Tailwind CSS",
      ],
      features: [
        "Role-based authentication (farmer, buyer, admin) via Laravel Sanctum",
        "Product listing with categories, stock, and pricing management",
        "Order management dashboard for both buyers and farmers",
        "Shopping cart with checkout flow",
        "Admin panel for platform management",
      ],
      challenges: [
        "Designing a clean role-based permission system across Laravel + React",
        "Managing real-time inventory synchronization",
        "Keeping the REST API surface minimal while supporting complex business logic",
      ],
      lessonsLearned: [
        "Feature-based architecture in Laravel scales far better than layer-based",
        "Redux Toolkit significantly simplifies async state management",
        "API Resources are essential for predictable frontend/backend contracts",
      ],
      image: "/images/projects/agriflow.png",
      githubUrl: undefined,
      liveUrl: undefined,
      featured: true,
      order: 0,
    },
  });

  await prisma.project.upsert({
    where: { slug: "ms-car-rent" },
    update: {},
    create: {
      id: "ms-car-rent",
      title: "M'S Car Rent",
      slug: "ms-car-rent",
      description:
        "A multi-role car rental platform with bookings, agency management, car tracking, and multilingual support.",
      overview:
        "M'S Car Rent is a comprehensive car rental management system designed to handle the full lifecycle of vehicle rental — from customer browsing to manager oversight and employee operations.",
      problem:
        "Traditional car rental agencies rely on manual processes and phone calls, making it difficult to scale, track vehicle availability in real-time, or offer a professional digital experience.",
      solution:
        "A web platform with distinct interfaces for visitors, customers, employees, and managers — centralizing bookings, car tracking, agency management, pricing, and multilingual support.",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Prisma",
        "MySQL",
      ],
      features: [
        "Multi-role system: visitor, customer, employee, manager",
        "Branch and agency management",
        "Real-time car availability and location tracking",
        "Daily pricing with promotional discounts",
        "Multilingual support: Arabic, French, English",
        "Booking management with pickup location selection",
        "Notification system for reservations and returns",
      ],
      challenges: [
        "Designing a clean multi-role permission system",
        "Managing multilingual content across Arabic (RTL), French, and English",
        "Handling concurrent booking conflicts",
      ],
      lessonsLearned: [
        "Role-based access control requires careful planning at the schema level",
        "Internationalization with RTL support needs early architectural decisions",
        "Real-time status updates improve user trust significantly",
      ],
      image: "/images/projects/ms-car-rent.png",
      githubUrl: "https://github.com/adam-radi/M.S-car-rent",
      liveUrl: "https://m-s-car-rent1.vercel.app/",
      featured: true,
      order: 1,
    },
  });

  console.log("✅ Seeded 2 projects.");

  // ── 3. Experience ─────────────────────────────────────────────
  await prisma.experience.upsert({
    where: { id: "smile-clinic" },
    update: {},
    create: {
      id: "smile-clinic",
      company: "Smile Clinic",
      role: "IT Support & CAD Dental Technician",
      location: "Maroc",
      startDate: "2023-01",
      endDate: null,
      current: true,
      description: [
        "Assure le support informatique complet de la clinique : installation, configuration et maintenance des postes de travail, imprimantes et équipements réseau.",
        "Conception et modélisation de prothèses dentaires numériques (couronnes, bridges, inlays/onlays) à l'aide du logiciel Exocad sur stations CAD/CAM.",
        "Collaboration étroite avec les prothésistes pour garantir la précision et la qualité des restaurations dentaires numériques.",
        "Maintenance préventive et corrective des équipements dentaires (scanner intra-oral, fraiseuse, four de céramique).",
        "Gestion des sauvegardes, sécurité des données patients et infrastructure réseau interne.",
      ],
      technologies: [
        "Exocad",
        "CAD/CAM",
        "3D Scanner",
        "Milling",
        "IT Support",
        "Networking",
        "Windows Server",
      ],
      order: 0,
    },
  });

  console.log("✅ Seeded 1 experience.");

  // ── 4. Skills ─────────────────────────────────────────────────
  const skillsData = [
    // Frontend
    { id: "react", name: "React", category: "frontend", icon: "⚛️", level: "advanced", order: 0 },
    { id: "nextjs", name: "Next.js", category: "frontend", icon: "▲", level: "advanced", order: 1 },
    { id: "typescript", name: "TypeScript", category: "frontend", icon: "🔷", level: "advanced", order: 2 },
    { id: "tailwind", name: "Tailwind CSS", category: "frontend", icon: "🎨", level: "advanced", order: 3 },
    { id: "html", name: "HTML5", category: "frontend", icon: "🧱", level: "expert", order: 4 },
    { id: "css", name: "CSS3", category: "frontend", icon: "🎨", level: "advanced", order: 5 },
    // Backend
    { id: "laravel", name: "Laravel", category: "backend", icon: "🔴", level: "advanced", order: 6 },
    { id: "php", name: "PHP", category: "backend", icon: "🐘", level: "advanced", order: 7 },
    { id: "nodejs", name: "Node.js", category: "backend", icon: "🟢", level: "intermediate", order: 8 },
    { id: "restapi", name: "REST API", category: "backend", icon: "🔌", level: "advanced", order: 9 },
    // Database
    { id: "mysql", name: "MySQL", category: "database", icon: "🐬", level: "advanced", order: 10 },
    { id: "prisma", name: "Prisma", category: "database", icon: "◆", level: "intermediate", order: 11 },
    // DevOps
    { id: "git", name: "Git", category: "devops", icon: "🌿", level: "advanced", order: 12 },
    { id: "github", name: "GitHub", category: "devops", icon: "🐙", level: "advanced", order: 13 },
    { id: "vercel", name: "Vercel", category: "devops", icon: "▲", level: "intermediate", order: 14 },
    { id: "linux", name: "Linux", category: "devops", icon: "🐧", level: "intermediate", order: 15 },
    // Tools
    { id: "vscode", name: "VS Code", category: "tools", icon: "🔵", level: "expert", order: 16 },
    { id: "postman", name: "Postman", category: "tools", icon: "📮", level: "advanced", order: 17 },
    { id: "figma", name: "Figma", category: "tools", icon: "🎨", level: "intermediate", order: 18 },
    // Dental
    { id: "exocad", name: "Exocad", category: "dental", icon: "🦷", level: "advanced", order: 19 },
    { id: "cadcam", name: "CAD/CAM", category: "dental", icon: "⚙️", level: "advanced", order: 20 },
    { id: "scanner3d", name: "3D Scanner", category: "dental", icon: "📡", level: "intermediate", order: 21 },
  ];

  for (const skill of skillsData) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: {},
      create: skill,
    });
  }

  console.log(`✅ Seeded ${skillsData.length} skills.`);

  // ── 5. Articles (demo / initial content — DRAFT until reviewed) ─
  const articlesData: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    category: string;
    tags: string[];
    status: "DRAFT" | "PUBLISHED";
    publishedAt: Date | null;
    authorName: string;
  }[] = [
    {
      id: "seed-how-to-build-web-app-morocco",
      title: "How to Build a Web App in Morocco: From Idea to Production",
      slug: "how-to-build-a-web-app-in-morocco",
      excerpt:
        "A practical roadmap for shipping a web application in Morocco — choosing a stack, deploying, and reaching users in Arabic, French, and English.",
      content: [
        "<!-- DEMO/INITIAL SEED CONTENT — review and publish from the dashboard -->",
        "",
        "Building a web application in Morocco comes with a few realities that shape every technical decision: users who switch between Arabic, French, and English; mobile-first traffic; and infrastructure that has to stay simple to operate. This is the process I follow when taking a project from idea to a live product.",
        "",
        "## 1. Define the scope before writing code",
        "",
        "The most common failure mode is starting with the framework instead of the problem. Before anything else, write down:",
        "",
        "- The one action the user should be able to complete",
        "- Who the roles are (visitor, customer, admin...)",
        "- What data must be stored and who can see it",
        "",
        "For example, a car rental platform needs four distinct roles — visitor, customer, employee, manager — and each one sees a different interface. Mapping that early prevents expensive rewrites later.",
        "",
        "## 2. Pick a stack you can maintain",
        "",
        "For most projects in Morocco I reach for one of two stacks:",
        "",
        "- **Next.js + TypeScript + Prisma** — great for content-heavy sites, dashboards, and anything that needs SSR for SEO. It deploys to Vercel in minutes and the whole stack is one language.",
        "- **Laravel + React** — the right call for complex business logic, REST APIs, and teams already fluent in PHP. Laravel Sanctum handles authentication cleanly.",
        "",
        "The decision comes down to the domain, not the hype. A marketplace with heavy backend rules fits Laravel; a portfolio, blog, or booking UI fits Next.js.",
        "",
        "## 3. Design for three languages from day one",
        "",
        "Arabic is a right-to-left language, so layout decisions (mirrored navigation, text alignment, directional icons) cannot be bolted on at the end. Store translations as structured data, not hardcoded strings, and test the RTL view at every milestone.",
        "",
        "```ts",
        "// Store language as data, never as concatenated strings",
        'const translations = {',
        '  fr: { book: "Réserver" },',
        '  ar: { book: "احجز" }, // RTL layout required',
        '  en: { book: "Book now" },',
        "};",
        "```",
        "",
        "## 4. Deploy early and often",
        "",
        "I use [Vercel](https://vercel.com) for Next.js applications — push to `main`, get a preview URL, promote to production. For Laravel, a VPS with SSH deploys or a platform like Railway works. The key is to have a production environment running from week one, not week six.",
        "",
        "## 5. Measure what matters",
        "",
        "Once live, watch the basics: page load time, error rate, and whether users actually complete the main action. Everything else is noise until those three are healthy.",
        "",
        "## Where to go next",
        "",
        "If you want to see these ideas applied end-to-end, look at the [projects](/projects) section — [M'S Car Rent](/projects/ms-car-rent) and AgriFlow both follow this exact process. If you have a project in mind, [get in touch](/#contact).",
      ].join("\n"),
      coverImage: null,
      category: "Development",
      tags: ["morocco", "web-development", "nextjs", "laravel"],
      status: "DRAFT",
      publishedAt: null,
      authorName: "Adam Radi",
    },
    {
      id: "seed-nextjs-vs-laravel-morocco",
      title: "Next.js vs Laravel for Moroccan Businesses: A Practical Comparison",
      slug: "nextjs-vs-laravel-for-moroccan-businesses",
      excerpt:
        "Both stacks ship real products in Morocco. Here is how they compare on cost, hiring, SEO, and long-term maintenance — and how to choose.",
      content: [
        "<!-- DEMO/INITIAL SEED CONTENT — review and publish from the dashboard -->",
        "",
        "Choosing between Next.js and Laravel is one of the most common technical decisions a business in Morocco faces. Both are mature, well-documented, and can power a serious product. The right answer depends on what you are building.",
        "",
        "## What each one actually is",
        "",
        "**Laravel** is a PHP backend framework. It owns the server: routing, database, authentication, background jobs. You pair it with a frontend — often React — or render Blade templates.",
        "",
        "**Next.js** is a React framework that spans frontend and backend. Pages are server-rendered for SEO, API routes handle server logic, and Prisma makes database work straightforward.",
        "",
        "## Where Laravel wins",
        "",
        "- **Complex business logic.** Eloquent, queues, jobs, and policies make multi-step workflows (orders, invoices, approvals) easy to reason about.",
        "- **Hiring in Morocco.** PHP/Laravel talent is abundant and affordable locally.",
        "- **Admin-heavy products.** Laravel's ecosystem (Filament, Nova) ships dashboards fast.",
        "",
        "AgriFlow, the agricultural marketplace in my [projects](/projects), uses Laravel with a React frontend — the backend logic around roles, inventory, and orders is simply easier to express in Laravel.",
        "",
        "## Where Next.js wins",
        "",
        "- **SEO and content.** Server rendering and static generation mean pages are fast and indexable out of the box — critical for marketing sites and marketplaces with public listings.",
        "- **One language.** TypeScript across the whole stack means fewer context switches and easier refactoring.",
        "- **Deployment simplicity.** Push to Git, Vercel builds and hosts. No servers to babysit.",
        "",
        "M'S Car Rent ([view project](/projects/ms-car-rent)) is a Next.js application: a booking interface where SEO, multilingual pages, and instant UI feedback mattered more than heavy server workflows.",
        "",
        "## Side-by-side",
        "",
        "| Concern | Next.js | Laravel |",
        "| --- | --- | --- |",
        "| Best for | UI-heavy, SEO-critical apps | Logic-heavy backends |",
        "| Language | TypeScript | PHP |",
        "| Hosting | Vercel (easy) | VPS / platforms (more control) |",
        "| SEO | Built-in SSR/SSG | Needs extra setup |",
        "| Local talent | Growing | Widespread |",
        "",
        "## The decision framework",
        "",
        "Ask three questions:",
        "",
        "1. Is the product's value in **pages and interface** or in **background processes and rules**?",
        "2. Does it need to rank on Google for hundreds of URLs?",
        "3. Who will maintain it in two years?",
        "",
        "If the answers lean interface + SEO + one team, choose Next.js. If they lean workflows + data integrity + PHP talent, choose Laravel. Both are defensible — what hurts is switching halfway.",
        "",
        "## Final thoughts",
        "",
        "The stack is rarely the bottleneck; clarity of scope is. Whichever you pick, ship a small version first. See how both approaches look in practice on the [projects page](/projects), or [reach out](/#contact) to talk through your specific case.",
      ].join("\n"),
      coverImage: null,
      category: "Development",
      tags: ["nextjs", "laravel", "comparison", "morocco"],
      status: "DRAFT",
      publishedAt: null,
      authorName: "Adam Radi",
    },
    {
      id: "seed-car-rental-web-app-case-study",
      title: "How I Built a Car Rental Web Application",
      slug: "how-i-built-a-car-rental-web-application",
      excerpt:
        "A look behind M'S Car Rent: multi-role architecture, multilingual UI, booking conflict handling, and the decisions that shaped the final product.",
      content: [
        "<!-- DEMO/INITIAL SEED CONTENT — review and publish from the dashboard -->",
        "",
        "M'S Car Rent is a full car rental platform covering the whole rental lifecycle: customers browse and book cars, employees manage the fleet, and managers oversee agencies and branches. This post walks through how it was built and the decisions that mattered most. You can see the [live project here](/projects/ms-car-rent).",
        "",
        "## The core problem",
        "",
        "Traditional rental agencies run on phone calls and spreadsheets. Availability is a guess, bookings can double up, and there is no shared source of truth between branches. The application had to replace that with a single system where availability, pricing, and reservations are always current.",
        "",
        "## Architecture: four roles, four experiences",
        "",
        "The defining decision was structuring everything around roles from the start:",
        "",
        "- **Visitor** — browse the fleet, no account required",
        "- **Customer** — book cars, view their reservations, receive notifications",
        "- **Employee** — manage cars, process pickups and returns",
        "- **Manager** — oversee agencies, branches, pricing, and reports",
        "",
        "Rather than scattering permission checks through the UI, role state lives at the schema level and drives what each interface renders. Adding a fifth role later is a data change, not a rewrite.",
        "",
        "## Tech stack",
        "",
        "The stack is deliberately boring: Next.js with React and TypeScript on the front, Tailwind CSS for styling, and Prisma with MySQL for persistence. [Next.js](https://nextjs.org) gives server rendering for public pages (good for SEO on car listings) and API routes for mutations, while Prisma keeps the data layer type-safe end to end.",
        "",
        "```ts",
        "// Prisma makes booking queries type-safe across the whole app",
        "const availableCars = await prisma.car.findMany({",
        "  where: { status: \"AVAILABLE\", bookings: { none: overlap } },",
        "});",
        "```",
        "",
        "## Handling the hard parts",
        "",
        "### Booking conflicts",
        "",
        "Two customers must never hold the same car for overlapping dates. The check runs against existing reservations before a booking is created, so a car is only offered when no existing reservation overlaps the requested range.",
        "",
        "### Multilingual content (Arabic, French, English)",
        "",
        "The app ships in Arabic, French, and English. Arabic requires a right-to-left layout, so directionality is handled globally rather than per-component — mirrored navigation, text alignment, and icon placement flip together. All strings live in translation files, so adding a language never touches component code.",
        "",
        "### Fleet and agency management",
        "",
        "Cars belong to branches, branches belong to agencies. That hierarchy makes it possible to answer operational questions like \"which cars are free at this branch next week?\" with a single query.",
        "",
        "## What I learned",
        "",
        "1. **Roles at the schema level pay off immediately** — permissions stay consistent across every screen.",
        "2. **Internationalization must be an early architectural decision** — retrofitting RTL is painful.",
        "3. **Real-time status builds trust** — seeing a car flip from available to reserved instantly reassures the customer.",
        "",
        "## Wrapping up",
        "",
        "The full feature list, stack, and screenshots are on the [M'S Car Rent project page](/projects/ms-car-rent). If you are planning something similar, browse the [other projects](/projects) or [send a message](/#contact).",
      ].join("\n"),
      coverImage: null,
      category: "Case Study",
      tags: ["nextjs", "prisma", "case-study", "car-rental"],
      status: "DRAFT",
      publishedAt: null,
      authorName: "Adam Radi",
    },
  ];

  for (const article of articlesData) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  console.log(
    `✅ Seeded ${articlesData.length} articles as DRAFT (demo content — review & publish from /dashboard/articles).`
  );
  console.log("\n🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
