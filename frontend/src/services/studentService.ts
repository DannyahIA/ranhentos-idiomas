import api from './api';
import { Student, PaginatedResponse, ApiResponse } from '../types';

export const studentService = {
  // Listar estudantes com paginação
  getStudents: async (page: number = 1): Promise<PaginatedResponse<Student>> => {
    const response = await api.get(`/students?page=${page}`);
    return response.data.data; // Acessando o campo 'data' dentro de 'data'
  },

  // Buscar estudante por ID
  getStudent: async (id: string): Promise<ApiResponse<Student>> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Criar novo estudante
  createStudent: async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Student>> => {
    const response = await api.post('/students', student);
    return response.data;
  },

  // Atualizar estudante
  updateStudent: async (id: string, student: Partial<Omit<Student, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Student>> => {
    const response = await api.put(`/students/${id}`, student);
    return response.data;
  },

  // Deletar estudante
  deleteStudent: async (id: string): Promise<void> => {
    await api.delete(`/students/${id}`);
  },
};
