<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = [
            [
                'name' => 'Ana Silva',
                'email' => 'ana.silva@email.com',
                'phone' => '(11) 99999-1111',
                'birth_date' => '1995-05-15',
                'document_number' => '123.456.789-01',
                'address' => 'Rua das Flores, 123',
                'city' => 'São Paulo',
                'state' => 'SP',
                'zip_code' => '01234-567',
            ],
            [
                'name' => 'Carlos Santos',
                'email' => 'carlos.santos@email.com',
                'phone' => '(11) 99999-2222',
                'birth_date' => '1988-08-22',
                'document_number' => '234.567.890-12',
                'address' => 'Av. Paulista, 456',
                'city' => 'São Paulo',
                'state' => 'SP',
                'zip_code' => '01310-100',
            ],
            [
                'name' => 'Maria Oliveira',
                'email' => 'maria.oliveira@email.com',
                'phone' => '(21) 99999-3333',
                'birth_date' => '1992-12-03',
                'document_number' => '345.678.901-23',
                'address' => 'Rua Copacabana, 789',
                'city' => 'Rio de Janeiro',
                'state' => 'RJ',
                'zip_code' => '22070-011',
            ],
            [
                'name' => 'Pedro Costa',
                'email' => 'pedro.costa@email.com',
                'phone' => '(31) 99999-4444',
                'birth_date' => '1990-03-18',
                'document_number' => '456.789.012-34',
                'address' => 'Rua da Liberdade, 321',
                'city' => 'Belo Horizonte',
                'state' => 'MG',
                'zip_code' => '30112-000',
            ],
            [
                'name' => 'Fernanda Almeida',
                'email' => 'fernanda.almeida@email.com',
                'phone' => '(47) 99999-5555',
                'birth_date' => '1993-07-09',
                'document_number' => '567.890.123-45',
                'address' => 'Rua das Palmeiras, 654',
                'city' => 'Florianópolis',
                'state' => 'SC',
                'zip_code' => '88010-120',
            ],
        ];

        foreach ($students as $student) {
            Student::create($student);
        }
    }
}
