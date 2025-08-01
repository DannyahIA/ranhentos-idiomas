import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Clock, DollarSign, BookOpen } from 'lucide-react';
import { courseService } from '../services/courseService';
import { Course } from '../types';
import { useApiMutation } from '../hooks/useApi';
import Modal, { ModalBody, ModalFooter, ModalActions, Button } from '../components/Modal';

const Courses: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    // Buscar cursos
    const { data: coursesData, isLoading, error } = useQuery({
        queryKey: ['courses', currentPage],
        queryFn: () => courseService.getCourses(currentPage),
    });

    // Mutation para criar curso
    const createMutation = useApiMutation({
        mutationFn: courseService.createCourse,
        successMessage: 'Curso criado com sucesso!',
        invalidateQueries: ['courses'],
        onSuccess: () => {
            setShowForm(false);
        },
    });

    // Mutation para atualizar curso
    const updateMutation = useApiMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
            courseService.updateCourse(id, data),
        successMessage: 'Curso atualizado com sucesso!',
        invalidateQueries: ['courses'],
        onSuccess: () => {
            setEditingCourse(null);
            setShowForm(false);
        },
    });

    // Mutation para deletar curso
    const deleteMutation = useApiMutation({
        mutationFn: courseService.deleteCourse,
        successMessage: 'Curso excluído com sucesso!',
        invalidateQueries: ['courses'],
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const courseData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            duration_hours: parseInt(formData.get('duration_hours') as string),
            price: parseFloat(formData.get('price') as string),
            status: formData.get('status') as 'active' | 'inactive',
        };

        if (editingCourse) {
            updateMutation.mutate({ id: editingCourse.id, data: courseData });
        } else {
            createMutation.mutate(courseData);
        }
    };

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este curso?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleCloseModal = () => {
        setShowForm(false);
        setEditingCourse(null);
    };

    const filteredCourses = coursesData?.data && Array.isArray(coursesData.data) ?
        coursesData.data.filter(course =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Erro ao carregar cursos</p>
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
                        <h1 className="text-3xl font-bold text-gray-900">Cursos</h1>
                        <p className="mt-2 text-gray-600">Gerencie todos os cursos disponíveis</p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingCourse(null);
                            setShowForm(true);
                        }}
                        className="flex items-center justify-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Curso
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar cursos..."
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
                title={editingCourse ? 'Editar Curso' : 'Novo Curso'}
                subtitle={editingCourse ? 'Atualize as informações do curso' : 'Preencha os dados do novo curso'}
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Curso *</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={editingCourse?.name || ''}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Digite o nome do curso"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                                <textarea
                                    name="description"
                                    defaultValue={editingCourse?.description || ''}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Descreva o curso detalhadamente"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duração (horas) *</label>
                                <input
                                    type="number"
                                    name="duration_hours"
                                    defaultValue={editingCourse?.duration_hours || ''}
                                    required
                                    min="1"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Ex: 40"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    defaultValue={editingCourse?.price || ''}
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
                                    defaultValue={editingCourse?.status || 'active'}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                >
                                    <option value="active">Ativo</option>
                                    <option value="inactive">Inativo</option>
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

            {/* Courses Grid */}
            {isLoading ? (
                <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-gray-600">Carregando cursos...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(course)}
                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar curso"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir curso"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                    {course.duration_hours} horas
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                                    R$ {Number(course.price).toFixed(2)}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${course.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {course.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {coursesData && coursesData.last_page > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="flex flex-wrap justify-center space-x-1 sm:space-x-2">
                        {Array.from({ length: coursesData.last_page }, (_, i) => i + 1).map((page) => (
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
            {!isLoading && filteredCourses.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? 'Nenhum curso encontrado' : 'Nenhum curso cadastrado'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm 
                            ? 'Tente ajustar os termos de busca.'
                            : 'Comece adicionando o primeiro curso ao sistema.'
                        }
                    </p>
                    {!searchTerm && (
                        <Button onClick={() => setShowForm(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Curso
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Courses;
