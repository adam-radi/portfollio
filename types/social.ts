import React from "react";
import { LucideIcon } from "lucide-react";

export interface SocialLink {
  id: number | string;
  label: string;
  href: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  hoverColor?: string;
}
