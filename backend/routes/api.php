<?php

use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// API Routes
Route::prefix('v1')->group(function () {
    
    // Students
    Route::apiResource('students', StudentController::class);
    
    // Courses
    Route::apiResource('courses', CourseController::class);
    
    // Enrollments
    Route::apiResource('enrollments', EnrollmentController::class);
    
    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('dashboard', [ReportController::class, 'dashboard']);
        Route::get('total-by-student', [ReportController::class, 'totalByStudent']);
        Route::get('courses-with-most-students', [ReportController::class, 'coursesWithMostStudents']);
        Route::get('revenue-per-course', [ReportController::class, 'revenuePerCourse']);
        Route::get('summary', [ReportController::class, 'summary']);
    });
    
});
