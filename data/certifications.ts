import { Certification } from "@/types/certification";

export const certifications: Certification[] = [
  {
    id: "aws-saa",
    title: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    date: "2024-03",
    credentialUrl: "https://www.credly.com/badges/abc123def456",
    description:
      "Validated expertise in designing distributed systems on AWS, including compute, networking, storage, and security.",
  },
  {
    id: "azure-fund",
    title: "Microsoft Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
    date: "2024-01",
    credentialUrl: "https://www.credly.com/badges/xyz789uvw012",
    description:
      "Foundational knowledge of cloud concepts, Azure services, Azure workloads, security, and privacy.",
  },
  {
    id: "exocad-dental",
    title: "Exocad Dental Suite Certification",
    issuer: "Exocad",
    date: "2023-11",
    credentialUrl: "https://www.exocad.com/certification",
    description:
      "Certified proficiency in dental CAD/CAM software for designing dental restorations and prosthetics.",
  },
  {
    id: "linux-prof",
    title: "Linux Professional Institute Certification (LPIC-1)",
    issuer: "Linux Professional Institute",
    date: "2023-07",
    credentialUrl: "https://www.lpi.org/certifications/lpic-1",
    description:
      "Credentialing for fundamental Linux systems administration skills and knowledge.",
  },
];