import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';
import { studentService } from '../services/studentService';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';

const Dashboard: React.FC = () => {
  // Buscar dados para o dashboard
  const { data: studentsData } = useQuery({
    queryKey: ['students-dashboard'],
    queryFn: () => studentService.getStudents(1),
  });

  const { data: coursesData } = useQuery({
    queryKey: ['courses-dashboard'],
    queryFn: () => courseService.getCourses(1),
  });

  const { data: enrollmentsData } = useQuery({
    queryKey: ['enrollments-dashboard'],
    queryFn: () => enrollmentService.getEnrollments(1),
  });

  const stats = [
    {
      name: 'Total de Estudantes',
      value: studentsData?.total || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Cursos Disponíveis',
      value: coursesData?.total || 0,
      icon: BookOpen,
      color: 'bg-green-500',
    },
    {
      name: 'Inscrições Ativas',
      value: enrollmentsData?.total || 0,
      icon: UserCheck,
      color: 'bg-purple-500',
    },
    {
      name: 'Taxa de Crescimento',
      value: '15%',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de gestão escolar</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Estudantes Recentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Estudantes Recentes</h3>
          </div>
          <div className="p-6">
            {studentsData?.data && Array.isArray(studentsData.data) ? 
              studentsData.data.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">Carregando estudantes...</p>
              )}
          </div>
        </div>

        {/* Cursos Populares */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Cursos Disponíveis</h3>
          </div>
          <div className="p-6">
            {coursesData?.data && Array.isArray(coursesData.data) ? 
              coursesData.data.slice(0, 5).map((course) => (
                <div key={course.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-500">{course.duration_hours}h - R$ {Number(course.price).toFixed(2)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">Carregando cursos...</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
