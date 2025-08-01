import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, User, BookOpen, Calendar } from 'lucide-react';
import { enrollmentService } from '../services/enrollmentService';
import { studentService } from '../services/studentService';
import { courseService } from '../services/courseService';
import { Enrollment } from '../types';

const Enrollments: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);

    const queryClient = useQueryClient();

    // Buscar inscrições
    const { data: enrollmentsData, isLoading, error } = useQuery({
        queryKey: ['enrollments', currentPage],
        queryFn: () => enrollmentService.getEnrollments(currentPage),
    });

    // Buscar estudantes para o formulário
    const { data: studentsData } = useQuery({
        queryKey: ['students-for-enrollment'],
        queryFn: () => studentService.getStudents(1),
        enabled: showForm,
    });

    // Buscar cursos para o formulário
    const { data: coursesData } = useQuery({
        queryKey: ['courses-for-enrollment'],
        queryFn: () => courseService.getCourses(1),
        enabled: showForm,
    });

    // Mutation para criar inscrição
    const createMutation = useMutation({
        mutationFn: enrollmentService.createEnrollment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            setShowForm(false);
        },
    });

    // Mutation para atualizar inscrição
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Enrollment> }) =>
            enrollmentService.updateEnrollment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            setEditingEnrollment(null);
            setShowForm(false);
        },
    });

    // Mutation para deletar inscrição
    const deleteMutation = useMutation({
        mutationFn: enrollmentService.deleteEnrollment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
        },
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const enrollmentData = {
            student_id: formData.get('student_id') as string,
            course_id: formData.get('course_id') as string,
            start_date: formData.get('start_date') as string,
            price_paid: parseFloat(formData.get('price_paid') as string),
            status: formData.get('status') as 'active' | 'completed' | 'cancelled',
        };

        if (editingEnrollment) {
            updateMutation.mutate({ id: editingEnrollment.id, data: enrollmentData });
        } else {
            createMutation.mutate(enrollmentData);
        }
    };

    const handleEdit = (enrollment: Enrollment) => {
        setEditingEnrollment(enrollment);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta inscrição?')) {
            deleteMutation.mutate(id);
        }
    };

    const filteredEnrollments = enrollmentsData?.data && Array.isArray(enrollmentsData.data) ?
        enrollmentsData.data.filter(enrollment =>
            enrollment.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enrollment.course?.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'Ativo';
            case 'completed':
                return 'Concluído';
            case 'cancelled':
                return 'Cancelado';
            default:
                return status;
        }
    };

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Erro ao carregar inscrições</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Inscrições</h1>
                        <p className="mt-2 text-gray-600">Gerencie todas as inscrições dos estudantes</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingEnrollment(null);
                            setShowForm(true);
                        }}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                        style={{ backgroundColor: '#2563eb', color: '#fff' }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Inscrição
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por estudante ou curso..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all">
                        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
                            <h2 className="text-xl font-semibold">
                                {editingEnrollment ? 'Editar Inscrição' : 'Nova Inscrição'}
                            </h2>
                            <p className="text-primary-100 text-sm mt-1">
                                {editingEnrollment ? 'Atualize as informações da inscrição' : 'Preencha os dados da nova inscrição'}
                            </p>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estudante *</label>
                                        <select
                                            name="student_id"
                                            defaultValue={editingEnrollment?.student_id || ''}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="">Selecione um estudante</option>
                                            {studentsData?.data?.map((student) => (
                                                <option key={student.id} value={student.id}>
                                                    {student.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Curso *</label>
                                        <select
                                            name="course_id"
                                            defaultValue={editingEnrollment?.course_id || ''}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="">Selecione um curso</option>
                                            {coursesData?.data?.map((course) => (
                                                <option key={course.id} value={course.id}>
                                                    {course.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início *</label>
                                        <input
                                            type="date"
                                            name="start_date"
                                            defaultValue={editingEnrollment?.start_date || new Date().toISOString().split('T')[0]}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor Pago (R$)</label>
                                        <input
                                            type="number"
                                            name="price_paid"
                                            defaultValue={editingEnrollment?.price_paid || ''}
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            name="status"
                                            defaultValue={editingEnrollment?.status || 'active'}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="active">Ativo</option>
                                            <option value="completed">Concluído</option>
                                            <option value="cancelled">Cancelado</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingEnrollment(null);
                                            }}
                                            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={createMutation.isPending || updateMutation.isPending}
                                            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 transition-all font-medium shadow-lg"
                                        >
                                            {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Enrollments List */}
            {isLoading ? (
                <div className="text-center py-8">
                    <p>Carregando inscrições...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estudante
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Curso
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Data de Início
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredEnrollments.map((enrollment) => (
                                    <tr key={enrollment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                                    <User className="w-5 h-5 text-primary-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {enrollment.student?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {enrollment.student?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <BookOpen className="w-5 h-5 text-green-600 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {enrollment.course?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        R$ {enrollment.course?.price ? Number(enrollment.course.price).toFixed(2) : '0.00'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {new Date(enrollment.start_date).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(enrollment.status)}`}>
                                                {getStatusText(enrollment.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(enrollment)}
                                                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(enrollment.id)}
                                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {enrollmentsData && enrollmentsData.last_page > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="flex flex-wrap justify-center space-x-1 sm:space-x-2">
                        {Array.from({ length: enrollmentsData.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-2 sm:px-3 py-2 rounded text-sm sm:text-base mb-1 ${currentPage === page
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Enrollments;
