<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    /**
     * Total investido por aluno
     */
    public function totalByStudent(): JsonResponse
    {
        $studentTotals = Student::select('students.*')
            ->selectRaw('COALESCE(SUM(enrollments.price_paid), 0) as total_invested')
            ->leftJoin('enrollments', 'students.id', '=', 'enrollments.student_id')
            ->groupBy('students.id', 'students.name', 'students.email', 'students.phone', 'students.birth_date', 'students.document_number', 'students.address', 'students.city', 'students.state', 'students.zip_code', 'students.created_at', 'students.updated_at', 'students.deleted_at')
            ->orderByDesc('total_invested')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $studentTotals,
            'title' => 'Total Investido por Aluno'
        ]);
    }

    /**
     * Cursos com mais alunos
     */
    public function coursesWithMostStudents(): JsonResponse
    {
        $coursesWithStudentCount = Course::select('courses.*')
            ->selectRaw('COUNT(enrollments.id) as student_count')
            ->leftJoin('enrollments', function($join) {
                $join->on('courses.id', '=', 'enrollments.course_id')
                     ->where('enrollments.status', '=', Enrollment::STATUS_ACTIVE);
            })
            ->groupBy('courses.id', 'courses.name', 'courses.description', 'courses.duration_hours', 'courses.price', 'courses.max_students', 'courses.status', 'courses.created_at', 'courses.updated_at', 'courses.deleted_at')
            ->orderByDesc('student_count')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $coursesWithStudentCount,
            'title' => 'Cursos com Mais Alunos'
        ]);
    }

    /**
     * Faturamento total por curso
     */
    public function revenuePerCourse(): JsonResponse
    {
        $courseRevenue = Course::select('courses.*')
            ->selectRaw('COALESCE(SUM(enrollments.price_paid), 0) as total_revenue')
            ->selectRaw('COUNT(enrollments.id) as total_enrollments')
            ->leftJoin('enrollments', 'courses.id', '=', 'enrollments.course_id')
            ->groupBy('courses.id', 'courses.name', 'courses.description', 'courses.duration_hours', 'courses.price', 'courses.max_students', 'courses.status', 'courses.created_at', 'courses.updated_at', 'courses.deleted_at')
            ->orderByDesc('total_revenue')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $courseRevenue,
            'title' => 'Faturamento Total por Curso'
        ]);
    }

    /**
     * Resumo geral
     */
    public function summary(): JsonResponse
    {
        $totalStudents = Student::count();
        $totalCourses = Course::count();
        $totalEnrollments = Enrollment::count();
        $activeEnrollments = Enrollment::where('status', Enrollment::STATUS_ACTIVE)->count();
        $totalRevenue = Enrollment::sum('price_paid');
        $averageRevenuePerStudent = $totalStudents > 0 ? $totalRevenue / $totalStudents : 0;

        // Curso mais popular
        $mostPopularCourse = Course::select('courses.*')
            ->selectRaw('COUNT(enrollments.id) as student_count')
            ->leftJoin('enrollments', 'courses.id', '=', 'enrollments.course_id')
            ->groupBy('courses.id', 'courses.name', 'courses.description', 'courses.duration_hours', 'courses.price', 'courses.max_students', 'courses.status', 'courses.created_at', 'courses.updated_at', 'courses.deleted_at')
            ->orderByDesc('student_count')
            ->first();

        // Aluno que mais investiu
        $topInvestor = Student::select('students.*')
            ->selectRaw('COALESCE(SUM(enrollments.price_paid), 0) as total_invested')
            ->leftJoin('enrollments', 'students.id', '=', 'enrollments.student_id')
            ->groupBy('students.id', 'students.name', 'students.email', 'students.phone', 'students.birth_date', 'students.document_number', 'students.address', 'students.city', 'students.state', 'students.zip_code', 'students.created_at', 'students.updated_at', 'students.deleted_at')
            ->orderByDesc('total_invested')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'total_students' => $totalStudents,
                'total_courses' => $totalCourses,
                'total_enrollments' => $totalEnrollments,
                'active_enrollments' => $activeEnrollments,
                'total_revenue' => $totalRevenue,
                'average_revenue_per_student' => round($averageRevenuePerStudent, 2),
                'most_popular_course' => $mostPopularCourse,
                'top_investor' => $topInvestor,
            ],
            'title' => 'Resumo Geral'
        ]);
    }

    /**
     * Dashboard data with structured format for frontend
     */
    public function dashboard(): JsonResponse
    {
        try {
            // Stats básicas
            $totalStudents = Student::count();
            $totalCourses = Course::count();
            $totalEnrollments = Enrollment::count();
            $activeEnrollments = Enrollment::where('status', Enrollment::STATUS_ACTIVE)->count();
            $completedEnrollments = Enrollment::where('status', Enrollment::STATUS_COMPLETED)->count();
            $cancelledEnrollments = Enrollment::where('status', Enrollment::STATUS_CANCELLED)->count();
            $totalRevenue = Enrollment::sum('price_paid') ?? 0;

            // Cursos populares (top 5) - Versão compatível com PostgreSQL
            $popularCourses = Course::select('courses.id', 'courses.name')
                ->selectRaw('COUNT(enrollments.id) as enrollments_count')
                ->leftJoin('enrollments', 'courses.id', '=', 'enrollments.course_id')
                ->groupBy('courses.id', 'courses.name')
                ->orderByDesc('enrollments_count')
                ->limit(5)
                ->get();

            // Receita mensal (últimos 6 meses) - Compatível com diferentes bancos
            $dbDriver = config('database.default');
            $connection = config("database.connections.{$dbDriver}.driver");
            
            if ($connection === 'pgsql') {
                // PostgreSQL
                $monthlyRevenue = Enrollment::select(
                        DB::raw('TO_CHAR(created_at, \'YYYY-MM\') as month'),
                        DB::raw('SUM(price_paid) as revenue'),
                        DB::raw('COUNT(*) as enrollments')
                    )
                    ->where('created_at', '>=', now()->subMonths(6))
                    ->groupBy('month')
                    ->orderBy('month')
                    ->get();
            } else {
                // SQLite e MySQL
                $monthlyRevenue = Enrollment::select(
                        DB::raw('STRFTIME(\'%Y-%m\', created_at) as month'),
                        DB::raw('SUM(price_paid) as revenue'),
                        DB::raw('COUNT(*) as enrollments')
                    )
                    ->where('created_at', '>=', now()->subMonths(6))
                    ->groupBy('month')
                    ->orderBy('month')
                    ->get();
            }

            // Status das inscrições
            $enrollmentStatus = [
                ['status' => 'Ativo', 'count' => $activeEnrollments, 'percentage' => $totalEnrollments > 0 ? round(($activeEnrollments / $totalEnrollments) * 100, 1) : 0],
                ['status' => 'Concluído', 'count' => $completedEnrollments, 'percentage' => $totalEnrollments > 0 ? round(($completedEnrollments / $totalEnrollments) * 100, 1) : 0],
                ['status' => 'Cancelado', 'count' => $cancelledEnrollments, 'percentage' => $totalEnrollments > 0 ? round(($cancelledEnrollments / $totalEnrollments) * 100, 1) : 0],
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => [
                        'total_students' => $totalStudents,
                        'total_courses' => $totalCourses,
                        'total_enrollments' => $totalEnrollments,
                        'total_revenue' => $totalRevenue,
                        'active_enrollments' => $activeEnrollments,
                        'completed_enrollments' => $completedEnrollments,
                        'cancelled_enrollments' => $cancelledEnrollments,
                    ],
                    'popular_courses' => $popularCourses,
                    'monthly_revenue' => $monthlyRevenue,
                    'enrollment_status' => $enrollmentStatus,
                ]
            ]);

        } catch (\Exception $e) {
            // Log detalhado do erro
            Log::error('Dashboard error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            // Retornar dados padrão em caso de erro
            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => [
                        'total_students' => 0,
                        'total_courses' => 0,
                        'total_enrollments' => 0,
                        'total_revenue' => 0,
                        'active_enrollments' => 0,
                        'completed_enrollments' => 0,
                        'cancelled_enrollments' => 0,
                    ],
                    'popular_courses' => [],
                    'monthly_revenue' => [],
                    'enrollment_status' => [
                        ['status' => 'Ativo', 'count' => 0, 'percentage' => 0],
                        ['status' => 'Concluído', 'count' => 0, 'percentage' => 0],
                        ['status' => 'Cancelado', 'count' => 0, 'percentage' => 0],
                    ],
                ]
            ]);
        }
    }
}
