export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null; // null = current
  description: string[];
  technologies: string[];
  current?: boolean;
  companyLogo?: string;
  order?: number;
}
