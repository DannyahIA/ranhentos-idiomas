<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CoursesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            [
                'name' => 'Inglês Básico',
                'description' => 'Curso de inglês para iniciantes com foco em vocabulário básico, gramática fundamental e conversação simples.',
                'duration_hours' => 120,
                'price' => 450.00,
                'max_students' => 15,
                'status' => 'active',
            ],
            [
                'name' => 'Inglês Intermediário',
                'description' => 'Curso de inglês para estudantes com conhecimento básico, aprofundando gramática e desenvolvendo fluência.',
                'duration_hours' => 150,
                'price' => 550.00,
                'max_students' => 12,
                'status' => 'active',
            ],
            [
                'name' => 'Inglês Avançado',
                'description' => 'Curso de inglês avançado com foco em business English, preparação para certificações e conversação fluente.',
                'duration_hours' => 180,
                'price' => 650.00,
                'max_students' => 10,
                'status' => 'active',
            ],
            [
                'name' => 'Espanhol Básico',
                'description' => 'Introdução ao idioma espanhol com ênfase na comunicação cotidiana e cultura hispânica.',
                'duration_hours' => 100,
                'price' => 400.00,
                'max_students' => 15,
                'status' => 'active',
            ],
            [
                'name' => 'Espanhol Intermediário',
                'description' => 'Aprofundamento no idioma espanhol com estudos de literatura e conversação avançada.',
                'duration_hours' => 130,
                'price' => 500.00,
                'max_students' => 12,
                'status' => 'active',
            ],
            [
                'name' => 'Francês Básico',
                'description' => 'Curso introdutório de francês com foco na pronúncia, vocabulário essencial e cultura francesa.',
                'duration_hours' => 110,
                'price' => 480.00,
                'max_students' => 12,
                'status' => 'active',
            ],
            [
                'name' => 'Alemão Básico',
                'description' => 'Introdução ao idioma alemão com ênfase na gramática estruturada e vocabulário técnico.',
                'duration_hours' => 140,
                'price' => 520.00,
                'max_students' => 10,
                'status' => 'inactive', // Curso inativo para testar
            ],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}
