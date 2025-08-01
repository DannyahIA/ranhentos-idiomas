<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EnrollmentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obter IDs dos estudantes e cursos criados pelos outros seeders
        $students = Student::all();
        $courses = Course::where('status', 'active')->get();

        if ($students->isEmpty() || $courses->isEmpty()) {
            $this->command->info('Nenhum estudante ou curso encontrado. Execute os seeders de estudantes e cursos primeiro.');
            return;
        }

        $enrollments = [
            // Ana Silva
            [
                'student_id' => $students->where('email', 'ana.silva@email.com')->first()->id,
                'course_id' => $courses->where('name', 'Inglês Básico')->first()->id,
                'start_date' => '2024-01-15',
                'price_paid' => 450.00,
                'status' => 'active',
            ],
            [
                'student_id' => $students->where('email', 'ana.silva@email.com')->first()->id,
                'course_id' => $courses->where('name', 'Espanhol Básico')->first()->id,
                'start_date' => '2024-02-01',
                'price_paid' => 400.00,
                'status' => 'active',
            ],

            // Carlos Santos
            [
                'student_id' => $students->where('email', 'carlos.santos@email.com')->first()->id,
                'course_id' => $courses->where('name', 'Inglês Intermediário')->first()->id,
                'start_date' => '2024-01-20',
                'price_paid' => 550.00,
                'status' => 'active',
            ],
            [
                'student_id' => $students->where('email', 'carlos.santos@email.com')->first()->id,
                'course_id' => $courses->where('name', 'Francês Básico')->first()->id,
                'start_date' => '2024-02-15',
                'price_paid' => 480.00,
                'status' => 'active',
            ],

            // Maria Oliveira
            [
                'student_id' => $students->where('email', 'maria.oliveira@email.com')->first()->id,
                'course_id' => $courses->where('name', 'Inglês Avançado')->first()->id,
                'start_date' => '2024-01-10',
                'price_paid' => 650.00,
                'status' => 'completed',
            ],
            [
                'student_id' => $students->where('email', 'maria.oliveira@email.com')->first()->id,
                'course_id' => $courses->where('name', 'Espanhol Intermediário')->first()->id,
                'start_date' => '2024-02-20',
                'price_paid' => 500.00,
                'status' => 'active',
            ],

            // Pedro Costa
            [
                'student_id' => $students->where('email', 'pedro.costa@email.com')->first()->id,
                'course_id' => $courses->where('name', 'Inglês Básico')->first()->id,
                'start_date' => '2024-01-25',
                'price_paid' => 300.00, // Pagamento parcial
                'status' => 'cancelled',
            ],

            // Fernanda Almeida
            [
                'student_id' => $students->where('email', 'fernanda.almeida@email.com')->first()->id,
                'course_id' => $courses->where('name', 'Francês Básico')->first()->id,
                'start_date' => '2024-02-05',
                'price_paid' => 480.00,
                'status' => 'active',
            ],
            [
                'student_id' => $students->where('email', 'fernanda.almeida@email.com')->first()->id,
                'course_id' => $courses->where('name', 'Inglês Intermediário')->first()->id,
                'start_date' => '2024-02-10',
                'price_paid' => 550.00,
                'status' => 'completed',
            ],
        ];

        foreach ($enrollments as $enrollment) {
            Enrollment::create($enrollment);
        }

        $this->command->info('Matrículas criadas com sucesso!');
    }
}
