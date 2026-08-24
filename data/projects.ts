import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "agriflow",
    title: "AgriFlow",
    slug: "agriflow",
    description:
      "A full-stack agricultural marketplace connecting farmers and buyers with real-time inventory, orders, and secure authentication.",
    overview:
      "AgriFlow is a modern digital marketplace built to streamline the buying and selling of agricultural products. It provides farmers a platform to list their produce and buyers a seamless way to discover, filter, and purchase directly from local producers.",
    problem:
      "Farmers in Morocco face challenges reaching buyers beyond their immediate region, while buyers have no reliable digital channel to source fresh agricultural products. The market is fragmented, informal, and lacks traceability.",
    solution:
      "AgriFlow solves this by providing a structured, full-stack marketplace with role-based access (farmer/buyer/admin), real-time inventory management, a secure REST API powered by Laravel Sanctum, and a React/Redux frontend for a smooth user experience.",
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
      "Real-time inventory update and stock alerts",
      "Order management dashboard for both buyers and farmers",
      "Search and filter by category, region, and price range",
      "Secure REST API with token-based authentication",
      "Responsive design optimized for mobile and desktop",
    ],
    challenges: [
      "Designing a robust role-based permission system that scales across three user types",
      "Syncing React Redux state efficiently with the Laravel API without over-fetching",
      "Handling real-time stock updates without WebSockets using polling strategies",
    ],
    lessonsLearned: [
      "The importance of designing the data model before writing any code",
      "Redux Toolkit drastically simplifies API state management with RTK Query",
      "Laravel Sanctum is excellent for SPA authentication when paired with CORS configuration",
    ],
    image: "/images/projects/agriflow.png",
    githubUrl: null,
    liveUrl: null,
    featured: true,
    published: true,
    order: 1,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "ms-car-rent",
    title: "M'S Car Rent",
    slug: "ms-car-rent",
    description:
      "A car rental platform with vehicle browsing, availability calendar, booking management, and an admin dashboard.",
    overview:
      "M'S Car Rent is a full-stack vehicle rental web application that allows customers to browse cars, check availability, make reservations, and manage their bookings. Administrators can manage the fleet, monitor reservations, and generate reports.",
    problem:
      "Traditional car rental businesses rely on phone calls and manual paperwork, leading to double-bookings, poor customer experience, and administrative overhead.",
    solution:
      "M'S Car Rent provides a digital platform with an online booking system, an availability calendar, automated confirmation emails, and a clean admin panel to manage fleet and reservations in real time.",
    technologies: [
      "Laravel",
      "PHP",
      "MySQL",
      "Blade",
      "JavaScript",
      "Tailwind CSS",
      "REST API",
    ],
    features: [
      "Vehicle catalog with filtering by type, capacity, and price",
      "Availability calendar to prevent double-bookings",
      "Online reservation system with booking confirmation",
      "Admin dashboard for fleet and reservation management",
      "Client management with booking history",
      "Responsive layout for mobile users",
    ],
    challenges: [
      "Building a conflict-free availability calendar with date range validation",
      "Securing the admin panel against unauthorized access",
      "Optimizing database queries for filtering large vehicle catalogs",
    ],
    lessonsLearned: [
      "Date range conflict detection requires careful boundary condition handling",
      "Blade templating works well for server-rendered apps but has limitations for interactivity",
      "Proper database indexing is critical for filtering queries at scale",
    ],
    image: "/images/projects/ms-car-rent.png",
    githubUrl: "https://github.com/adam-radi/M.S-car-rent",
    liveUrl: "https://m-s-car-rent1.vercel.app/",
    featured: true,
    published: true,
    order: 2,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];
