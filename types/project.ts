export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  problem: string;
  solution: string;
  technologies: string[];
  features: string[];
  challenges: string[];
  lessonsLearned: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  published?: boolean;
  order?: number;
}
