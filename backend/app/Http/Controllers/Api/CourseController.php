<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseRequest;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $courses = Course::with('enrollments.student')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseRequest $request): JsonResponse
    {
        $course = Course::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully',
            'data' => $course
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course): JsonResponse
    {
        $course->load('enrollments.student');

        return response()->json([
            'success' => true,
            'data' => $course
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreCourseRequest $request, Course $course): JsonResponse
    {
        $course->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully',
            'data' => $course
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course): JsonResponse
    {
        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully'
        ]);
    }
}
