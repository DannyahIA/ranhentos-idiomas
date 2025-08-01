// Types para nossa aplicação
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  document_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
  updated_at: string;
  enrollments?: Enrollment[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration_hours: number;
  price: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  enrollments?: Enrollment[];
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  start_date: string;
  price_paid: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  student?: Student;
  course?: Course;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}
