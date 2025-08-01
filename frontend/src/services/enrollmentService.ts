import api from './api';
import { Enrollment, PaginatedResponse, ApiResponse } from '../types';

export const enrollmentService = {
  // Listar inscrições com paginação
  getEnrollments: async (page: number = 1): Promise<PaginatedResponse<Enrollment>> => {
    const response = await api.get(`/enrollments?page=${page}`);
    return response.data.data; // Acessando o campo 'data' dentro de 'data'
  },

  // Buscar inscrição por ID
  getEnrollment: async (id: string): Promise<ApiResponse<Enrollment>> => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data;
  },

  // Criar nova inscrição
  createEnrollment: async (enrollment: Omit<Enrollment, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Enrollment>> => {
    const response = await api.post('/enrollments', enrollment);
    return response.data;
  },

  // Atualizar inscrição
  updateEnrollment: async (id: string, enrollment: Partial<Omit<Enrollment, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Enrollment>> => {
    const response = await api.put(`/enrollments/${id}`, enrollment);
    return response.data;
  },

  // Deletar inscrição
  deleteEnrollment: async (id: string): Promise<void> => {
    await api.delete(`/enrollments/${id}`);
  },
};
