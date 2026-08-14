import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MySQL database...\n");

  // ── 1. Admin User ─────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "AdamRadi2026!",
    12
  );

  const adminUser = await prisma.user.upsert({
    where: { email: "adam.radi.2006@gmail.com" },
    update: {},
    create: {
      email: "adam.radi.2006@gmail.com",
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
