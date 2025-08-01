<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Enrollment;

class StoreEnrollmentRequest extends FormRequest
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
        $enrollmentId = $this->route('enrollment') ? $this->route('enrollment')->id : null;
        
        return [
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'start_date' => 'required|date',
            'price_paid' => 'required|numeric|min:0',
            'status' => 'required|in:' . implode(',', [
                Enrollment::STATUS_ACTIVE,
                Enrollment::STATUS_CANCELLED,
                Enrollment::STATUS_COMPLETED
            ]),
        ];
    }

    /**
     * Additional validation rules.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $enrollmentId = $this->route('enrollment') ? $this->route('enrollment')->id : null;
            
            // Check if student is already enrolled in this course
            $existingEnrollment = Enrollment::where('student_id', $this->student_id)
                ->where('course_id', $this->course_id)
                ->when($enrollmentId, function ($query) use ($enrollmentId) {
                    return $query->where('id', '!=', $enrollmentId);
                })
                ->first();

            if ($existingEnrollment) {
                $validator->errors()->add('student_id', 'Este aluno já está matriculado neste curso.');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'student_id.required' => 'O aluno é obrigatório.',
            'student_id.exists' => 'O aluno selecionado não existe.',
            'course_id.required' => 'O curso é obrigatório.',
            'course_id.exists' => 'O curso selecionado não existe.',
            'start_date.required' => 'A data de início é obrigatória.',
            'start_date.date' => 'A data de início deve ser uma data válida.',
            'price_paid.required' => 'O valor pago é obrigatório.',
            'price_paid.numeric' => 'O valor pago deve ser um número.',
            'price_paid.min' => 'O valor pago não pode ser negativo.',
            'status.required' => 'O status é obrigatório.',
            'status.in' => 'O status deve ser: ativo, cancelado ou concluído.',
        ];
    }
}
