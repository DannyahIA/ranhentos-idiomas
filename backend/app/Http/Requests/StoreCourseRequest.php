<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_hours' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'max_students' => 'nullable|integer|min:1',
            'status' => 'required|in:active,inactive',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'O nome do curso é obrigatório.',
            'duration_hours.required' => 'A duração em horas é obrigatória.',
            'duration_hours.integer' => 'A duração deve ser um número inteiro.',
            'duration_hours.min' => 'A duração deve ser pelo menos 1 hora.',
            'price.required' => 'O preço é obrigatório.',
            'price.numeric' => 'O preço deve ser um valor numérico.',
            'price.min' => 'O preço não pode ser negativo.',
            'max_students.integer' => 'O número máximo de alunos deve ser um número inteiro.',
            'max_students.min' => 'O número máximo de alunos deve ser pelo menos 1.',
            'status.required' => 'O status é obrigatório.',
            'status.in' => 'O status deve ser "active" ou "inactive".',
        ];
    }
}
