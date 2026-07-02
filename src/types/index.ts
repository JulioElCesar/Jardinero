export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  status: 'active' | 'inactive';
  imageUrl: string;
}

export interface Project {
  id: number;
  title: string;
  client: string;
  description: string;
  category: string;
  status: 'completed' | 'in-progress' | 'pending';
  startDate: string;
  endDate: string;
  budget: number;
  location: string;
  imageUrl: string;
  featured: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  joinDate: string;
  avatar: string;
  specialties: string[];
}

export interface Testimonial {
  id: number;
  author: string;
  company: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'rejected';
  avatar: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft' | 'scheduled';
  publishDate: string;
  views: number;
  imageUrl: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

export interface DashboardStats {
  totalProjects: number;
  activeServices: number;
  teamMembers: number;
  newMessages: number;
  monthlyRevenue: number;
  projectsThisMonth: number;
}
