export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "tools"
  | "dental";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon?: string;
  level?: SkillLevel;
  description?: string;
  yearsOfExperience?: number;
  order?: number;
}
