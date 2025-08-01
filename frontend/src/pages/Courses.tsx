import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Clock, DollarSign, BookOpen } from 'lucide-react';
import { courseService } from '../services/courseService';
import { Course } from '../types';

const Courses: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const queryClient = useQueryClient();

    // Buscar cursos
    const { data: coursesData, isLoading, error } = useQuery({
        queryKey: ['courses', currentPage],
        queryFn: () => courseService.getCourses(currentPage),
    });

    // Mutation para criar curso
    const createMutation = useMutation({
        mutationFn: courseService.createCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            setShowForm(false);
        },
    });

    // Mutation para atualizar curso
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
            courseService.updateCourse(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            setEditingCourse(null);
            setShowForm(false);
        },
    });

    // Mutation para deletar curso
    const deleteMutation = useMutation({
        mutationFn: courseService.deleteCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
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

    const filteredCourses = coursesData?.data && Array.isArray(coursesData.data) ?
        coursesData.data.filter(course =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Erro ao carregar cursos</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Cursos</h1>
                        <p className="mt-2 text-gray-600">Gerencie todos os cursos disponíveis</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingCourse(null);
                            setShowForm(true);
                        }}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                        style={{ backgroundColor: '#2563eb', color: '#fff' }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Curso
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar cursos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full max-w-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all">
                        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
                            <h2 className="text-xl font-semibold">
                                {editingCourse ? 'Editar Curso' : 'Novo Curso'}
                            </h2>
                            <p className="text-primary-100 text-sm mt-1">
                                {editingCourse ? 'Atualize as informações do curso' : 'Preencha os dados do novo curso'}
                            </p>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Curso *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={editingCourse?.name || ''}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                                        <textarea
                                            name="description"
                                            defaultValue={editingCourse?.description || ''}
                                            rows={3}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duração (horas) *</label>
                                        <input
                                            type="number"
                                            name="duration_hours"
                                            defaultValue={editingCourse?.duration_hours || ''}
                                            required
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            defaultValue={editingCourse?.price || ''}
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
                                            defaultValue={editingCourse?.status || 'active'}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="active">Ativo</option>
                                            <option value="inactive">Inativo</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingCourse(null);
                                            }}
                                            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={createMutation.isPending || updateMutation.isPending}
                                            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all font-medium shadow-lg"
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

            {/* Courses Grid */}
            {isLoading ? (
                <div className="text-center py-8">
                    <p>Carregando cursos...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(course)}
                                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {course.duration_hours} horas
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    R$ {Number(course.price).toFixed(2)}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`px-2 py-1 text-xs rounded-full ${course.status === 'active'
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

export default Courses;
