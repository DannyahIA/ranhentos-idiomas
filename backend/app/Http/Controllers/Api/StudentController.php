<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $students = Student::with('enrollments.course')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $students
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentRequest $request): JsonResponse
    {
        $student = Student::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully',
            'data' => $student
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student): JsonResponse
    {
        $student->load('enrollments.course');

        return response()->json([
            'success' => true,
            'data' => $student
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreStudentRequest $request, Student $student): JsonResponse
    {
        $student->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data' => $student
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student): JsonResponse
    {
        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully'
        ]);
    }
}
