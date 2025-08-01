import api from './api';

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

// Dados mock para fallback quando a API estiver com problemas
const getMockDashboardData = (): ReportsData => ({
  stats: {
    total_students: 0,
    total_courses: 0,
    total_enrollments: 0,
    total_revenue: 0,
    active_enrollments: 0,
    completed_enrollments: 0,
    cancelled_enrollments: 0,
  },
  popular_courses: [],
  monthly_revenue: [],
  enrollment_status: [],
});

class ReportService {
  async getDashboardData(): Promise<ReportsData> {
    try {
      const response = await api.get('/reports/dashboard');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      
      // Se for erro 500, retornar dados mock e informar sobre o problema
      if (error && typeof error === 'object' && 'status' in error && error.status === 500) {
        console.warn('🚨 Servidor com problemas internos. Verifique os logs do backend.');
        console.warn('📋 Endpoint com problema: GET /api/v1/reports/dashboard');
        console.warn('💡 Sugestão: Verificar se o banco de dados está conectado e se não há erros no código do controller.');
        
        // Retornar dados mock em caso de erro 500
        return getMockDashboardData();
      }
      
      throw error;
    }
  }

  async getStudentReports(filters?: any): Promise<any> {
    try {
      const response = await api.get('/reports/students', {
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
      const response = await api.get('/reports/courses', {
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
      const response = await api.get('/reports/enrollments', {
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
      const response = await api.get('/reports/revenue', {
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
