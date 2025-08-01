import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService, ReportsData } from '../services/reportService';
import { usePDFGenerator } from '../hooks/usePDFGenerator';
import { Users, BookOpen, UserCheck, DollarSign, Download } from 'lucide-react';

const Reports: React.FC = () => {
    const { generateReportsPDF } = usePDFGenerator();

    const { data: reportsData, isLoading, error } = useQuery<ReportsData>({
        queryKey: ['reports', 'dashboard'],
        queryFn: () => reportService.getDashboardData(),
    });

    const handleGeneratePDF = async () => {
        try {
            await generateReportsPDF();
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar PDF. Tente novamente.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-600">Carregando relatórios...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-red-600">Erro ao carregar relatórios</div>
            </div>
        );
    }

    if (!reportsData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-600">Nenhum dado encontrado</div>
            </div>
        );
    }

    const { stats, popular_courses, monthly_revenue, enrollment_status } = reportsData;

    return (
        <div id="reports-container" className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
                        <p className="mt-2 text-gray-600">Acompanhe o desempenho da escola Ranhentos Idiomas</p>
                    </div>
                    <button
                        onClick={handleGeneratePDF}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                        style={{ backgroundColor: '#2563eb', color: '#fff' }}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar PDF
                    </button>
                </div>
            </div>

            {/* Cards de Estatísticas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total de Estudantes</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_students}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <BookOpen className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total de Cursos</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_courses}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <UserCheck className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total de Inscrições</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_enrollments}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Receita Total</p>
                            <p className="text-2xl font-bold text-gray-900">
                                R$ {stats.total_revenue.toLocaleString('pt-BR')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Status das Inscrições */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Inscrições</h3>
                    <div className="space-y-4">
                        {enrollment_status.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className={`w-4 h-4 rounded-full mr-3 ${item.status === 'Ativo' ? 'bg-green-500' :
                                                item.status === 'Concluído' ? 'bg-blue-500' : 'bg-red-500'
                                            }`}
                                    ></div>
                                    <span className="text-gray-700">{item.status}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-semibold text-gray-900">{item.count}</span>
                                    <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cursos Mais Populares */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cursos Mais Populares</h3>
                    <div className="space-y-4">
                        {popular_courses.map((course, index) => (
                            <div key={course.id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                                    </div>
                                    <span className="text-gray-700">{course.name}</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900">
                                    {course.enrollments_count} inscrições
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Receita Mensal */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita Mensal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    {monthly_revenue.map((month) => (
                        <div key={month.month} className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-600 mb-1">{month.month}</div>
                            <div className="text-lg font-bold text-gray-900">
                                R$ {month.revenue.toLocaleString('pt-BR')}
                            </div>
                            <div className="text-sm text-gray-500">
                                {month.enrollments} inscrições
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;
