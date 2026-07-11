export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  profileImage: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: 'fullstack' | 'frontend' | 'backend' | 'api' | 'other';
  techStack: string[];
  images: { url: string; publicId: string }[];
  githubLink: string;
  liveLink: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  icon: string;
  percentage: number;
  category: 'frontend' | 'backend' | 'devops' | 'tools' | 'database';
  order: number;
}

export interface Experience {
  _id: string;
  company: string;
  role: string;
  description: string;
  type: 'experience' | 'education' | 'internship';
  techUsed: string[];
  startDate: string;
  endDate?: string;
  current: boolean;
  order: number;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  featured: boolean;
  order: number;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  order: number;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: { url: string; publicId: string };
  tags: string[];
  published: boolean;
  views: number;
  readTime: number;
  createdAt: string;
}

export interface DashboardStats {
  projects: number;
  skills: number;
  experiences: number;
  testimonials: number;
  services: number;
  messages: number;
  blogs: number;
  unreadMessages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  total?: number;
  pages?: number;
}
