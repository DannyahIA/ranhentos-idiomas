import api from './api';
import { Course, PaginatedResponse, ApiResponse } from '../types';

export const courseService = {
  // Listar cursos com paginação
  getCourses: async (page: number = 1): Promise<PaginatedResponse<Course>> => {
    const response = await api.get(`/courses?page=${page}`);
    return response.data.data; // Acessando o campo 'data' dentro de 'data'
  },

  // Buscar curso por ID
  getCourse: async (id: string): Promise<ApiResponse<Course>> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Criar novo curso
  createCourse: async (course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Course>> => {
    const response = await api.post('/courses', course);
    return response.data;
  },

  // Atualizar curso
  updateCourse: async (id: string, course: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Course>> => {
    const response = await api.put(`/courses/${id}`, course);
    return response.data;
  },

  // Deletar curso
  deleteCourse: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },
};
