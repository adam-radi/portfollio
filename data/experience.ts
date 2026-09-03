import { Experience } from "@/types/experience";

export const experiences: Experience[] = [
  {
    id: "smile-clinic",
    company: "Smile Clinic",
    role: "IT Support & CAD Dental Technician",
    location: "Morocco",
    startDate: "2023-01",
    endDate: null,
    current: true,
    description: [
      "Assure le support informatique complet de la clinique : installation, configuration et maintenance des postes de travail, imprimantes et équipements réseau.",
      "Conception et modélisation de prothèses dentaires numériques (couronnes, bridges, inlays/onlays) à l'aide du logiciel Exocad sur stations CAD/CAM.",
      "Collaboration étroite avec les prothésistes pour garantir la précision et la qualité des restaurations dentaires numériques.",
      "Maintenance préventive et corrective des équipements dentaires (scanner intra-oral, fraiseuse, four de céramique) et informatiques.",
      "Gestion des sauvegardes, de la sécurité des données patients et de l'infrastructure réseau interne.",
    ],
    technologies: ["Exocad", "CAD/CAM", "3D Scanner", "Milling", "IT Support", "Networking", "Windows Server"],
  },
];
