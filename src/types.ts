export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  tags: string[];
  image: string;
  github?: string;
  live?: string;
  features?: string[];
}

export interface Skill {
  name: string;
  category: string;
  level: number; // 0-100
  iconName: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
  bulletPoints: string[];
  tags: string[];
}
