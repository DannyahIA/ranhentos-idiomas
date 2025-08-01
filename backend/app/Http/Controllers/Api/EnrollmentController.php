<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEnrollmentRequest;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $enrollments = Enrollment::with(['student', 'course'])
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $enrollments
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEnrollmentRequest $request): JsonResponse
    {
        $enrollment = Enrollment::create($request->validated());
        $enrollment->load(['student', 'course']);

        return response()->json([
            'success' => true,
            'message' => 'Enrollment created successfully',
            'data' => $enrollment
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Enrollment $enrollment): JsonResponse
    {
        $enrollment->load(['student', 'course']);

        return response()->json([
            'success' => true,
            'data' => $enrollment
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreEnrollmentRequest $request, Enrollment $enrollment): JsonResponse
    {
        $enrollment->update($request->validated());
        $enrollment->load(['student', 'course']);

        return response()->json([
            'success' => true,
            'message' => 'Enrollment updated successfully',
            'data' => $enrollment
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enrollment $enrollment): JsonResponse
    {
        $enrollment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Enrollment deleted successfully'
        ]);
    }
}
