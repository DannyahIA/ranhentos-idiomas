import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, User, BookOpen, Calendar } from 'lucide-react';
import { enrollmentService } from '../services/enrollmentService';
import { studentService } from '../services/studentService';
import { courseService } from '../services/courseService';
import { Enrollment } from '../types';
import { useApiMutation } from '../hooks/useApi';
import Modal, { ModalBody, ModalFooter, ModalActions, Button } from '../components/Modal';

const Enrollments: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);

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
    const createMutation = useApiMutation({
        mutationFn: enrollmentService.createEnrollment,
        successMessage: 'Inscrição criada com sucesso!',
        invalidateQueries: ['enrollments'],
        onSuccess: () => {
            setShowForm(false);
        },
    });

    // Mutation para atualizar inscrição
    const updateMutation = useApiMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Enrollment> }) =>
            enrollmentService.updateEnrollment(id, data),
        successMessage: 'Inscrição atualizada com sucesso!',
        invalidateQueries: ['enrollments'],
        onSuccess: () => {
            setEditingEnrollment(null);
            setShowForm(false);
        },
    });

    // Mutation para deletar inscrição
    const deleteMutation = useApiMutation({
        mutationFn: enrollmentService.deleteEnrollment,
        successMessage: 'Inscrição excluída com sucesso!',
        invalidateQueries: ['enrollments'],
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

    const handleCloseModal = () => {
        setShowForm(false);
        setEditingEnrollment(null);
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
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Inscrições</h1>
                        <p className="mt-2 text-gray-600">Gerencie todas as inscrições dos estudantes</p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingEnrollment(null);
                            setShowForm(true);
                        }}
                        className="flex items-center justify-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Inscrição
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por estudante ou curso..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Form Modal */}
            <Modal
                isOpen={showForm}
                onClose={handleCloseModal}
                title={editingEnrollment ? 'Editar Inscrição' : 'Nova Inscrição'}
                subtitle={editingEnrollment ? 'Atualize as informações da inscrição' : 'Preencha os dados da nova inscrição'}
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estudante *</label>
                                <select
                                    name="student_id"
                                    defaultValue={editingEnrollment?.student_id || ''}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Curso *</label>
                                <select
                                    name="course_id"
                                    defaultValue={editingEnrollment?.course_id || ''}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                >
                                    <option value="">Selecione um curso</option>
                                    {coursesData?.data?.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.name} - R$ {Number(course.price).toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início *</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    defaultValue={editingEnrollment?.start_date || new Date().toISOString().split('T')[0]}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Valor Pago (R$) *</label>
                                <input
                                    type="number"
                                    name="price_paid"
                                    defaultValue={editingEnrollment?.price_paid || ''}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Ex: 299.90"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    name="status"
                                    defaultValue={editingEnrollment?.status || 'active'}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                >
                                    <option value="active">Ativo</option>
                                    <option value="completed">Concluído</option>
                                    <option value="cancelled">Cancelado</option>
                                </select>
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <ModalActions>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCloseModal}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="success"
                                loading={createMutation.isPending || updateMutation.isPending}
                            >
                                Salvar
                            </Button>
                        </ModalActions>
                    </ModalFooter>
                </form>
            </Modal>

            {/* Enrollments Table */}
            {isLoading ? (
                <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-gray-600">Carregando inscrições...</p>
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
                                        Valor Pago
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
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <User className="w-5 h-5 text-blue-600" />
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
                                                        {enrollment.course?.duration_hours}h
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                R$ {Number(enrollment.price_paid).toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {new Date(enrollment.start_date).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(enrollment.status)}`}>
                                                {getStatusText(enrollment.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(enrollment)}
                                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar inscrição"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(enrollment.id)}
                                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir inscrição"
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
                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                    currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && filteredEnrollments.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? 'Nenhuma inscrição encontrada' : 'Nenhuma inscrição cadastrada'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm 
                            ? 'Tente ajustar os termos de busca.'
                            : 'Comece criando a primeira inscrição no sistema.'
                        }
                    </p>
                    {!searchTerm && (
                        <Button onClick={() => setShowForm(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Criar Inscrição
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Enrollments;
