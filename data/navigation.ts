import { NavItem } from "@/types/navigation";

export interface NavItemExtended extends NavItem {
  id: string;
}

export const navigationLinks: NavItemExtended[] = [
  { id: "hero", label: "Home", href: "#hero" },
  { id: "about", label: "About", href: "#about" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "certifications", label: "Certifications", href: "#certifications" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export const navigation = navigationLinks;
