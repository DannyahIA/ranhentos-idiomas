import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface DashboardStats {
  total_students: number;
  total_courses: number;
  total_enrollments: number;
  total_revenue: number;
  active_enrollments: number;
  completed_enrollments: number;
  cancelled_enrollments: number;
}

export interface PopularCourse {
  id: string;
  name: string;
  enrollments_count: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  enrollments: number;
}

export interface EnrollmentStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface ReportsData {
  stats: DashboardStats;
  popular_courses: PopularCourse[];
  monthly_revenue: MonthlyRevenue[];
  enrollment_status: EnrollmentStatusData[];
}

class ReportService {
  async getDashboardData(): Promise<ReportsData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/dashboard`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  }

  async getStudentReports(filters?: any): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/students`, {
        params: filters
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar relatórios de estudantes:', error);
      throw error;
    }
  }

  async getCourseReports(filters?: any): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/courses`, {
        params: filters
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar relatórios de cursos:', error);
      throw error;
    }
  }

  async getEnrollmentReports(filters?: any): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/enrollments`, {
        params: filters
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar relatórios de inscrições:', error);
      throw error;
    }
  }

  async getRevenueReports(filters?: any): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/revenue`, {
        params: filters
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar relatórios de receita:', error);
      throw error;
    }
  }
}

export const reportService = new ReportService();
